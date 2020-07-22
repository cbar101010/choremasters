/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 */

//importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.2/workbox-sw.js");

//importScripts(
//    "/precache-manifest.417c97a556b70e2e45dde61bae6c13f2.js"
//);

workbox.core.setCacheNameDetails({prefix: "chorderly"});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

self.addEventListener('message', function (event) {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});