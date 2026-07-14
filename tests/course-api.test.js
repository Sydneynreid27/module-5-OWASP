const test = require('node:test');
const assert = require('node:assert/strict');

async function request(path, options = {}) {
  const response = await fetch(`http://127.0.0.1:3000${path}`, options);
  const text = await response.text();
  let payload = text;

  try {
    payload = JSON.parse(text);
  } catch {
    // response body is not JSON
  }

  return { response, payload };
}

test('GET /api/courses returns an array', async () => {
  const { response, payload } = await request('/api/courses');
  assert.equal(response.status, 200);
  assert.ok(Array.isArray(payload));
});

test('POST /api/courses creates a course', async () => {
  const { response, payload } = await request('/api/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subject: 'CSCI',
      number: '250',
      name: 'Test Course',
      credits: 3,
      description: 'Temporary test course'
    })
  });

  assert.equal(response.status, 201);
  assert.equal(payload.name, 'Test Course');
  assert.ok(payload.id);
});

test('PUT /api/courses/:id updates a course and DELETE removes it', async () => {
  const createResponse = await request('/api/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subject: 'MATH',
      number: '200',
      name: 'Temporary Course',
      credits: 4,
      description: 'Will be updated then deleted'
    })
  });

  const createdCourse = createResponse.payload;
  const updateResponse = await request(`/api/courses/${createdCourse.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      subject: 'MATH',
      number: '200',
      name: 'Updated Course',
      credits: 4,
      description: 'Updated description'
    })
  });

  assert.equal(updateResponse.response.status, 200);
  assert.equal(updateResponse.payload.name, 'Updated Course');

  const deleteResponse = await request(`/api/courses/${createdCourse.id}`, {
    method: 'DELETE'
  });

  assert.equal(deleteResponse.response.status, 204);
});
