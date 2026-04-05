import React, { useMemo, useState } from 'react';
import { Card, Button, Input } from './UI';
import { rolesResource } from '../lib/api/resources/roles';
import { permissionsResource } from '../lib/api/resources/permissions';
import { workTypesResource } from '../lib/api/resources/workTypes';
import { teamsResource } from '../lib/api/resources/teams';
import { usersResource } from '../lib/api/resources/users';
import { productsResource } from '../lib/api/resources/products';
import { inventoryResource } from '../lib/api/resources/inventory';

export const SuperAdmin = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [workTypes, setWorkTypes] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    const results = await Promise.allSettled([
      rolesResource.list(),
      permissionsResource.list(),
      workTypesResource.list(),
      teamsResource.list(),
      usersResource.list({ page: 1, limit: 100 }),
      productsResource.list({ page: 1, limit: 100 }),
    ]);
    const [r, p, w, t, u, pr] = results;
    if (r.status === 'fulfilled') setRoles(r.value as any[]);
    if (p.status === 'fulfilled') setPermissions(p.value as any[]);
    if (w.status === 'fulfilled') setWorkTypes(w.value as any[]);
    if (t.status === 'fulfilled') setTeams(t.value as any[]);
    if (u.status === 'fulfilled') setUsers((u.value as any).items || []);
    if (pr.status === 'fulfilled') setProducts((pr.value as any).items || []);
    const failed = results.find((res) => res.status === 'rejected');
    if (failed) setError('Some data failed to load. Check the server and try refresh.');
    setLoading(false);
  };

  React.useEffect(() => {
    loadAll();
  }, [refreshKey]);

  const refresh = () => setRefreshKey((k) => k + 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Super Admin</h1>
        <p className="text-slate-500">Manage all seed data in one place.</p>
        <div className="mt-3 flex items-center gap-3">
          <Button size="sm" onClick={refresh}>Refresh Data</Button>
          {loading && <span className="text-xs text-slate-400">Loading...</span>}
          {error && <span className="text-xs text-rose-600">{error}</span>}
        </div>
      </div>

      <Section title="Roles">
        <SimpleList
          items={roles}
          fields={[{ key: 'name', label: 'Name' }, { key: 'description', label: 'Description' }]}
          onCreate={(payload) => rolesResource.create(payload)}
          onUpdate={(id, payload) => rolesResource.update(id, payload)}
          onDelete={(id) => rolesResource.remove(id)}
          onRefresh={refresh}
        />
      </Section>

      <Section title="Permissions">
        <SimpleList
          items={permissions}
          fields={[{ key: 'code', label: 'Code' }, { key: 'description', label: 'Description' }]}
          onCreate={(payload) => permissionsResource.create(payload)}
          onUpdate={(id, payload) => permissionsResource.update(id, payload)}
          onDelete={(id) => permissionsResource.remove(id)}
          onRefresh={refresh}
        />
      </Section>

      <Section title="Work Types">
        <SimpleList
          items={workTypes}
          fields={[{ key: 'name', label: 'Name' }, { key: 'description', label: 'Description' }]}
          onCreate={(payload) => workTypesResource.create(payload)}
          onUpdate={(id, payload) => workTypesResource.update(id, payload)}
          onDelete={(id) => workTypesResource.remove(id)}
          onRefresh={refresh}
        />
      </Section>

      <Section title="Teams">
        <SimpleList
          items={teams}
          fields={[{ key: 'name', label: 'Name' }]}
          onCreate={(payload) => teamsResource.create(payload)}
          onUpdate={(id, payload) => teamsResource.update(id, payload)}
          onDelete={(id) => teamsResource.remove(id)}
          onRefresh={refresh}
        />
      </Section>

      <Section title="Users">
        <UsersList items={users} roles={roles} onRefresh={refresh} />
      </Section>

      <Section title="Products">
        <ProductsList items={products} onRefresh={refresh} />
      </Section>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Card className="p-6 space-y-4">
    <h2 className="text-lg font-semibold">{title}</h2>
    {children}
  </Card>
);

const SimpleList = ({ items, fields, onCreate, onUpdate, onDelete, onRefresh }: any) => {
  const [draft, setDraft] = useState<any>({});
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {fields.map((f: any) => (
          <Input
            key={f.key}
            placeholder={f.label}
            value={draft[f.key] || ''}
            onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
          />
        ))}
        <Button
          onClick={async () => {
            await onCreate(draft);
            setDraft({});
            onRefresh();
          }}
        >
          Add
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item: any) => (
          <div key={item.id} className="grid grid-cols-1 gap-2 md:grid-cols-4 items-center">
            {fields.map((f: any) => (
              <Input
                key={f.key}
                value={item[f.key] || ''}
                onChange={(e) => {
                  item[f.key] = e.target.value;
                }}
              />
            ))}
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={async () => {
                  const payload: any = {};
                  fields.forEach((f: any) => (payload[f.key] = item[f.key]));
                  await onUpdate(item.id, payload);
                  onRefresh();
                }}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={async () => {
                  await onDelete(item.id);
                  onRefresh();
                }}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-sm text-slate-400">No records yet.</div>}
      </div>
    </div>
  );
};

const UsersList = ({ items, roles, onRefresh }: any) => {
  const [draft, setDraft] = useState<any>({ fullName: '', email: '', password: '' });
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
        <Input placeholder="Full name" value={draft.fullName} onChange={(e) => setDraft({ ...draft, fullName: e.target.value })} />
        <Input placeholder="Email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
        <Input placeholder="Password" value={draft.password} onChange={(e) => setDraft({ ...draft, password: e.target.value })} />
        <Button
          onClick={async () => {
            await usersResource.create(draft);
            setDraft({ fullName: '', email: '', password: '' });
            onRefresh();
          }}
        >
          Add User
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((u: any) => (
          <div key={u.id} className="grid grid-cols-1 gap-2 md:grid-cols-6 items-center">
            <Input value={u.fullName || ''} onChange={(e) => (u.fullName = e.target.value)} />
            <Input value={u.email || ''} onChange={(e) => (u.email = e.target.value)} />
            <select
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={u.Roles?.[0]?.id || ''}
              onChange={(e) => (u.roleId = e.target.value)}
            >
              <option value="">Role</option>
              {roles.map((r: any) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <select
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={u.isActive ? 'true' : 'false'}
              onChange={(e) => (u.isActive = e.target.value === 'true')}
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
            <Button
              size="sm"
              onClick={async () => {
                await usersResource.updateWithRoles(u.id, {
                  fullName: u.fullName,
                  email: u.email,
                  isActive: u.isActive,
                  roleIds: u.roleId ? [u.roleId] : u.Roles?.map((r: any) => r.id) || [],
                });
                onRefresh();
              }}
            >
              Save
            </Button>
            <Button size="sm" variant="danger" onClick={async () => { await usersResource.remove(u.id); onRefresh(); }}>
              Delete
            </Button>
          </div>
        ))}
        {items.length === 0 && <div className="text-sm text-slate-400">No users found.</div>}
      </div>
    </div>
  );
};

const ProductsList = ({ items, onRefresh }: any) => {
  const [draft, setDraft] = useState<any>({ sku: '', name: '', type: 'raw', unit: '', sellingPrice: '' });
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-6">
        <Input placeholder="SKU" value={draft.sku} onChange={(e) => setDraft({ ...draft, sku: e.target.value })} />
        <Input placeholder="Name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
        <select
          className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
          value={draft.type}
          onChange={(e) => setDraft({ ...draft, type: e.target.value })}
        >
          <option value="raw">Raw</option>
          <option value="finished">Finished</option>
        </select>
        <Input placeholder="Unit" value={draft.unit} onChange={(e) => setDraft({ ...draft, unit: e.target.value })} />
        <Input placeholder="Price" value={draft.sellingPrice} onChange={(e) => setDraft({ ...draft, sellingPrice: e.target.value })} />
        <Button
          onClick={async () => {
            await productsResource.create({
              sku: draft.sku,
              name: draft.name,
              type: draft.type,
              unit: draft.unit,
              sellingPrice: Number(draft.sellingPrice || 0),
            });
            setDraft({ sku: '', name: '', type: 'raw', unit: '', sellingPrice: '' });
            onRefresh();
          }}
        >
          Add Product
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((p: any) => (
          <div key={p.id} className="grid grid-cols-1 gap-2 md:grid-cols-7 items-center">
            <Input value={p.sku || ''} onChange={(e) => (p.sku = e.target.value)} />
            <Input value={p.name || ''} onChange={(e) => (p.name = e.target.value)} />
            <select
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-slate-800 dark:bg-slate-950"
              value={p.type || 'raw'}
              onChange={(e) => (p.type = e.target.value)}
            >
              <option value="raw">Raw</option>
              <option value="finished">Finished</option>
            </select>
            <Input value={p.unit || ''} onChange={(e) => (p.unit = e.target.value)} />
            <Input value={p.sellingPrice || ''} onChange={(e) => (p.sellingPrice = e.target.value)} />
            <Input
              placeholder="Stock"
              value={p.stock || ''}
              onChange={(e) => (p.stock = e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={async () => {
                  await productsResource.update(p.id, {
                    sku: p.sku,
                    name: p.name,
                    type: p.type,
                    unit: p.unit,
                    sellingPrice: Number(p.sellingPrice || 0),
                  });
                  if (p.stock !== undefined && p.stock !== '') {
                    await inventoryResource.updateStock(p.id, { quantity: Number(p.stock || 0) });
                  }
                  onRefresh();
                }}
              >
                Save
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-sm text-slate-400">No products yet.</div>}
      </div>
    </div>
  );
};
