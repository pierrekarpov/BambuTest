var expect  = require('chai').expect;
var request = require('request');
describe('Status and content', function() {
    describe ('Main page', function() {
        it('status', function(done){
            request('http://localhost:8080/', function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it('content', function(done) {
            request('http://localhost:8080/' , function(error, response, body) {
                expect(body).to.equal('Hello World');
                done();
            });
        });
    });

    describe ('People like you (no param)', function() {
        it('status', function(done){
            request('http://localhost:8080/people-like-you', function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it('content', function(done) {
            request('http://localhost:8080/people-like-you' , function(error, response, body) {
                expect(body).to.equal('Searching for People like you');
                done();
            });
        });
    });

    describe ('People like you (with correct params)', function() {
        it('status', function(done){
            request('http://localhost:8080/people-like-you?age=23&latitude=40.71667&longitude=19.56667', function(error, response, body) {
                expect(response.statusCode).to.equal(200);
                done();
            });
        });

        it('content', function(done) {
            request('http://localhost:8080/people-like-you?age=23&latitude=40.71667&longitude=19.56667' , function(error, response, body) {
                expect(body).to.equal('Searching for People like you');
                done();
            });
        });
    });

    describe ('About page', function() {
        it('status', function(done){
            request('http://localhost:8080/about', function(error, response, body) {
                expect(response.statusCode).to.equal(404);
                done();
            });
        });
    });
});
