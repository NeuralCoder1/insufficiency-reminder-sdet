const assert = require('node:assert/strict');
const { once } = require('node:events');
const { spawn } = require('node:child_process');
const path = require('node:path');
const test = require('node:test');
const supertest = require('supertest');

const appDirectory = path.resolve(__dirname, '..');
const port = 3105;
const baseUrl = `http://127.0.0.1:${port}`;
let serverProcess;

test.before(async () => {
  serverProcess = spawn(process.execPath, ['server.js'], {
    cwd: appDirectory,
    env: { ...process.env, PORT: String(port) },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  await once(serverProcess.stdout, 'data');
});

test.after(() => {
  serverProcess.kill();
});

async function freshAgent() {
  const agent = supertest.agent(baseUrl);
  await agent.post('/api/reset').expect(200);
  return agent;
}

test('BUG-05-09: status filtering treats equivalent casing identically', async () => {
  const agent = await freshAgent();
  const uppercase = await agent.get('/api/insufficiencies?status=OPEN').expect(200);
  const lowercase = await agent.get('/api/insufficiencies?status=open').expect(200);

  assert.deepEqual(lowercase.body, uppercase.body);
});

test('BUG-05-03: reminding a RESOLVED insufficiency returns 400', async () => {
  const agent = await freshAgent();

  await agent.post('/api/insufficiencies/3/remind').expect(400);
});

test('BUG-05-02: resolving a nonexistent insufficiency returns 404', async () => {
  const agent = await freshAgent();

  await agent.patch('/api/insufficiencies/999/resolve').expect(404);
});

test('BUG-05-01: creating an insufficiency requires candidateName', async () => {
  const agent = await freshAgent();

  await agent
    .post('/api/insufficiencies')
    .send({ reason: 'Address proof unclear' })
    .expect(400);
});

test('BUG-05-15: reminder response contains the incremented reminderCount', async () => {
  const agent = await freshAgent();

  const response = await agent.post('/api/insufficiencies/2/remind').expect(200);

  assert.equal(response.body.reminderCount, 3);
});