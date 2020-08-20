const moxios = require('moxios');
const { expect, assert } = require('chai');
const sinon = require('sinon');

const { getJSON } = require('../src/requestJSON');
const { validateUserInput, logData } = require('../src/inputOutput');

describe('mocking axios requests', () => {
    beforeEach(() => moxios.install());

    afterEach(() => moxios.uninstall());

    it('stub response to url', (done) => {

        moxios.stubRequest('https://jsonplaceholder.typicode.com/photos?albumId=1',{
            status: 200,
            response: [
                {
                    id: 'testId',
                    title: 'testTitle',
                }
            ] 
        });

        getJSON(function(input){
            assert.equal(input[0].id,'testId');
            assert.equal(input[0].title,'testTitle');
        }, 1);

        done();
    });

    it('supposed to fail due to error', (done) => {

        moxios.stubRequest('https://jsonplaceholder.typicode.com/photos?albumId=1', {
            status: 503,
            error: "Service Unavailable",
            message: "server under maintenance"
        });

        getJSON((input) => {
            expect(input.response.status).to.be(503);
            expect(input.response.error).to.be("Service Unavailable");
            expect(input.response.message).to.be("server under maintenance");
        }, 1);

        done();
    });
});


describe('mock input to stdin', () => {

    describe('tests that output usage information', () => {

        it('takes partially typed input as input and fails', (done) => {
            assert.equal(validateUserInput(['photo-albu']),'Usage: photo-album <album category to select>');
            done();
        });
    
        it('takes incomplete input as input and fails', (done) => {
    
            assert.equal(
                validateUserInput(['photo-album']),
                'Usage: photo-album <album category to select>'
                );
            done();
        });
    
    
        it('takes NAN as 2nd input and fails', (done) => {
    
            assert.equal(
                validateUserInput(['photo-album', '1&']),
                'Usage: photo-album <album category to select>'
                );
            done();
        });

        it('takes too many inputs and fails', (done) => {

            assert.equal(
                validateUserInput(['photo-album', '1', '1']),
                'Usage: photo-album <album category to select>'
            );
            done();
        });

        it('takes too large of album number and fails', (done) => {
            assert.equal(
                validateUserInput(['photo-album', '101']),
                'Number is greater than number of albums'
            );
            done();
        });

        it('takes number smaller than 1 and fails', (done) => {
            assert.equal(
                validateUserInput(['photo-album', '0']),
                'Invalid album number'
            );
            done();
        });
    });

    describe('tests that are successful', () => {

        beforeEach(() => {
            moxios.install();
        });

        afterEach(() => {
            moxios.uninstall();
        });
        
        //Decided from a user perspective that it would be more inconvenient
        //to accidently hit the space bar and be forced to type the command
        //all over again.

        it('takes whitespace between cmd and input and passes', (done) => {
            
            moxios.stubRequest('https://jsonplaceholder.typicode.com/photos?albumId=1',{
                status: 200
            });
            
            assert.equal(validateUserInput(['photo-album',' ','1']), '');
            done();
        });
    
        it('takes valid input as input', (done) => {
            
            moxios.stubRequest('https://jsonplaceholder.typicode.com/photos?albumId=1',{
                status: 200
            });

            assert.equal(validateUserInput(['photo-album','1']),'');
            done();
        });
        
    });    
});

describe('testing logging function', () => {

    it('logs the json data', (done) => {

        let logSpy = sinon.spy(console, 'log');
        logData([{id:'testId', title: 'testTitle'}]);
        logSpy.restore();
        assert.equal(logSpy.callCount, 1);
        assert.equal(logSpy.args[0], '[testId] testTitle');
        done();
    });
});
