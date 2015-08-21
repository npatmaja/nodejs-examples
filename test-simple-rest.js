var expect = require('chai').expect;
var request = require('supertest');
var app = require('./simple-rest');

describe('simple RESTful', function() {
  describe('GET /api', function() {
    it('returns hello world', function(done) {
      request(app)
        .get('/api')
        .expect('content-type', /json/)
        .expect(200)
        .end(function(err, data) {
          expect(err).to.be.not.ok;
          expect(data.body.message).to.be.eq('hello world');
          done();
        });
    });
  });

  describe('GET /api/tigers', function() {
    it('returns list of two tigers', function(done) {
      request(app)
        .get('/api/tigers')
        .expect('content-type', /json/)
        .expect(200)
        .end(function(err, data) {
          expect(err).to.be.not.ok;
          expect(data.body).to.have.length(2);
          done();
        });
    });
  });

  describe('POST /api/tigers', function() {
    it('returns list of two tigers', function(done) {
      request(app)
        .post('/api/tigers')
        .send({ name: 'Panthera' })
        .expect('content-type', /json/)
        .expect(200)
        .end(function(err, data) {
          expect(err).to.be.not.ok;
          expect(data.body).to.have.length(3);
          expect(data.body).to.have.deep.property('[2].name', 'Panthera');
          expect(data.body).to.have.deep.property('[2].id', 3);
          done();
        });
    });
  });

  describe('GET /api/tigers/:id', function() {
    it('returns list of two tigers', function(done) {
      request(app)
        .get(['/api/tigers', 1].join('/'))
        .expect('content-type', /json/)
        .expect(200)
        .end(function(err, data) {
          expect(err).to.be.not.ok;
          expect(data.body.name).to.be.eq('Tigris');
          done();
        });
    });
  });

  describe('PUT /api/tigers/:id', function() {
    it('returns list of two tigers', function(done) {
      request(app)
        .put(['/api/tigers', 1].join('/'))
        .send({ name: 'Tigris1' })
        .expect('content-type', /json/)
        .expect(200)
        .end(function(err, data) {
          expect(err).to.be.not.ok;
          expect(data.body.name).to.be.eq('Tigris1');
          done();
        });
    });
  });

  describe('DELETE /api/tigers/:id', function() {
    describe('when wrong id given', function(done) {
      it('returns 404', function(done) {
        request(app)
          .delete(['/api/tigers', 10].join('/'))
          .expect('content-type', /json/)
          .expect(404)
          .end(function(err, data) {
            expect(err).to.be.not.ok;
            expect(data.body.message).to.be.eq('Something wrong when deleting a tiger with id 10');
            done();
          });
      });
    });

    describe('when correct id given', function(done) {
      it('returns 200', function(done) {
        request(app)
          .delete(['/api/tigers', 1].join('/'))
          .expect('content-type', /json/)
          .expect(200)
          .end(function(err, data) {
            expect(err).to.be.not.ok;
            expect(data.body.message).to.be.eq(['Tiger with id ', 1, 'successfully deleted'].join(' '));
            done();
          });
      });
    });
  });
});
