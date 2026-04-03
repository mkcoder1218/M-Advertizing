import React, { useEffect, useRef, useState } from 'react';
import { Card, Badge, Button, Input } from './UI';
import { useAttendance, useCreateAttendance, useUpdateAttendance, useMarkAttendance, useMyAttendance } from '../lib/api/hooks/useAttendance';
import { useEmployees } from '../lib/api/hooks/useHr';
import { cn } from '../lib/utils';
import { useApp } from '../context/AppContext';
import { useUsers, useUpdateAttendanceLocation } from '../lib/api/hooks/useUserProfile';

const getAttendanceDate = () => {
  const now = new Date();
  if (now.getHours() < 6) {
    const prev = new Date(now);
    prev.setDate(prev.getDate() - 1);
    return prev.toISOString().slice(0, 10);
  }
  return now.toISOString().slice(0, 10);
};

export const Attendance = () => {
  const { role } = useApp();
  const isAdmin = role === 'OWNER' || role === 'HR';
  const [date, setDate] = useState(getAttendanceDate());
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { data } = useAttendance(date, page, limit);
  const { data: myAttendance } = useMyAttendance(date);
  const attendance = data?.items || [];
  const { data: employeesData } = useEmployees();
  const employees = employeesData?.items || [];
  const createMutation = useCreateAttendance();
  const updateMutation = useUpdateAttendance();
  const markMutation = useMarkAttendance();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({ employeeId: '', status: 'PRESENT', notes: '' });
  const [locationError, setLocationError] = useState<string | null>(null);
  const [outside, setOutside] = useState(false);
  const { data: usersData } = useUsers({ page: 1, limit: 200 });
  const updateLocation = useUpdateAttendanceLocation();
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationUserId, setLocationUserId] = useState<string | null>(null);
  const [locLat, setLocLat] = useState<number | null>(null);
  const [locLng, setLocLng] = useState<number | null>(null);
  const [locRadius, setLocRadius] = useState(50);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<any>(null);

  useEffect(() => {
    if (!locationOpen || !mapRef.current) return;
    let map: any;
    let marker: any;
    (async () => {
      const L = await import('leaflet');
      if (!mapRef.current) return;
      map = L.map(mapRef.current).setView([locLat || -1.286389, locLng || 36.817223], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);
      marker = L.marker([locLat || -1.286389, locLng || 36.817223], { draggable: true }).addTo(map);
      marker.on('dragend', (e: any) => {
        const p = e.target.getLatLng();
        setLocLat(p.lat);
        setLocLng(p.lng);
      });
      map.on('click', (e: any) => {
        setLocLat(e.latlng.lat);
        setLocLng(e.latlng.lng);
        marker.setLatLng(e.latlng);
      });
      leafletRef.current = { map, marker };
    })();
    return () => {
      if (leafletRef.current?.map) {
        leafletRef.current.map.remove();
        leafletRef.current = null;
      }
    };
  }, [locationOpen]);

  const handleCreate = async () => {
    if (!form.employeeId) return;
    await createMutation.mutateAsync({ employeeId: form.employeeId, date, status: form.status as any, notes: form.notes || undefined });
    setDrawerOpen(false);
    setForm({ employeeId: '', status: 'PRESENT', notes: '' });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-slate-500">Track daily attendance for workers.</p>
        </div>
        <div className="flex items-center gap-3">
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <Button onClick={() => setDrawerOpen(true)}>Mark Attendance</Button>
        </div>
      </div>

      {!isAdmin && (
        <Card className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-bold">Your Attendance</h3>
              <p className="text-sm text-slate-500">Marked daily, resets at 6:00 AM.</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={myAttendance?.status === 'PRESENT' ? 'success' : myAttendance?.status === 'ON_LEAVE' ? 'info' : 'warning'}>
                {myAttendance?.status || 'ABSENT'}
              </Badge>
              <Button
                onClick={async () => {
                  setLocationError(null);
                  setOutside(false);
                  if (!navigator.geolocation) {
                    setLocationError('Geolocation is not supported on this device.');
                    return;
                  }
                  navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                      try {
                        await markMutation.mutateAsync({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                      } catch (err: any) {
                        if (err?.response?.status === 403) {
                          setOutside(true);
                          setLocationError('You are outside the allowed location radius.');
                        } else {
                          setLocationError('Unable to mark attendance. Please try again.');
                        }
                      }
                    },
                    () => setLocationError('Unable to read your location. Please enable location access.')
                  );
                }}
                isLoading={markMutation.isPending}
                disabled={outside}
              >
                Mark Present
              </Button>
            </div>
          </div>
          {locationError && <div className="mt-3 text-xs text-red-600">{locationError}</div>}
        </Card>
      )}

      {isAdmin && (
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">Attendance Locations</h3>
            <Badge variant="info">{usersData?.items?.length || 0} users</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(usersData?.items || []).map((u: any) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3">{u.fullName}</td>
                    <td className="px-4 py-3 text-slate-500">{u.email}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {u.attendanceLat && u.attendanceLng ? `${u.attendanceLat}, ${u.attendanceLng}` : 'Not set'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setLocationUserId(u.id);
                          setLocLat(u.attendanceLat ?? null);
                          setLocLng(u.attendanceLng ?? null);
                          setLocRadius(u.attendanceRadiusM ?? 50);
                          setLocationOpen(true);
                        }}
                      >
                        Set Location
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {isAdmin && (
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-semibold">Attendance List</h3>
          <Badge variant="info">{data?.total || 0} records</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                <th className="px-6 py-4 font-semibold">Employee</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {attendance.map((a: any) => (
                <tr key={a.id}>
                  <td className="px-6 py-4">{a.Employee ? `${a.Employee.firstName} ${a.Employee.lastName}` : a.employeeId}</td>
                  <td className="px-6 py-4">{a.date}</td>
                  <td className="px-6 py-4">
                    <select
                      className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
                      value={a.status}
                      onChange={(e) => updateMutation.mutate({ id: a.id, status: e.target.value as any })}
                    >
                      <option value="PRESENT">PRESENT</option>
                      <option value="ABSENT">ABSENT</option>
                      <option value="ON_LEAVE">ON LEAVE</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{a.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      )}

      {isAdmin && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-500">Page {page} of {data ? Math.ceil(data.total / data.limit) : 1}</div>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(data ? Math.ceil(data.total / data.limit) : 1, p + 1))}>Next</Button>
          </div>
        </div>
      )}

      {/* Drawer */}
      {isAdmin && (
      <div className={cn('fixed inset-0 z-50', drawerOpen ? 'pointer-events-auto' : 'pointer-events-none')}>
        <div
          className={cn('absolute inset-0 bg-black/40 transition-opacity', drawerOpen ? 'opacity-100' : 'opacity-0')}
          onClick={() => setDrawerOpen(false)}
        />
        <div
          className={cn(
            'absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl dark:bg-slate-900 transition-transform',
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
              <h3 className="text-lg font-bold">Mark Attendance</h3>
              <p className="text-sm text-slate-500">Choose employee and status.</p>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Employee</label>
                <select
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
                  value={form.employeeId}
                  onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                >
                  <option value="">Select employee</option>
                  {employees.map((e: any) => (
                    <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="PRESENT">PRESENT</option>
                  <option value="ABSENT">ABSENT</option>
                  <option value="ON_LEAVE">ON LEAVE</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-950"
                  rows={3}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>
            <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-800">
              <div className="flex items-center justify-end space-x-3">
                <Button variant="outline" onClick={() => setDrawerOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate} isLoading={createMutation.isPending}>Save</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Location Drawer */}
      <div className={cn('fixed inset-0 z-50', locationOpen ? 'pointer-events-auto' : 'pointer-events-none')}>
        <div
          className={cn('absolute inset-0 bg-black/40 transition-opacity', locationOpen ? 'opacity-100' : 'opacity-0')}
          onClick={() => setLocationOpen(false)}
        />
        <div
          className={cn(
            'absolute right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl dark:bg-slate-900 transition-transform',
            locationOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
              <h3 className="text-lg font-bold">Attendance Location</h3>
              <p className="text-sm text-slate-500">Pick a location on the map (OpenStreetMap).</p>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
              <div ref={mapRef} className="h-80 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800" />
              <Button
                variant="outline"
                onClick={() => {
                  if (!navigator.geolocation) return;
                  navigator.geolocation.getCurrentPosition((pos) => {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    setLocLat(lat);
                    setLocLng(lng);
                    if (leafletRef.current?.map && leafletRef.current?.marker) {
                      leafletRef.current.map.setView([lat, lng], 15);
                      leafletRef.current.marker.setLatLng([lat, lng]);
                    }
                  });
                }}
              >
                Use Current Location
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Latitude</label>
                  <Input value={locLat ?? ''} onChange={(e) => setLocLat(Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Longitude</label>
                  <Input value={locLng ?? ''} onChange={(e) => setLocLng(Number(e.target.value))} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Allowed Radius (meters)</label>
                <Input type="number" value={locRadius} onChange={(e) => setLocRadius(Number(e.target.value))} />
              </div>
            </div>
            <div className="border-t border-slate-100 px-6 py-4 dark:border-slate-800">
              <div className="flex items-center justify-end space-x-3">
                <Button variant="outline" onClick={() => setLocationOpen(false)}>Cancel</Button>
                <Button
                  onClick={async () => {
                    if (!locationUserId || locLat == null || locLng == null) return;
                    await updateLocation.mutateAsync({
                      id: locationUserId,
                      payload: { attendanceLat: locLat, attendanceLng: locLng, attendanceRadiusM: locRadius },
                    });
                    setLocationOpen(false);
                  }}
                >
                  Save Location
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
