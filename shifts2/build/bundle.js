var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function r(t){t.forEach(e)}function o(t){return"function"==typeof t}function s(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function l(e,n,r){e.$$.on_destroy.push(function(e,...n){if(null==e)return t;const r=e.subscribe(...n);return r.unsubscribe?()=>r.unsubscribe():r}(n,r))}function c(t){return null==t?"":t}function i(t,e,n){return t.set(n),e}function a(e){return e&&o(e.destroy)?e.destroy:t}function u(t,e){t.appendChild(e)}function f(t,e,n){t.insertBefore(e,n||null)}function d(t){t.parentNode&&t.parentNode.removeChild(t)}function $(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function p(t){return document.createElement(t)}function h(t){return document.createTextNode(t)}function g(){return h(" ")}function m(){return h("")}function y(t,e,n,r){return t.addEventListener(e,n,r),()=>t.removeEventListener(e,n,r)}function D(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function v(t,e){e=""+e,t.data!==e&&(t.data=e)}function P(t,e){t.value=null==e?"":e}function L(t,e,n,r){null==n?t.style.removeProperty(e):t.style.setProperty(e,n,r?"important":"")}let w;function b(t){w=t}const k=[],x=[];let C=[];const _=[],E=Promise.resolve();let S=!1;function R(t){C.push(t)}const W=new Set;let M=0;function A(){if(0!==M)return;const t=w;do{try{for(;M<k.length;){const t=k[M];M++,b(t),N(t.$$)}}catch(t){throw k.length=0,M=0,t}for(b(null),k.length=0,M=0;x.length;)x.pop()();for(let t=0;t<C.length;t+=1){const e=C[t];W.has(e)||(W.add(e),e())}C.length=0}while(k.length);for(;_.length;)_.pop()();S=!1,W.clear(),b(t)}function N(t){if(null!==t.fragment){t.update(),r(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(R)}}const I=new Set;let O;function T(){O={r:0,c:[],p:O}}function K(){O.r||r(O.c),O=O.p}function q(t,e){t&&t.i&&(I.delete(t),t.i(e))}function B(t,e,n,r){if(t&&t.o){if(I.has(t))return;I.add(t),O.c.push((()=>{I.delete(t),r&&(n&&t.d(1),r())})),t.o(e)}else r&&r()}function j(t){t&&t.c()}function z(t,n,s,l){const{fragment:c,after_update:i}=t.$$;c&&c.m(n,s),l||R((()=>{const n=t.$$.on_mount.map(e).filter(o);t.$$.on_destroy?t.$$.on_destroy.push(...n):r(n),t.$$.on_mount=[]})),i.forEach(R)}function F(t,e){const n=t.$$;null!==n.fragment&&(!function(t){const e=[],n=[];C.forEach((r=>-1===t.indexOf(r)?e.push(r):n.push(r))),n.forEach((t=>t())),C=e}(n.after_update),r(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function G(t,e){-1===t.$$.dirty[0]&&(k.push(t),S||(S=!0,E.then(A)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function J(e,o,s,l,c,i,a,u=[-1]){const f=w;b(e);const $=e.$$={fragment:null,ctx:[],props:i,update:t,not_equal:c,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(o.context||(f?f.$$.context:[])),callbacks:n(),dirty:u,skip_bound:!1,root:o.target||f.$$.root};a&&a($.root);let p=!1;if($.ctx=s?s(e,o.props||{},((t,n,...r)=>{const o=r.length?r[0]:n;return $.ctx&&c($.ctx[t],$.ctx[t]=o)&&(!$.skip_bound&&$.bound[t]&&$.bound[t](o),p&&G(e,t)),n})):[],$.update(),p=!0,r($.before_update),$.fragment=!!l&&l($.ctx),o.target){if(o.hydrate){const t=function(t){return Array.from(t.childNodes)}(o.target);$.fragment&&$.fragment.l(t),t.forEach(d)}else $.fragment&&$.fragment.c();o.intro&&q(e.$$.fragment),z(e,o.target,o.anchor,o.customElement),A()}b(f)}class X{$destroy(){F(this,1),this.$destroy=t}$on(e,n){if(!o(n))return t;const r=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return r.push(n),()=>{const t=r.indexOf(n);-1!==t&&r.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}const Y=300,U=60,Z="none";function H(t,e,n){return t.addEventListener(e,n),()=>t.removeEventListener(e,n)}function Q(t,e,n,r,o){t.dispatchEvent(new CustomEvent(`${e}${o}`,{detail:{event:n,pointersCount:r.length,target:n.target}}))}function V(t,e){const n={timeframe:Y,minSwipeDistance:U,touchAction:Z,composed:!1,...e},r="swipe";let o,s,l,c;function i(t,e){s=e.clientX,l=e.clientY,o=Date.now(),1===t.length&&(c=e.target)}function a(e,i){if("pointerup"===i.type&&0===e.length&&Date.now()-o<n.timeframe){const e=i.clientX-s,o=i.clientY-l,a=Math.abs(e),u=Math.abs(o);let f=null;a>=2*u&&a>n.minSwipeDistance?f=e>0?"right":"left":u>=2*a&&u>n.minSwipeDistance&&(f=o>0?"bottom":"top"),f&&t.dispatchEvent(new CustomEvent(r,{detail:{direction:f,target:c}}))}}return n.composed?{onMove:null,onDown:i,onUp:a}:function(t,e,n,r,o,s=Z){e.style.touchAction=s;let l=[];const c=H(e,"pointerdown",(function(s){l.push(s),Q(e,t,s,l,"down"),r?.(l,s);const c=s.pointerId;function i(n){c===n.pointerId&&(l=function(t,e){return e.filter((e=>t.pointerId!==e.pointerId))}(n,l),l.length||a(),Q(e,t,n,l,"up"),o?.(l,n))}function a(){u(),f(),d(),$()}const u=H(e,"pointermove",(r=>{l=l.map((t=>r.pointerId===t.pointerId?r:t)),Q(e,t,r,l,"move"),n?.(l,r)})),f=H(e,"lostpointercapture",(t=>{i(t)})),d=H(e,"pointerup",(t=>{i(t)})),$=H(e,"pointerleave",(n=>{l=[],a(),Q(e,t,n,l,"up"),o?.(l,n)}))}));return{destroy:()=>{c()}}}(r,t,null,i,a,n.touchAction)}function tt(e){let n,r,o,s,l;return{c(){n=p("td"),r=h(e[0]),o=p("br"),s=h(e[1]),D(n,"class",l=c(e[2]+" "+e[3])+" svelte-10o8nm8")},m(t,e){f(t,n,e),u(n,r),u(n,o),u(n,s)},p(t,[e]){1&e&&v(r,t[0]),2&e&&v(s,t[1]),12&e&&l!==(l=c(t[2]+" "+t[3])+" svelte-10o8nm8")&&D(n,"class",l)},i:t,o:t,d(t){t&&d(n)}}}function et(t,e,n){let{cell:r=""}=e,{cell2:o=""}=e,{tdClass:s=""}=e,{selectedDay:l=""}=e,c="";return t.$$set=t=>{"cell"in t&&n(0,r=t.cell),"cell2"in t&&n(1,o=t.cell2),"tdClass"in t&&n(2,s=t.tdClass),"selectedDay"in t&&n(4,l=t.selectedDay)},t.$$.update=()=>{16&t.$$.dirty&&n(3,c=l?"selected":"")},[r,o,s,c,l]}class nt extends X{constructor(t){super(),J(this,t,et,tt,s,{cell:0,cell2:1,tdClass:2,selectedDay:4})}}const rt=[];function ot(e,n=t){let r;const o=new Set;function l(t){if(s(e,t)&&(e=t,r)){const t=!rt.length;for(const t of o)t[1](),rt.push(t,e);if(t){for(let t=0;t<rt.length;t+=2)rt[t][0](rt[t+1]);rt.length=0}}}return{set:l,update:function(t){l(t(e))},subscribe:function(s,c=t){const i=[s,c];return o.add(i),1===o.size&&(r=n(l)||t),s(e),()=>{o.delete(i),0===o.size&&r&&(r(),r=null)}}}}const st=ot([]),lt=ot("");function ct(e){let n,r,s,l,i,a,$;return{c(){n=p("th"),r=h(e[0]),s=p("br"),l=h(e[1]),D(n,"class",i=c(e[2])+" svelte-q7fyvq")},m(t,c){f(t,n,c),u(n,r),u(n,s),u(n,l),a||($=y(n,"click",(function(){o(e[4](e[3]))&&e[4](e[3]).apply(this,arguments)})),a=!0)},p(t,[o]){e=t,1&o&&v(r,e[0]),2&o&&v(l,e[1]),4&o&&i!==(i=c(e[2])+" svelte-q7fyvq")&&D(n,"class",i)},i:t,o:t,d(t){t&&d(n),a=!1,$()}}}function it(t,e,n){let r;l(t,lt,(t=>n(5,r=t)));let{header:o=""}=e,{header2:s=""}=e,{thClass:c=""}=e,{event:a=""}=e;return t.$$set=t=>{"header"in t&&n(0,o=t.header),"header2"in t&&n(1,s=t.header2),"thClass"in t&&n(2,c=t.thClass),"event"in t&&n(3,a=t.event)},[o,s,c,a,function(t){""!==t&&i(lt,r=t,r)}]}class at extends X{constructor(t){super(),J(this,t,it,ct,s,{header:0,header2:1,thClass:2,event:3})}}function ut(t,e,n){const r=t.slice();return r[4]=e[n],r[6]=n,r}function ft(t,e,n){const r=t.slice();return r[7]=e[n],r}function dt(t,e,n){const r=t.slice();return r[10]=e[n],r}function $t(t){let e,n,r,o,s,l,c,i,a;const h=[ht,pt],m=[];o=function(t,e){return t[3]?0:1}(t),s=m[o]=h[o](t);let y=t[1],v=[];for(let e=0;e<y.length;e+=1)v[e]=yt(dt(t,y,e));const P=t=>B(v[t],1,1,(()=>{v[t]=null}));let L=t[0],w=[];for(let e=0;e<L.length;e+=1)w[e]=wt(ut(t,L,e));const b=t=>B(w[t],1,1,(()=>{w[t]=null}));let k=null;return L.length||(k=Dt()),{c(){e=p("table"),n=p("thead"),r=p("tr"),s.c(),l=g();for(let t=0;t<v.length;t+=1)v[t].c();c=g(),i=p("tbody");for(let t=0;t<w.length;t+=1)w[t].c();k&&k.c(),D(e,"class","svelte-1klxd7g")},m(t,s){f(t,e,s),u(e,n),u(n,r),m[o].m(r,null),u(r,l);for(let t=0;t<v.length;t+=1)v[t]&&v[t].m(r,null);u(e,c),u(e,i);for(let t=0;t<w.length;t+=1)w[t]&&w[t].m(i,null);k&&k.m(i,null),a=!0},p(t,e){if(10&e){let n;for(y=t[1],n=0;n<y.length;n+=1){const o=dt(t,y,n);v[n]?(v[n].p(o,e),q(v[n],1)):(v[n]=yt(o),v[n].c(),q(v[n],1),v[n].m(r,null))}for(T(),n=y.length;n<v.length;n+=1)P(n);K()}if(13&e){let n;for(L=t[0],n=0;n<L.length;n+=1){const r=ut(t,L,n);w[n]?(w[n].p(r,e),q(w[n],1)):(w[n]=wt(r),w[n].c(),q(w[n],1),w[n].m(i,null))}for(T(),n=L.length;n<w.length;n+=1)b(n);K(),L.length?k&&(k.d(1),k=null):k||(k=Dt(),k.c(),k.m(i,null))}},i(t){if(!a){q(s);for(let t=0;t<y.length;t+=1)q(v[t]);for(let t=0;t<L.length;t+=1)q(w[t]);a=!0}},o(t){B(s),v=v.filter(Boolean);for(let t=0;t<v.length;t+=1)B(v[t]);w=w.filter(Boolean);for(let t=0;t<w.length;t+=1)B(w[t]);a=!1},d(t){t&&d(e),m[o].d(),$(v,t),$(w,t),k&&k.d()}}}function pt(t){let e,n;return e=new at({props:{header:"Shift",thClass:"shift"}}),{c(){j(e.$$.fragment)},m(t,r){z(e,t,r),n=!0},i(t){n||(q(e.$$.fragment,t),n=!0)},o(t){B(e.$$.fragment,t),n=!1},d(t){F(e,t)}}}function ht(t){let e,n,r,o;return e=new at({props:{header:"Shift"}}),r=new at({props:{header:"Name"}}),{c(){j(e.$$.fragment),n=g(),j(r.$$.fragment)},m(t,s){z(e,t,s),f(t,n,s),z(r,t,s),o=!0},i(t){o||(q(e.$$.fragment,t),q(r.$$.fragment,t),o=!0)},o(t){B(e.$$.fragment,t),B(r.$$.fragment,t),o=!1},d(t){F(e,t),t&&d(n),F(r,t)}}}function gt(t){let e,n;return e=new at({props:{header:t[10][0]+" "+t[10][1],event:t[10][0]}}),{c(){j(e.$$.fragment)},m(t,r){z(e,t,r),n=!0},p(t,n){const r={};2&n&&(r.header=t[10][0]+" "+t[10][1]),2&n&&(r.event=t[10][0]),e.$set(r)},i(t){n||(q(e.$$.fragment,t),n=!0)},o(t){B(e.$$.fragment,t),n=!1},d(t){F(e,t)}}}function mt(t){let e,n;return e=new at({props:{header:t[10][0],header2:t[10][1],event:t[10][0]}}),{c(){j(e.$$.fragment)},m(t,r){z(e,t,r),n=!0},p(t,n){const r={};2&n&&(r.header=t[10][0]),2&n&&(r.header2=t[10][1]),2&n&&(r.event=t[10][0]),e.$set(r)},i(t){n||(q(e.$$.fragment,t),n=!0)},o(t){B(e.$$.fragment,t),n=!1},d(t){F(e,t)}}}function yt(t){let e,n,r,o;const s=[mt,gt],l=[];return e=function(t,e){return t[3]?0:1}(t),n=l[e]=s[e](t),{c(){n.c(),r=m()},m(t,n){l[e].m(t,n),f(t,r,n),o=!0},p(t,e){n.p(t,e)},i(t){o||(q(n),o=!0)},o(t){B(n),o=!1},d(t){l[e].d(t),t&&d(r)}}}function Dt(t){let e;return{c(){e=h("Empty list")},m(t,n){f(t,e,n)},d(t){t&&d(e)}}}function vt(t){let e,n;return e=new nt({props:{cell:t[7].shift,cell2:t[2][t[6]],tdClass:t[7].class}}),{c(){j(e.$$.fragment)},m(t,r){z(e,t,r),n=!0},p(t,n){const r={};1&n&&(r.cell=t[7].shift),4&n&&(r.cell2=t[2][t[6]]),1&n&&(r.tdClass=t[7].class),e.$set(r)},i(t){n||(q(e.$$.fragment,t),n=!0)},o(t){B(e.$$.fragment,t),n=!1},d(t){F(e,t)}}}function Pt(t){let e,n;return e=new nt({props:{cell:t[7].shift,tdClass:t[7].class,selectedDay:t[7].selected}}),{c(){j(e.$$.fragment)},m(t,r){z(e,t,r),n=!0},p(t,n){const r={};1&n&&(r.cell=t[7].shift),1&n&&(r.tdClass=t[7].class),1&n&&(r.selectedDay=t[7].selected),e.$set(r)},i(t){n||(q(e.$$.fragment,t),n=!0)},o(t){B(e.$$.fragment,t),n=!1},d(t){F(e,t)}}}function Lt(t){let e,n,r,o;const s=[Pt,vt],l=[];return e=function(t,e){return t[3]?0:1}(t),n=l[e]=s[e](t),{c(){n.c(),r=m()},m(t,n){l[e].m(t,n),f(t,r,n),o=!0},p(t,e){n.p(t,e)},i(t){o||(q(n),o=!0)},o(t){B(n),o=!1},d(t){l[e].d(t),t&&d(r)}}}function wt(t){let e,n,r,o,s,l;n=new nt({props:{cell:t[6]+1,tdClass:"shift"}});let c=t[3]&&function(t){let e,n;return e=new nt({props:{cell:t[2][t[6]],tdClass:"worker"}}),{c(){j(e.$$.fragment)},m(t,r){z(e,t,r),n=!0},p(t,n){const r={};4&n&&(r.cell=t[2][t[6]]),e.$set(r)},i(t){n||(q(e.$$.fragment,t),n=!0)},o(t){B(e.$$.fragment,t),n=!1},d(t){F(e,t)}}}(t),i=t[4],a=[];for(let e=0;e<i.length;e+=1)a[e]=Lt(ft(t,i,e));const h=t=>B(a[t],1,1,(()=>{a[t]=null}));return{c(){e=p("tr"),j(n.$$.fragment),r=g(),c&&c.c(),o=g();for(let t=0;t<a.length;t+=1)a[t].c();s=g()},m(t,i){f(t,e,i),z(n,e,null),u(e,r),c&&c.m(e,null),u(e,o);for(let t=0;t<a.length;t+=1)a[t]&&a[t].m(e,null);u(e,s),l=!0},p(t,n){if(t[3]&&c.p(t,n),13&n){let r;for(i=t[4],r=0;r<i.length;r+=1){const o=ft(t,i,r);a[r]?(a[r].p(o,n),q(a[r],1)):(a[r]=Lt(o),a[r].c(),q(a[r],1),a[r].m(e,s))}for(T(),r=i.length;r<a.length;r+=1)h(r);K()}},i(t){if(!l){q(n.$$.fragment,t),q(c);for(let t=0;t<i.length;t+=1)q(a[t]);l=!0}},o(t){B(n.$$.fragment,t),B(c),a=a.filter(Boolean);for(let t=0;t<a.length;t+=1)B(a[t]);l=!1},d(t){t&&d(e),F(n),c&&c.d(),$(a,t)}}}function bt(t){let e,n,r=t[2].length>0&&$t(t);return{c(){r&&r.c(),e=m()},m(t,o){r&&r.m(t,o),f(t,e,o),n=!0},p(t,[n]){t[2].length>0?r?(r.p(t,n),4&n&&q(r,1)):(r=$t(t),r.c(),q(r,1),r.m(e.parentNode,e)):r&&(T(),B(r,1,1,(()=>{r=null})),K())},i(t){n||(q(r),n=!0)},o(t){B(r),n=!1},d(t){r&&r.d(t),t&&d(e)}}}function kt(t,e,n){let{body:r}=e,{dates:o}=e,{workers:s}=e,l=o.length>1;return t.$$set=t=>{"body"in t&&n(0,r=t.body),"dates"in t&&n(1,o=t.dates),"workers"in t&&n(2,s=t.workers)},[r,o,s,l]}class xt extends X{constructor(t){super(),J(this,t,kt,bt,s,{body:0,dates:1,workers:2})}}function Ct(t,e){let n=new Date(t);return n.setDate(n.getDate()+e),function(t){return t.toISOString().slice(0,10)}(n)}const _t=function(){const{subscribe:t,set:e,update:n}=ot("");return{subscribe:t,set:e,update:n,nextDay:()=>n((t=>Ct(t,1))),prevDay:()=>n((t=>Ct(t,-1))),nextWeek:()=>n((t=>Ct(t,7))),prevWeek:()=>n((t=>Ct(t,-7))),reset:()=>e(0)}}();function Et(e){let n,o,s,l,c,i,a,u,$;return{c(){n=p("button"),n.textContent=`${Mt}`,o=g(),s=p("button"),s.textContent=`${Rt}`,l=g(),c=p("button"),c.textContent=`${St}`,i=g(),a=p("button"),a.textContent=`${Wt}`,D(n,"class","left svelte-ff5gnk"),D(s,"class","svelte-ff5gnk"),D(c,"class","svelte-ff5gnk"),D(a,"class","right svelte-ff5gnk")},m(t,r){f(t,n,r),f(t,o,r),f(t,s,r),f(t,l,r),f(t,c,r),f(t,i,r),f(t,a,r),u||($=[y(n,"click",e[0]),y(s,"click",e[1]),y(c,"click",e[2]),y(a,"click",e[3])],u=!0)},p:t,i:t,o:t,d(t){t&&d(n),t&&d(o),t&&d(s),t&&d(l),t&&d(c),t&&d(i),t&&d(a),u=!1,r($)}}}const St=">>",Rt="<<",Wt=">>>>>  ",Mt="  <<<<<";function At(t){return[()=>_t.prevWeek(),()=>_t.prevDay(),()=>_t.nextDay(),()=>_t.nextWeek()]}class Nt extends X{constructor(t){super(),J(this,t,At,Et,s,{})}}function It(t,e,n){const r=t.slice();return r[6]=e[n],r}function Ot(t){let e,n,o,s=t[1],l=[];for(let e=0;e<s.length;e+=1)l[e]=Tt(It(t,s,e));return{c(){e=p("div");for(let t=0;t<l.length;t+=1)l[t].c();D(e,"id","log"),D(e,"class","svelte-rxonch")},m(r,s){f(r,e,s);for(let t=0;t<l.length;t+=1)l[t]&&l[t].m(e,null);n||(o=[y(e,"click",t[3]),y(e,"keypress",t[4])],n=!0)},p(t,n){if(2&n){let r;for(s=t[1],r=0;r<s.length;r+=1){const o=It(t,s,r);l[r]?l[r].p(o,n):(l[r]=Tt(o),l[r].c(),l[r].m(e,null))}for(;r<l.length;r+=1)l[r].d(1);l.length=s.length}},d(t){t&&d(e),$(l,t),n=!1,r(o)}}}function Tt(t){let e,n,r=t[6]+"";return{c(){e=p("div"),n=h(r)},m(t,r){f(t,e,r),u(e,n)},p(t,e){2&e&&r!==(r=t[6]+"")&&v(n,r)},d(t){t&&d(e)}}}function Kt(e){let n,r=e[0]&&Ot(e);return{c(){r&&r.c(),n=m()},m(t,e){r&&r.m(t,e),f(t,n,e)},p(t,[e]){t[0]?r?r.p(t,e):(r=Ot(t),r.c(),r.m(n.parentNode,n)):r&&(r.d(1),r=null)},i:t,o:t,d(t){r&&r.d(t),t&&d(n)}}}function qt(t,e,n){let r;l(t,st,(t=>n(1,r=t))),console.log(r);let{logMessage:o}=e,s=!1;return t.$$set=t=>{"logMessage"in t&&n(2,o=t.logMessage)},t.$$.update=()=>{var e;4&t.$$.dirty&&(e=o,i(st,r=[...r,e],r),n(0,s=!0))},[s,r,o,()=>n(0,s=!1),()=>n(0,s=!1)]}class Bt extends X{constructor(t){super(),J(this,t,qt,Kt,s,{logMessage:2})}}function jt(t){let e,n,o,s,l,c,i,$,h,m,v,w,b,k,C,E,S,R,W,M,A,N,I,O,T,K;function G(e){t[17](e)}b=new Nt({}),S=new xt({props:{body:t[6],dates:t[5],workers:t[7]}}),M=new xt({props:{body:t[1],dates:t[8],workers:t[7]}});let J={};return void 0!==t[4]&&(J.logMessage=t[4]),N=new Bt({props:J}),x.push((()=>function(t,e,n){const r=t.$$.props[e];void 0!==r&&(t.$$.bound[r]=n,n(t.$$.ctx[r]))}(N,"logMessage",G))),{c(){e=p("main"),n=p("div"),o=p("div"),s=p("label"),s.textContent="Day",l=g(),c=p("input"),i=g(),$=p("button"),$.textContent="Switch Pattern",h=g(),m=p("button"),m.textContent="Switch Day Name",v=g(),w=p("div"),j(b.$$.fragment),k=g(),C=p("div"),E=p("div"),j(S.$$.fragment),R=g(),W=p("div"),j(M.$$.fragment),A=g(),j(N.$$.fragment),D(s,"for","targetDay"),D(c,"type","date"),D(c,"id","targetDay"),D(c,"name","targetDay"),D(o,"id","datePanel"),D(o,"class","svelte-284xyn"),D(w,"id","nextPrev"),D(w,"class","svelte-284xyn"),D(n,"id","tools"),D(n,"class","tools svelte-284xyn"),D(e,"class","svelte-284xyn"),D(E,"id","dayPanel"),L(E,"flex","1"),D(E,"class","center svelte-284xyn"),D(W,"id","weekPanel"),L(W,"flex","4"),D(W,"class","center svelte-284xyn"),D(C,"class","svelte-284xyn")},m(r,d){f(r,e,d),u(e,n),u(n,o),u(o,s),u(o,l),u(o,c),P(c,t[3]),u(o,i),u(o,$),u(o,h),u(o,m),u(n,v),u(n,w),z(b,w,null),f(r,k,d),f(r,C,d),u(C,E),z(S,E,null),u(C,R),u(C,W),z(M,W,null),f(r,A,d),z(N,r,d),O=!0,T||(K=[y(c,"input",t[14]),y($,"click",t[15]),y(m,"click",t[16]),a(V.call(null,E,{timeframe:300,minSwipeDistance:30,touchAction:"pan-x"})),y(E,"swipe",t[9]),a(V.call(null,W,{timeframe:300,minSwipeDistance:100,touchAction:"pan-x"})),y(W,"swipe",t[10])],T=!0)},p(t,[e]){8&e&&P(c,t[3]);const n={};64&e&&(n.body=t[6]),32&e&&(n.dates=t[5]),128&e&&(n.workers=t[7]),S.$set(n);const r={};2&e&&(r.body=t[1]),256&e&&(r.dates=t[8]),128&e&&(r.workers=t[7]),M.$set(r);const o={};var s;!I&&16&e&&(I=!0,o.logMessage=t[4],s=()=>I=!1,_.push(s)),N.$set(o)},i(t){O||(q(b.$$.fragment,t),q(S.$$.fragment,t),q(M.$$.fragment,t),q(N.$$.fragment,t),O=!0)},o(t){B(b.$$.fragment,t),B(S.$$.fragment,t),B(M.$$.fragment,t),B(N.$$.fragment,t),O=!1},d(t){t&&d(e),F(b),t&&d(k),t&&d(C),F(S),F(M),t&&d(A),F(N,t),T=!1,r(K)}}}const zt="2023-07-16";function Ft(t){return t.toISOString().slice(0,10)}function Gt(t,e,n){let r,o,s,c,a;l(t,_t,(t=>n(3,a=t))),l(t,st,(t=>n(18,t)));let{workers:u}=e,{shiftKey:f}=e,{shiftsWeek:d}=e,$="";const p=[["Sun","Sunday"],["Mon","Monday"],["Tue","Tuesday"],["Wed","Wednesday"],["Thu","Thursday"],["Fri","Friday"],["Sat","Saturday"]];var h=1;function g(t=0){return d[t].map((t=>t.map((t=>m(t)))))}function m(t,e=!1){return{class:t,shift:f[h][t],selected:e}}let y=g(h),D={workers:u,Pattern:t=>u.slice(t,u.length).concat(u.slice(0,t)),CalculateWeek(t){let e=this.workers.length-function(t,e){const n=new Date(zt);let r=(new Date(t).getTime()-n.getTime())/864e5;return Math.floor(r/7)%e}(t,this.workers.length);return this.Pattern(e)}},v=!0;const P=new Date;i(_t,a=Ft(P),a);return t.$$set=t=>{"workers"in t&&n(11,u=t.workers),"shiftKey"in t&&n(12,f=t.shiftKey),"shiftsWeek"in t&&n(13,d=t.shiftsWeek)},t.$$.update=()=>{1&t.$$.dirty&&n(1,y=g(h)),12&t.$$.dirty&&n(8,r=function(t,e){let n=[];const r=new Date(t).getDay(),o=e?1:0;let s=new Date(t.concat("T10:00:00Z"));s.setDate(s.getDate()-r);let l=new Date(Ft(s));for(let t=0;t<7;t++)l.getDay()==t?n[t]=[Ft(l),p[l.getDay()][o]]:n[t]=["ERROR","something went wrong"],l.setDate(l.getDate()+1);return n}(a,v)),8&t.$$.dirty&&n(7,o=D.CalculateWeek(a)),10&t.$$.dirty&&(!function(t){y.forEach((t=>t.forEach((t=>t.selected=!1))));const e=new Date(t).getDay();y.forEach((t=>t[e].selected=!0))}(a),n(1,y),n(0,h),n(3,a)),10&t.$$.dirty&&n(6,s=function(t,e){const n=new Date(t).getDay();return e.map((t=>[t[n]]))}(a,y)),12&t.$$.dirty&&n(5,c=function(t,e){const n=new Date(t),r=e?1:0;return[[t,p[n.getDay()][r]]]}(a,v))},[h,y,v,a,$,c,s,o,r,function(t){direction=t.detail.direction,alert("day"),"left"==direction?_t.nextDay():"right"==direction&&_t.prevDay()},function(t){direction=t.detail.direction,alert("week"),"left"==direction?_t.nextWeek():"right"==direction&&_t.prevWeek()},u,f,d,function(){a=this.value,_t.set(a)},()=>{n(0,h=0==h?1:0)},()=>{n(2,v=!v)},function(t){$=t,n(4,$)}]}return new class extends X{constructor(t){super(),J(this,t,Gt,jt,s,{workers:11,shiftKey:12,shiftsWeek:13})}}({target:document.body,props:{workers:["B.C.","G.O`D","J.N","W.C","P.G","A.C","K.D","M.C","J.W"],shiftKey:[{R:"Rest Day",L1:"18.00-4.00",L2:"18.00-2.00",L3:"17.00-2.00",L4:"19.00-4.00",L5:"16.00-2.00",L6:"17.00-3.00",D1:"9.00-18.00",D2:"7.00-16.00",D3:"8.00-17.00",P1:"Priority 1",P2:"Priority 2",P3:"Priority 3",P4:"Priority 4",P5:"Rest Day: <br>P2 drop days"},{R:"Rest Day",L1:"18.00-4.00",L2:"18.00-2.00",L3:"16.00-2.00",L4:"19.00-4.00",L5:"16.00-4.00",L6:"17.00-3.00",L7:"20.00-4.00",D1:"8.00-16.00",D2:"6.00-16.00",D3:"8.00-14.00",D4:"6.00-13.00",D5:"6.00-15.00",D6:"6.00-14.00",P1:"Priority 1",P2:"Priority 2",P3:"Priority 3",P4:"Priority 4",P5:"Priority 5"}],shiftsWeek:[[["R","D1","L1","L1","L2","P3","P1"],["P1","R","D1","D1","L1","L2","P4"],["P2","P1","L1","L4","R","D1","L1"],["L1","L1","P3","P2","P1","L1","L1"],["L3","L2","P1","R","D1","D2","D1"],["D3","P2","L4","L1","L4","P2","P2"],["R","D2","D2","D2","D2","P1","P3"],["P3","L1","L2","L2","R","L1","L4"],["L1","L4","P2","P1","L1","L4","R"]],[["R","D1","L3","L1","L3","P1","P4"],["P1","P2","D1","D2","L1","L1","P5"],["P2","P1","L6","L6","R","D4","L5"],["L1","L1","P2","P2","P1","L6","L1"],["L1","L6","P1","R","D5","P2","L1"],["L5","R","D4","D3","D1","L7","P2"],["P3","D6","L1","L3","L1","P3","P1"],["P4","L7","L7","L7","P2","D1","D1"],["D1","L3","P3","P1","L6","L3","P3"]]]}})}();
//# sourceMappingURL=bundle.js.map
