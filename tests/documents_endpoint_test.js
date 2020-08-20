/**
 * This file implements tests for the documents/ endpoint API.
 * 
 */
const request = require("supertest-as-promised");
const chai = require('chai');
const { assert, expect } = chai;
require('dotenv').config();
chai.should();

// NOTE: Update this URL to match your deployment endpoint:
let baseUrl =  'https://efx9x5k3bc.execute-api.us-east-1.amazonaws.com/dev';

describe('CRUD Operations for documents endpoint', function () {

  let doc_1 = {
    id: 'API_TEST_DOC_1',
    name: 'First Test Doc',
    title: 'This is a Document Title',
    words: 3600,
    s3link: 'https://s3.bucket.location/doc_1',
  };

  let doc_2 = {
    id: 'API_TEST_DOC_2',
    name: 'Second Test Doc',
    title: 'This is a Document Title',
    words: 3600,
    s3link: 'https://s3.bucket.location/doc_2',
  };

  let doc_missing_id = {
    name: 'Test Doc Missing id',
    title: 'This is a Document Title',
    words: 3600,
    s3link: 'https://s3.bucket.location/doc_missing_id',
  };

  let doc_missing_name = {
    id: 'API_TEST_DOC_3',
    title: 'This is a Document Title',
    words: 3600,
    s3link: 'https://s3.bucket.location/doc_missing_id',
  };

  it('Creates and responds with 200 and status of success', function (done) {
    request(baseUrl)
    .post('/documents')
    .send(doc_1)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect((res) => {
      const response = res.body;
      expect(response.status).to.equal('success'); 
    }) 
    .end((err) => {
        if (err) return done(err);
        done();
    });
  });

  it('Creates a second document and responds with 200 and status of success', function (done) {
    request(baseUrl)
    .post('/documents')
    .send(doc_2)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect((res) => {
      const response = res.body;
      expect(response.status).to.equal('success'); 
    }) 
    .end((err) => {
        if (err) return done(err);
        done();
    });
  });

  it('Gets a list of documents that includes the two test documents just added', function (done) {
    request(baseUrl)
    .get(`/documents`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect((res) => {
      response = res;
      const documents = res.body;
      expect(documents).to.be.an('array');
      expect(documents.length).greaterThan(1);
      let doc1 = documents.find(v => v.id === 'API_TEST_DOC_1');
      let doc2 =  documents.find(v => v.id === 'API_TEST_DOC_2');
      expect(doc1).to.not.be.undefined;
      expect(doc1).to.not.be.undefined;
    }) 
    .end((err) => {
        if (err) return done(err);
        done();
    });
  });

  it('Fails to create a doc with missing id', function (done) {
    request(baseUrl)
    .post('/documents')
    .send(doc_missing_id)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(422)
    .expect((res) => {
      const response = res.body;
      expect(response.status).to.equal('failed'); 
      expect(response.errorMessage).to.equal('The id field is required in document meta data')
    }) 
    .end((err) => {
        if (err) return done(err);
        done();
    });
  });

  it('Fails to create a doc with missing name', function (done) {
    request(baseUrl)
    .post('/documents')
    .send(doc_missing_name)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(422)
    .expect((res) => {
      const response = res.body;
      expect(response.status).to.equal('failed'); 
      expect(response.errorMessage).to.equal('The name field is required in document meta data')
    }) 
    .end((err) => {
        if (err) return done(err);
        done();
    });
  });
 
  it('Successfully deletes the first document', function(done) {
    request(baseUrl)
    .delete(`/documents/${doc_1.id}`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(204)
    .expect((res) => { response = res; })
    .end((err) => {
      if (err) return done(err);
      done();
    });
  });

  it('Successfully deletes the second document', function(done) {
    request(baseUrl)
    .delete(`/documents/${doc_2.id}`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(204)
    .expect((res) => { response = res; })
    .end((err) => {
      if (err) return done(err);
      done();
    });
  });

  it('Gets a list of documents that no longer includes the two deleted test documents', function (done) {
    request(baseUrl)
    .get(`/documents`)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .expect((res) => {
      response = res;
      const documents = res.body;
      expect(documents).to.be.an('array');
      let doc1 = documents.find(v => v.id === 'API_TEST_DOC_1');
      let doc2 =  documents.find(v => v.id === 'API_TEST_DOC_2');
      expect(doc1).to.be.undefined;
      expect(doc1).to.be.undefined;
    }) 
    .end((err) => {
        if (err) return done(err);
        done();
    });
  });

});
