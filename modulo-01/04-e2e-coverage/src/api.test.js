// Essa lib mocha é a mais utilizada para testes em JavaScript, ela é a base para muitos outros frameworks de teste
const { describe, it, after, before } = require('mocha')
//Essa lib supertest é uma lib de teste para APIs
const supertest = require('supertest')
const assert = require('assert')
describe('API Suite test', () => {

  let app
  before((done) => {
    app = require('./api')
    app.once('listening', done)
  })

  after(done => app.close(done))

  // Separar os testes por rota, para facilitar a leitura e manutenção dos testes
  describe('/contact:get', () => {
    it('should request the contact route and return HTTP Status 200', async () => {
      const response = await supertest(app)
        .get('/contact')
        .expect(200)

      assert.strictEqual(response.text, 'contact us page')
    })
  })

  describe('/login:post', () => {
    it('should request the login and return HTTP Status 200', async () => {
      const response = await supertest(app)
        .post('/login')
        .send({ username: "vanessamesalira", password: "123" })
        .expect(200)

      assert.strictEqual(response.text, 'Log in succeeded!')
    })

    it('should request the login and return HTTP Status 401', async () => {
      const response = await supertest(app)
        .post('/login')
        .send({ username: "xuxadasilva", password: "123" })
        .expect(401)

      assert.ok(response.unauthorized)
      assert.strictEqual(response.text, 'Log in failed!')
    })
  })

  describe('/hi:get - 404', () => {
    it('should request and existing page and return HTTP Status 404', async () => {
      const response = await supertest(app)
        .get('/hi')
        .expect(404)

      assert.strictEqual(response.text, 'not found!')
    })
  })
})