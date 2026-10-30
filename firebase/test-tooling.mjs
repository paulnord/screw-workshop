import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {Gaxios}=require('gaxios');
// Exercise the exact UUID v4 multipart path retained by gaxios 6, without network.
const client=new Gaxios();
const response=await client.request({url:'https://example.invalid/',method:'POST',multipart:[{headers:{'Content-Type':'text/plain'},content:'hello'}],adapter:async options=>{assert.match(options.headers['Content-Type'],/boundary=[a-f0-9-]{36}/);let body='';for await(const part of options.body)body+=part.toString();assert.ok(body.includes('hello'));return {status:200,statusText:'OK',headers:{},config:options,data:'ok'};}});
assert.equal(response.data,'ok');
console.log('PASS targeted tooling override: gaxios CommonJS UUID v4 multipart assembly; no network used.');
