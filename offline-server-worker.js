/* Generated from server.js by scripts/build-offline-worker.ps1. Do not edit directly. */
(() => {
const module = undefined;
const exports = undefined;
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;"undefined"!=typeof window?e=window:"undefined"!=typeof global?e=global:"undefined"!=typeof self&&(e=self),e.PF=t()}}(function(){return function t(e,r,i){function n(s,a){if(!r[s]){if(!e[s]){var u="function"==typeof require&&require;if(!a&&u)return u(s,!0);if(o)return o(s,!0);var h=new Error("Cannot find module '"+s+"'");throw h.code="MODULE_NOT_FOUND",h}var l=r[s]={exports:{}};e[s][0].call(l.exports,function(t){var r=e[s][1][t];return n(r?r:t)},l,l.exports,t,e,r,i)}return r[s].exports}for(var o="function"==typeof require&&require,s=0;s<i.length;s++)n(i[s]);return n}({1:[function(t,e){e.exports=t("./lib/heap")},{"./lib/heap":2}],2:[function(t,e){!function(){var t,r,i,n,o,s,a,u,h,l,p,c,f,d,g;i=Math.floor,l=Math.min,r=function(t,e){return e>t?-1:t>e?1:0},h=function(t,e,n,o,s){var a;if(null==n&&(n=0),null==s&&(s=r),0>n)throw new Error("lo must be non-negative");for(null==o&&(o=t.length);o>n;)a=i((n+o)/2),s(e,t[a])<0?o=a:n=a+1;return[].splice.apply(t,[n,n-n].concat(e)),e},s=function(t,e,i){return null==i&&(i=r),t.push(e),d(t,0,t.length-1,i)},o=function(t,e){var i,n;return null==e&&(e=r),i=t.pop(),t.length?(n=t[0],t[0]=i,g(t,0,e)):n=i,n},u=function(t,e,i){var n;return null==i&&(i=r),n=t[0],t[0]=e,g(t,0,i),n},a=function(t,e,i){var n;return null==i&&(i=r),t.length&&i(t[0],e)<0&&(n=[t[0],e],e=n[0],t[0]=n[1],g(t,0,i)),e},n=function(t,e){var n,o,s,a,u,h;for(null==e&&(e=r),a=function(){h=[];for(var e=0,r=i(t.length/2);r>=0?r>e:e>r;r>=0?e++:e--)h.push(e);return h}.apply(this).reverse(),u=[],o=0,s=a.length;s>o;o++)n=a[o],u.push(g(t,n,e));return u},f=function(t,e,i){var n;return null==i&&(i=r),n=t.indexOf(e),-1!==n?(d(t,0,n,i),g(t,n,i)):void 0},p=function(t,e,i){var o,s,u,h,l;if(null==i&&(i=r),s=t.slice(0,e),!s.length)return s;for(n(s,i),l=t.slice(e),u=0,h=l.length;h>u;u++)o=l[u],a(s,o,i);return s.sort(i).reverse()},c=function(t,e,i){var s,a,u,p,c,f,d,g,b,y;if(null==i&&(i=r),10*e<=t.length){if(p=t.slice(0,e).sort(i),!p.length)return p;for(u=p[p.length-1],g=t.slice(e),c=0,d=g.length;d>c;c++)s=g[c],i(s,u)<0&&(h(p,s,0,null,i),p.pop(),u=p[p.length-1]);return p}for(n(t,i),y=[],a=f=0,b=l(e,t.length);b>=0?b>f:f>b;a=b>=0?++f:--f)y.push(o(t,i));return y},d=function(t,e,i,n){var o,s,a;for(null==n&&(n=r),o=t[i];i>e&&(a=i-1>>1,s=t[a],n(o,s)<0);)t[i]=s,i=a;return t[i]=o},g=function(t,e,i){var n,o,s,a,u;for(null==i&&(i=r),o=t.length,u=e,s=t[e],n=2*e+1;o>n;)a=n+1,o>a&&!(i(t[n],t[a])<0)&&(n=a),t[e]=t[n],e=n,n=2*e+1;return t[e]=s,d(t,u,e,i)},t=function(){function t(t){this.cmp=null!=t?t:r,this.nodes=[]}return t.push=s,t.pop=o,t.replace=u,t.pushpop=a,t.heapify=n,t.nlargest=p,t.nsmallest=c,t.prototype.push=function(t){return s(this.nodes,t,this.cmp)},t.prototype.pop=function(){return o(this.nodes,this.cmp)},t.prototype.peek=function(){return this.nodes[0]},t.prototype.contains=function(t){return-1!==this.nodes.indexOf(t)},t.prototype.replace=function(t){return u(this.nodes,t,this.cmp)},t.prototype.pushpop=function(t){return a(this.nodes,t,this.cmp)},t.prototype.heapify=function(){return n(this.nodes,this.cmp)},t.prototype.updateItem=function(t){return f(this.nodes,t,this.cmp)},t.prototype.clear=function(){return this.nodes=[]},t.prototype.empty=function(){return 0===this.nodes.length},t.prototype.size=function(){return this.nodes.length},t.prototype.clone=function(){var e;return e=new t,e.nodes=this.nodes.slice(0),e},t.prototype.toArray=function(){return this.nodes.slice(0)},t.prototype.insert=t.prototype.push,t.prototype.remove=t.prototype.pop,t.prototype.top=t.prototype.peek,t.prototype.front=t.prototype.peek,t.prototype.has=t.prototype.contains,t.prototype.copy=t.prototype.clone,t}(),("undefined"!=typeof e&&null!==e?e.exports:void 0)?e.exports=t:window.Heap=t}.call(this)},{}],3:[function(t,e){function r(t,e,r){this.width=t,this.height=e,this.nodes=this._buildNodes(t,e,r)}var i=t("./Node");r.prototype._buildNodes=function(t,e,r){var n,o,s=new Array(e);for(n=0;e>n;++n)for(s[n]=new Array(t),o=0;t>o;++o)s[n][o]=new i(o,n);if(void 0===r)return s;if(r.length!==e||r[0].length!==t)throw new Error("Matrix size does not fit");for(n=0;e>n;++n)for(o=0;t>o;++o)r[n][o]&&(s[n][o].walkable=!1);return s},r.prototype.getNodeAt=function(t,e){return this.nodes[e][t]},r.prototype.isWalkableAt=function(t,e){return this.isInside(t,e)&&this.nodes[e][t].walkable},r.prototype.isInside=function(t,e){return t>=0&&t<this.width&&e>=0&&e<this.height},r.prototype.setWalkableAt=function(t,e,r){this.nodes[e][t].walkable=r},r.prototype.getNeighbors=function(t,e,r){var i=t.x,n=t.y,o=[],s=!1,a=!1,u=!1,h=!1,l=!1,p=!1,c=!1,f=!1,d=this.nodes;return this.isWalkableAt(i,n-1)&&(o.push(d[n-1][i]),s=!0),this.isWalkableAt(i+1,n)&&(o.push(d[n][i+1]),u=!0),this.isWalkableAt(i,n+1)&&(o.push(d[n+1][i]),l=!0),this.isWalkableAt(i-1,n)&&(o.push(d[n][i-1]),c=!0),e?(r?(a=c&&s,h=s&&u,p=u&&l,f=l&&c):(a=c||s,h=s||u,p=u||l,f=l||c),a&&this.isWalkableAt(i-1,n-1)&&o.push(d[n-1][i-1]),h&&this.isWalkableAt(i+1,n-1)&&o.push(d[n-1][i+1]),p&&this.isWalkableAt(i+1,n+1)&&o.push(d[n+1][i+1]),f&&this.isWalkableAt(i-1,n+1)&&o.push(d[n+1][i-1]),o):o},r.prototype.clone=function(){var t,e,n=this.width,o=this.height,s=this.nodes,a=new r(n,o),u=new Array(o);for(t=0;o>t;++t)for(u[t]=new Array(n),e=0;n>e;++e)u[t][e]=new i(e,t,s[t][e].walkable);return a.nodes=u,a},e.exports=r},{"./Node":5}],4:[function(t,e){e.exports={manhattan:function(t,e){return t+e},euclidean:function(t,e){return Math.sqrt(t*t+e*e)},octile:function(t,e){var r=Math.SQRT2-1;return e>t?r*t+e:r*e+t},chebyshev:function(t,e){return Math.max(t,e)}}},{}],5:[function(t,e){function r(t,e,r){this.x=t,this.y=e,this.walkable=void 0===r?!0:r}e.exports=r},{}],6:[function(t,e,r){function i(t){for(var e=[[t.x,t.y]];t.parent;)t=t.parent,e.push([t.x,t.y]);return e.reverse()}function n(t,e){var r=i(t),n=i(e);return r.concat(n.reverse())}function o(t){var e,r,i,n,o,s=0;for(e=1;e<t.length;++e)r=t[e-1],i=t[e],n=r[0]-i[0],o=r[1]-i[1],s+=Math.sqrt(n*n+o*o);return s}function s(t,e,r,i){var n,o,s,a,u,h,l=Math.abs,p=[];for(s=l(r-t),a=l(i-e),n=r>t?1:-1,o=i>e?1:-1,u=s-a;;){if(p.push([t,e]),t===r&&e===i)break;h=2*u,h>-a&&(u-=a,t+=n),s>h&&(u+=s,e+=o)}return p}function a(t){var e,r,i,n,o,a,u=[],h=t.length;if(2>h)return u;for(o=0;h-1>o;++o)for(e=t[o],r=t[o+1],i=s(e[0],e[1],r[0],r[1]),n=i.length,a=0;n-1>a;++a)u.push(i[a]);return u.push(t[h-1]),u}function u(t,e){var r,i,n,o,a,u,h,l,p,c,f,d=e.length,g=e[0][0],b=e[0][1],y=e[d-1][0],A=e[d-1][1];for(r=g,i=b,a=[[r,i]],u=2;d>u;++u){for(l=e[u],n=l[0],o=l[1],p=s(r,i,n,o),f=!1,h=1;h<p.length;++h)if(c=p[h],!t.isWalkableAt(c[0],c[1])){f=!0;break}f&&(lastValidCoord=e[u-1],a.push(lastValidCoord),r=lastValidCoord[0],i=lastValidCoord[1])}return a.push([y,A]),a}function h(t){if(t.length<3)return t;var e,r,i,n,o,s,a=[],u=t[0][0],h=t[0][1],l=t[1][0],p=t[1][1],c=l-u,f=p-h;for(o=Math.sqrt(c*c+f*f),c/=o,f/=o,a.push([u,h]),s=2;s<t.length;s++)e=l,r=p,i=c,n=f,l=t[s][0],p=t[s][1],c=l-e,f=p-r,o=Math.sqrt(c*c+f*f),c/=o,f/=o,(c!==i||f!==n)&&a.push([e,r]);return a.push([l,p]),a}r.backtrace=i,r.biBacktrace=n,r.pathLength=o,r.interpolate=s,r.expandPath=a,r.smoothenPath=u,r.compressPath=h},{}],7:[function(t,e){function r(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.heuristic=t.heuristic||o.manhattan,this.weight=t.weight||1}var i=t("heap"),n=t("../core/Util"),o=t("../core/Heuristic");r.prototype.findPath=function(t,e,r,o,s){var a,u,h,l,p,c,f,d,g=new i(function(t,e){return t.f-e.f}),b=s.getNodeAt(t,e),y=s.getNodeAt(r,o),A=this.heuristic,k=this.allowDiagonal,m=this.dontCrossCorners,v=this.weight,w=Math.abs,x=Math.SQRT2;for(b.g=0,b.f=0,g.push(b),b.opened=!0;!g.empty();){if(a=g.pop(),a.closed=!0,a===y)return n.backtrace(y);for(u=s.getNeighbors(a,k,m),l=0,p=u.length;p>l;++l)h=u[l],h.closed||(c=h.x,f=h.y,d=a.g+(0===c-a.x||0===f-a.y?1:x),(!h.opened||d<h.g)&&(h.g=d,h.h=h.h||v*A(w(c-r),w(f-o)),h.f=h.g+h.h,h.parent=a,h.opened?g.updateItem(h):(g.push(h),h.opened=!0)))}return[]},e.exports=r},{"../core/Heuristic":4,"../core/Util":6,heap:1}],8:[function(t,e){function r(t){i.call(this,t);var e=this.heuristic;this.heuristic=function(t,r){return 1e6*e(t,r)}}var i=t("./AStarFinder");r.prototype=new i,r.prototype.constructor=r,e.exports=r},{"./AStarFinder":7}],9:[function(t,e){function r(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.heuristic=t.heuristic||o.manhattan,this.weight=t.weight||1}var i=t("heap"),n=t("../core/Util"),o=t("../core/Heuristic");r.prototype.findPath=function(t,e,r,o,s){var a,u,h,l,p,c,f,d,g=function(t,e){return t.f-e.f},b=new i(g),y=new i(g),A=s.getNodeAt(t,e),k=s.getNodeAt(r,o),m=this.heuristic,v=this.allowDiagonal,w=this.dontCrossCorners,x=this.weight,F=Math.abs,W=Math.SQRT2,N=1,C=2;for(A.g=0,A.f=0,b.push(A),A.opened=N,k.g=0,k.f=0,y.push(k),k.opened=C;!b.empty()&&!y.empty();){for(a=b.pop(),a.closed=!0,u=s.getNeighbors(a,v,w),l=0,p=u.length;p>l;++l)if(h=u[l],!h.closed){if(h.opened===C)return n.biBacktrace(a,h);c=h.x,f=h.y,d=a.g+(0===c-a.x||0===f-a.y?1:W),(!h.opened||d<h.g)&&(h.g=d,h.h=h.h||x*m(F(c-r),F(f-o)),h.f=h.g+h.h,h.parent=a,h.opened?b.updateItem(h):(b.push(h),h.opened=N))}for(a=y.pop(),a.closed=!0,u=s.getNeighbors(a,v,w),l=0,p=u.length;p>l;++l)if(h=u[l],!h.closed){if(h.opened===N)return n.biBacktrace(h,a);c=h.x,f=h.y,d=a.g+(0===c-a.x||0===f-a.y?1:W),(!h.opened||d<h.g)&&(h.g=d,h.h=h.h||x*m(F(c-t),F(f-e)),h.f=h.g+h.h,h.parent=a,h.opened?y.updateItem(h):(y.push(h),h.opened=C))}}return[]},e.exports=r},{"../core/Heuristic":4,"../core/Util":6,heap:1}],10:[function(t,e){function r(t){i.call(this,t);var e=this.heuristic;this.heuristic=function(t,r){return 1e6*e(t,r)}}var i=t("./BiAStarFinder");r.prototype=new i,r.prototype.constructor=r,e.exports=r},{"./BiAStarFinder":9}],11:[function(t,e){function r(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners}var i=t("../core/Util");r.prototype.findPath=function(t,e,r,n,o){var s,a,u,h,l,p=o.getNodeAt(t,e),c=o.getNodeAt(r,n),f=[],d=[],g=this.allowDiagonal,b=this.dontCrossCorners,y=0,A=1;for(f.push(p),p.opened=!0,p.by=y,d.push(c),c.opened=!0,c.by=A;f.length&&d.length;){for(u=f.shift(),u.closed=!0,s=o.getNeighbors(u,g,b),h=0,l=s.length;l>h;++h)if(a=s[h],!a.closed)if(a.opened){if(a.by===A)return i.biBacktrace(u,a)}else f.push(a),a.parent=u,a.opened=!0,a.by=y;for(u=d.shift(),u.closed=!0,s=o.getNeighbors(u,g,b),h=0,l=s.length;l>h;++h)if(a=s[h],!a.closed)if(a.opened){if(a.by===y)return i.biBacktrace(a,u)}else d.push(a),a.parent=u,a.opened=!0,a.by=A}return[]},e.exports=r},{"../core/Util":6}],12:[function(t,e){function r(t){i.call(this,t),this.heuristic=function(){return 0}}var i=t("./BiAStarFinder");r.prototype=new i,r.prototype.constructor=r,e.exports=r},{"./BiAStarFinder":9}],13:[function(t,e){function r(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners}var i=t("../core/Util");r.prototype.findPath=function(t,e,r,n,o){var s,a,u,h,l,p=[],c=this.allowDiagonal,f=this.dontCrossCorners,d=o.getNodeAt(t,e),g=o.getNodeAt(r,n);for(p.push(d),d.opened=!0;p.length;){if(u=p.shift(),u.closed=!0,u===g)return i.backtrace(g);for(s=o.getNeighbors(u,c,f),h=0,l=s.length;l>h;++h)a=s[h],a.closed||a.opened||(p.push(a),a.opened=!0,a.parent=u)}return[]},e.exports=r},{"../core/Util":6}],14:[function(t,e){function r(t){i.call(this,t),this.heuristic=function(){return 0}}var i=t("./AStarFinder");r.prototype=new i,r.prototype.constructor=r,e.exports=r},{"./AStarFinder":7}],15:[function(t,e){function r(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.heuristic=t.heuristic||i.manhattan,this.weight=t.weight||1,this.trackRecursion=t.trackRecursion||!1,this.timeLimit=t.timeLimit||1/0}t("../core/Util");var i=t("../core/Heuristic"),n=t("../core/Node");r.prototype.findPath=function(t,e,r,i,o){var s,a,u,h=0,l=(new Date).getTime(),p=function(t,e){return this.heuristic(Math.abs(e.x-t.x),Math.abs(e.y-t.y))}.bind(this),c=function(t,e){return t.x===e.x||t.y===e.y?1:Math.SQRT2},f=function(t,e,r,i,s){if(h++,this.timeLimit>0&&(new Date).getTime()-l>1e3*this.timeLimit)return 1/0;var a=e+p(t,g)*this.weight;if(a>r)return a;if(t==g)return i[s]=[t.x,t.y],t;var u,d,b,y,A=o.getNeighbors(t,this.allowDiagonal,this.dontCrossCorners);for(b=0,u=1/0;y=A[b];++b){if(this.trackRecursion&&(y.retainCount=y.retainCount+1||1,y.tested!==!0&&(y.tested=!0)),d=f(y,e+c(t,y),r,i,s+1),d instanceof n)return i[s]=[t.x,t.y],d;this.trackRecursion&&0===--y.retainCount&&(y.tested=!1),u>d&&(u=d)}return u}.bind(this),d=o.getNodeAt(t,e),g=o.getNodeAt(r,i),b=p(d,g);for(s=0;!0;++s){if(a=[],u=f(d,0,b,a,0),1/0===u)return[];if(u instanceof n)return a;b=u}return[]},e.exports=r},{"../core/Heuristic":4,"../core/Node":5,"../core/Util":6}],16:[function(t,e){function r(t){t=t||{},this.heuristic=t.heuristic||o.manhattan,this.trackJumpRecursion=t.trackJumpRecursion||!1}var i=t("heap"),n=t("../core/Util"),o=t("../core/Heuristic");r.prototype.findPath=function(t,e,r,o,s){var a,u=this.openList=new i(function(t,e){return t.f-e.f}),h=this.startNode=s.getNodeAt(t,e),l=this.endNode=s.getNodeAt(r,o);for(this.grid=s,h.g=0,h.f=0,u.push(h),h.opened=!0;!u.empty();){if(a=u.pop(),a.closed=!0,a===l)return n.expandPath(n.backtrace(l));this._identifySuccessors(a)}return[]},r.prototype._identifySuccessors=function(t){var e,r,i,n,s,a,u,h,l,p,c=this.grid,f=this.heuristic,d=this.openList,g=this.endNode.x,b=this.endNode.y,y=t.x,A=t.y,k=Math.abs;for(Math.max,e=this._findNeighbors(t),n=0,s=e.length;s>n;++n)if(r=e[n],i=this._jump(r[0],r[1],y,A)){if(a=i[0],u=i[1],p=c.getNodeAt(a,u),p.closed)continue;h=o.octile(k(a-y),k(u-A)),l=t.g+h,(!p.opened||l<p.g)&&(p.g=l,p.h=p.h||f(k(a-g),k(u-b)),p.f=p.g+p.h,p.parent=t,p.opened?d.updateItem(p):(d.push(p),p.opened=!0))}},r.prototype._jump=function(t,e,r,i){var n=this.grid,o=t-r,s=e-i;if(!n.isWalkableAt(t,e))return null;if(this.trackJumpRecursion===!0&&(n.getNodeAt(t,e).tested=!0),n.getNodeAt(t,e)===this.endNode)return[t,e];if(0!==o&&0!==s){if(n.isWalkableAt(t-o,e+s)&&!n.isWalkableAt(t-o,e)||n.isWalkableAt(t+o,e-s)&&!n.isWalkableAt(t,e-s))return[t,e]}else if(0!==o){if(n.isWalkableAt(t+o,e+1)&&!n.isWalkableAt(t,e+1)||n.isWalkableAt(t+o,e-1)&&!n.isWalkableAt(t,e-1))return[t,e]}else if(n.isWalkableAt(t+1,e+s)&&!n.isWalkableAt(t+1,e)||n.isWalkableAt(t-1,e+s)&&!n.isWalkableAt(t-1,e))return[t,e];return 0!==o&&0!==s&&(this._jump(t+o,e,t,e)||this._jump(t,e+s,t,e))?[t,e]:n.isWalkableAt(t+o,e)||n.isWalkableAt(t,e+s)?this._jump(t+o,e+s,t,e):null},r.prototype._findNeighbors=function(t){var e,r,i,n,o,s,a,u,h=t.parent,l=t.x,p=t.y,c=this.grid,f=[];if(h)e=h.x,r=h.y,i=(l-e)/Math.max(Math.abs(l-e),1),n=(p-r)/Math.max(Math.abs(p-r),1),0!==i&&0!==n?(c.isWalkableAt(l,p+n)&&f.push([l,p+n]),c.isWalkableAt(l+i,p)&&f.push([l+i,p]),(c.isWalkableAt(l,p+n)||c.isWalkableAt(l+i,p))&&f.push([l+i,p+n]),!c.isWalkableAt(l-i,p)&&c.isWalkableAt(l,p+n)&&f.push([l-i,p+n]),!c.isWalkableAt(l,p-n)&&c.isWalkableAt(l+i,p)&&f.push([l+i,p-n])):0===i?c.isWalkableAt(l,p+n)&&(f.push([l,p+n]),c.isWalkableAt(l+1,p)||f.push([l+1,p+n]),c.isWalkableAt(l-1,p)||f.push([l-1,p+n])):c.isWalkableAt(l+i,p)&&(f.push([l+i,p]),c.isWalkableAt(l,p+1)||f.push([l+i,p+1]),c.isWalkableAt(l,p-1)||f.push([l+i,p-1]));else for(o=c.getNeighbors(t,!0),a=0,u=o.length;u>a;++a)s=o[a],f.push([s.x,s.y]);return f},e.exports=r},{"../core/Heuristic":4,"../core/Util":6,heap:1}],17:[function(t,e){function r(t){n.call(this,t),t=t||{},this.heuristic=t.heuristic||i.manhattan}var i=t("../core/Heuristic"),n=t("./JumpPointFinder");r.prototype=new n,r.prototype.constructor=r,r.prototype._jump=function(t,e,r,i){var n=this.grid,o=t-r,s=e-i;if(!n.isWalkableAt(t,e))return null;if(this.trackJumpRecursion===!0&&(n.getNodeAt(t,e).tested=!0),n.getNodeAt(t,e)===this.endNode)return[t,e];if(0!==o){if(n.isWalkableAt(t,e-1)&&!n.isWalkableAt(t-o,e-1)||n.isWalkableAt(t,e+1)&&!n.isWalkableAt(t-o,e+1))return[t,e]}else{if(0===s)throw new Error("Only horizontal and vertical movements are allowed");if(n.isWalkableAt(t-1,e)&&!n.isWalkableAt(t-1,e-s)||n.isWalkableAt(t+1,e)&&!n.isWalkableAt(t+1,e-s))return[t,e];if(this._jump(t+1,e,t,e)||this._jump(t-1,e,t,e))return[t,e]}return this._jump(t+o,e+s,t,e)},r.prototype._findNeighbors=function(t){var e,r,i,n,o,s,a,u,h=t.parent,l=t.x,p=t.y,c=this.grid,f=[];if(h)e=h.x,r=h.y,i=(l-e)/Math.max(Math.abs(l-e),1),n=(p-r)/Math.max(Math.abs(p-r),1),0!==i?(c.isWalkableAt(l,p-1)&&f.push([l,p-1]),c.isWalkableAt(l,p+1)&&f.push([l,p+1]),c.isWalkableAt(l+i,p)&&f.push([l+i,p])):0!==n&&(c.isWalkableAt(l-1,p)&&f.push([l-1,p]),c.isWalkableAt(l+1,p)&&f.push([l+1,p]),c.isWalkableAt(l,p+n)&&f.push([l,p+n]));else for(o=c.getNeighbors(t,!1),a=0,u=o.length;u>a;++a)s=o[a],f.push([s.x,s.y]);return f},e.exports=r},{"../core/Heuristic":4,"./JumpPointFinder":16}],18:[function(t,e){e.exports={Heap:t("heap"),Node:t("./core/Node"),Grid:t("./core/Grid"),Util:t("./core/Util"),Heuristic:t("./core/Heuristic"),AStarFinder:t("./finders/AStarFinder"),BestFirstFinder:t("./finders/BestFirstFinder"),BreadthFirstFinder:t("./finders/BreadthFirstFinder"),DijkstraFinder:t("./finders/DijkstraFinder"),BiAStarFinder:t("./finders/BiAStarFinder"),BiBestFirstFinder:t("./finders/BiBestFirstFinder"),BiBreadthFirstFinder:t("./finders/BiBreadthFirstFinder"),BiDijkstraFinder:t("./finders/BiDijkstraFinder"),IDAStarFinder:t("./finders/IDAStarFinder"),JumpPointFinder:t("./finders/JumpPointFinder"),OrthogonalJumpPointFinder:t("./finders/OrthogonalJumpPointFinder")}},{"./core/Grid":3,"./core/Heuristic":4,"./core/Node":5,"./core/Util":6,"./finders/AStarFinder":7,"./finders/BestFirstFinder":8,"./finders/BiAStarFinder":9,"./finders/BiBestFirstFinder":10,"./finders/BiBreadthFirstFinder":11,"./finders/BiDijkstraFinder":12,"./finders/BreadthFirstFinder":13,"./finders/DijkstraFinder":14,"./finders/IDAStarFinder":15,"./finders/JumpPointFinder":16,"./finders/OrthogonalJumpPointFinder":17,heap:1}]},{},[18])(18)});
})();

(() => {
"use strict";
const nativeCrypto = globalThis.crypto;
const process = { env: {
  PORT: "0",
  ANALYTICS_REMOTE_URL: "data:application/json,%7B%7D",
  PROFILE_REMOTE_URL: "data:application/json,%7B%7D",
  ANALYTICS_REMOTE_TOKEN: "",
  DEVELOPER_PROFILE_IDS: ""
} };
const __dirname = "/offline";
const path = {
  join: (...parts) => parts.join("/").replace(/\\/g, "/").replace(/\/{2,}/g, "/"),
  normalize: (value) => String(value || "").replace(/\\/g, "/"),
  extname: (value) => { const match = String(value || "").match(/(\.[^./\\]+)$/); return match ? match[1] : ""; }
};
const fs = {
  readFileSync() { throw new Error("offline storage is empty"); },
  mkdirSync() {},
  writeFileSync() {},
  renameSync() {},
  stat(_path, callback) { callback(new Error("offline static files are not served")); },
  createReadStream() { return { pipe() {} }; }
};
const net = {
  isIP(value) {
    const candidate = String(value || "");
    if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(candidate) && candidate.split(".").every((part) => Number(part) <= 255)) return 4;
    if (candidate.includes(":")) {
      try { new URL(`http://[${candidate}]`); return 6; } catch { return 0; }
    }
    return 0;
  }
};
function offlineHash(value) {
  let a = 0x811c9dc5;
  let b = 0x9e3779b9;
  for (const char of String(value || "")) {
    const code = char.codePointAt(0) || 0;
    a = Math.imul(a ^ code, 0x01000193) >>> 0;
    b = Math.imul(b ^ code, 0x85ebca6b) >>> 0;
  }
  const seed = `${a.toString(16).padStart(8, "0")}${b.toString(16).padStart(8, "0")}`;
  return seed.repeat(4).slice(0, 64);
}
const crypto = {
  createHash() {
    let source = "";
    return {
      update(value) { source += String(value ?? ""); return this; },
      digest(encoding) { const value = offlineHash(source); return encoding === "hex" ? value : value; }
    };
  },
  randomBytes(length) {
    const bytes = new Uint8Array(Math.max(0, Number(length) || 0));
    if (nativeCrypto?.getRandomValues) nativeCrypto.getRandomValues(bytes);
    else for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256);
    return { toString: (encoding) => encoding === "hex" ? [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("") : String(bytes) };
  }
};
const Buffer = {
  from(value) {
    return { toString: (encoding) => encoding === "base64" ? btoa(unescape(encodeURIComponent(String(value)))) : String(value) };
  }
};
const PF = globalThis.PF;
const WebSocket = { OPEN: 1 };
class WebSocketServer {
  on() {}
  handleUpgrade() {}
}
const http = {
  createServer() {
    return { on() {}, listen(_port, callback) { callback?.(); } };
  }
};
const MAP_ENVIRONMENT_CONTRACT = Object.freeze({
  "schema": "dva-map-environment-contract-v268",
  "sourceManifest": null,
  "coordinateAuthority": "final world coordinates at exactly 1 texture pixel per world unit",
  "rules": {
    "interiorClusterDistanceUv": 0.07,
    "defaultPortalOpeningSpan": 84,
    "portalThickness": 28,
    "pixelsPerWorldUnit": 1,
    "coordinatesAreFinalExpandedWorldUnits": true,
    "sourceLayerRescalingForbidden": true,
    "sharedDoorGeometryRequired": true
  },
  "geometryCorrections": {
    "station": {
      "corridors": {
        "c8e": {
          "w": 90
        },
        "c13a": {
          "h": 195
        }
      }
    },
    "outpost": {
      "corridors": {}
    }
  },
  "doors": {
    "station": [
      {
        "id": "door-archive",
        "roomId": "archive",
        "corridorId": "c1",
        "openingSpan": 70,
        "worldOpeningRect": {
          "x": 992,
          "y": 410,
          "w": 56,
          "h": 140
        },
        "worldOpeningSpan": 140
      },
      {
        "id": "door-reactor",
        "roomId": "reactor",
        "corridorId": "c2",
        "openingSpan": 78,
        "worldOpeningRect": {
          "x": 2712,
          "y": 402,
          "w": 56,
          "h": 156
        },
        "worldOpeningSpan": 156
      },
      {
        "id": "door-electrical",
        "roomId": "electrical",
        "corridorId": "c9",
        "openingSpan": 90,
        "worldOpeningRect": {
          "x": 655,
          "y": 1642,
          "w": 180,
          "h": 56
        },
        "worldOpeningSpan": 180
      },
      {
        "id": "door-comms",
        "roomId": "comms",
        "corridorId": "c7",
        "openingSpan": 82,
        "worldOpeningRect": {
          "x": 2722,
          "y": 1913,
          "w": 56,
          "h": 164
        },
        "worldOpeningSpan": 164
      }
    ],
    "outpost": [
      {
        "id": "door-labs",
        "roomId": "labs",
        "corridorId": "o1",
        "openingSpan": 68,
        "worldOpeningRect": {
          "x": 1072,
          "y": 442,
          "w": 56,
          "h": 136
        },
        "worldOpeningSpan": 136
      },
      {
        "id": "door-drill",
        "roomId": "drill",
        "corridorId": "o2",
        "openingSpan": 66,
        "worldOpeningRect": {
          "x": 2612,
          "y": 454,
          "w": 56,
          "h": 132
        },
        "worldOpeningSpan": 132
      },
      {
        "id": "door-power",
        "roomId": "power",
        "corridorId": "o7",
        "openingSpan": 78,
        "worldOpeningRect": {
          "x": 857,
          "y": 1542,
          "w": 156,
          "h": 56
        },
        "worldOpeningSpan": 156
      },
      {
        "id": "door-garden",
        "roomId": "greenhouse",
        "corridorId": "o8",
        "openingSpan": 72,
        "worldOpeningRect": {
          "x": 2828,
          "y": 1552,
          "w": 144,
          "h": 56
        },
        "worldOpeningSpan": 144
      }
    ]
  },
  "objectTypes": {
    "recharge": {
      "effectKind": "stamina",
      "label": "スタミナ充填器",
      "effectLabel": "スタミナ +200",
      "amount": 200,
      "cooldownMs": 15000
    },
    "medPod": {
      "effectKind": "fullRecovery",
      "label": "応急処置ポッド",
      "effectLabel": "HP全回復・オーバーヒール",
      "amount": 1,
      "cooldownMs": 30000
    },
    "supply": {
      "effectKind": "stamina",
      "label": "物資保管庫",
      "effectLabel": "スタミナ +160",
      "amount": 160,
      "cooldownMs": 45000
    },
    "decoy": {
      "effectKind": "decoy",
      "label": "デコイビーコン",
      "effectLabel": "スタミナ +100・偽足音",
      "amount": 100,
      "cooldownMs": 20000
    },
    "restSeat": {
      "effectKind": "stamina",
      "label": "休息席",
      "effectLabel": "スタミナ +80",
      "amount": 80,
      "cooldownMs": 18000
    },
    "sofa": {
      "effectKind": "stamina",
      "label": "休息用ソファ",
      "effectLabel": "スタミナ +80",
      "amount": 80,
      "cooldownMs": 18000
    },
    "airPlant": {
      "effectKind": "stamina",
      "label": "空気浄化植栽",
      "effectLabel": "スタミナ +40",
      "amount": 40,
      "cooldownMs": 16000
    },
    "hydration": {
      "effectKind": "stamina",
      "label": "給水設備",
      "effectLabel": "スタミナ +100",
      "amount": 100,
      "cooldownMs": 15000
    },
    "nutritionStation": {
      "effectKind": "stamina",
      "label": "栄養補給設備",
      "effectLabel": "スタミナ +100",
      "amount": 100,
      "cooldownMs": 18000
    },
    "mistSprayer": {
      "effectKind": "stamina",
      "label": "ミスト設備",
      "effectLabel": "スタミナ +50",
      "amount": 50,
      "cooldownMs": 18000
    },
    "greenhousePlanter": {
      "effectKind": "stamina",
      "label": "環境植栽",
      "effectLabel": "スタミナ +40",
      "amount": 40,
      "cooldownMs": 18000
    },
    "diagnosticBed": {
      "effectKind": "heal",
      "label": "診断ベッド",
      "effectLabel": "ボディダメージ回復",
      "amount": 1,
      "cooldownMs": 30000
    },
    "medicalCabinet": {
      "effectKind": "heal",
      "label": "医療キャビネット",
      "effectLabel": "ボディダメージ回復",
      "amount": 1,
      "cooldownMs": 30000
    },
    "emergencyKit": {
      "effectKind": "heal",
      "label": "救急キット",
      "effectLabel": "ボディダメージ回復",
      "amount": 1,
      "cooldownMs": 36000
    },
    "bookshelf": {
      "effectKind": "mana",
      "label": "資料棚",
      "effectLabel": "マナ +1",
      "amount": 1,
      "cooldownMs": 32000
    },
    "archiveCabinet": {
      "effectKind": "mana",
      "label": "保管キャビネット",
      "effectLabel": "マナ +1",
      "amount": 1,
      "cooldownMs": 36000
    },
    "readingLamp": {
      "effectKind": "mana",
      "label": "閲覧灯",
      "effectLabel": "マナ +1",
      "amount": 1,
      "cooldownMs": 26000
    },
    "wallDisplay": {
      "effectKind": "mana",
      "label": "情報ディスプレイ",
      "effectLabel": "マナ +1",
      "amount": 1,
      "cooldownMs": 36000
    },
    "recyclingUnit": {
      "effectKind": "stamina",
      "label": "再資源化設備",
      "effectLabel": "スタミナ +70",
      "amount": 70,
      "cooldownMs": 34000
    },
    "holoProjector": {
      "effectKind": "mana",
      "label": "ホロ投影機",
      "effectLabel": "マナ +1",
      "amount": 1,
      "cooldownMs": 38000
    },
    "radioConsole": {
      "effectKind": "mana",
      "label": "通信卓",
      "effectLabel": "マナ +1",
      "amount": 1,
      "cooldownMs": 38000
    },
    "antennaArray": {
      "effectKind": "mana",
      "label": "アンテナアレイ",
      "effectLabel": "マナ +1",
      "amount": 1,
      "cooldownMs": 40000
    },
    "serverRack": {
      "effectKind": "mana",
      "label": "サーバーラック",
      "effectLabel": "マナ +1",
      "amount": 1,
      "cooldownMs": 40000
    },
    "commandDesk": {
      "effectKind": "mana",
      "label": "指令卓",
      "effectLabel": "マナ +1",
      "amount": 1,
      "cooldownMs": 38000
    },
    "powerCabinet": {
      "effectKind": "stamina",
      "label": "電力盤",
      "effectLabel": "スタミナ +60",
      "amount": 60,
      "cooldownMs": 38000
    },
    "reactorGauge": {
      "effectKind": "stamina",
      "label": "出力計",
      "effectLabel": "スタミナ +60",
      "amount": 60,
      "cooldownMs": 38000
    },
    "cableSpool": {
      "effectKind": "stamina",
      "label": "ケーブルリール",
      "effectLabel": "スタミナ +50",
      "amount": 50,
      "cooldownMs": 34000
    },
    "toolCart": {
      "effectKind": "stamina",
      "label": "ツールカート",
      "effectLabel": "スタミナ +50",
      "amount": 50,
      "cooldownMs": 34000
    },
    "workbench": {
      "effectKind": "stamina",
      "label": "作業台",
      "effectLabel": "スタミナ +60",
      "amount": 60,
      "cooldownMs": 38000
    },
    "coolingUnit": {
      "effectKind": "stamina",
      "label": "冷却設備",
      "effectLabel": "スタミナ +50",
      "amount": 50,
      "cooldownMs": 36000
    },
    "securityConsole": {
      "effectKind": "mana",
      "label": "監視卓",
      "effectLabel": "マナ +1",
      "amount": 1,
      "cooldownMs": 40000
    },
    "cameraTripod": {
      "effectKind": "mana",
      "label": "監視カメラ架台",
      "effectLabel": "マナ +1",
      "amount": 1,
      "cooldownMs": 36000
    },
    "equipmentLocker": {
      "effectKind": "stamina",
      "label": "装備ロッカー",
      "effectLabel": "スタミナ +60",
      "amount": 60,
      "cooldownMs": 36000
    },
    "cargoCrate": {
      "effectKind": "stamina",
      "label": "貨物ケース",
      "effectLabel": "スタミナ +60",
      "amount": 60,
      "cooldownMs": 34000
    },
    "palletJack": {
      "effectKind": "stamina",
      "label": "パレット搬送機",
      "effectLabel": "スタミナ +50",
      "amount": 50,
      "cooldownMs": 34000
    },
    "mineralScanner": {
      "effectKind": "mana",
      "label": "鉱物スキャナー",
      "effectLabel": "マナ +1",
      "amount": 1,
      "cooldownMs": 40000
    },
    "specimenCase": {
      "effectKind": "mana",
      "label": "試料ケース",
      "effectLabel": "マナ +1",
      "amount": 1,
      "cooldownMs": 36000
    },
    "sterilizer": {
      "effectKind": "fullRecovery",
      "label": "滅菌設備",
      "effectLabel": "HP全回復・オーバーヒール",
      "amount": 1,
      "cooldownMs": 36000
    },
    "conferenceTable": {
      "effectKind": "mana",
      "label": "協議テーブル",
      "effectLabel": "マナ +1",
      "amount": 1,
      "cooldownMs": 36000
    },
    "compostUnit": {
      "effectKind": "stamina",
      "label": "循環処理設備",
      "effectLabel": "スタミナ +70",
      "amount": 70,
      "cooldownMs": 34000
    }
  },
  "rooms": {
    "station": {
      "archive": [
        {
          "id": "download-a",
          "type": "task",
          "u": 0.3,
          "v": 0.36,
          "worldX": 418,
          "worldY": 376,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "repair-oxygen-a",
          "type": "repair",
          "u": 0.83,
          "v": 0.18,
          "worldX": 874,
          "worldY": 268,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "station-supply",
          "type": "supply",
          "u": 0.63,
          "v": 0.86,
          "worldX": 702,
          "worldY": 676,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "station-seat-archive",
          "type": "restSeat",
          "u": 0.29,
          "v": 0.69,
          "worldX": 409,
          "worldY": 574,
          "worldFootprint": {
            "width": 80,
            "height": 72
          }
        },
        {
          "id": "station-plant-archive",
          "type": "airPlant",
          "u": 0.17,
          "v": 0.61,
          "worldX": 306,
          "worldY": 526,
          "worldFootprint": {
            "width": 72,
            "height": 84
          }
        },
        {
          "id": "station-archive-bookshelf-1",
          "type": "bookshelf",
          "u": 0.17,
          "v": 0.18,
          "worldX": 306,
          "worldY": 268,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "station-archive-archive-cabinet-2",
          "type": "archiveCabinet",
          "u": 0.45,
          "v": 0.18,
          "worldX": 547,
          "worldY": 268,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "station-archive-reading-lamp-3",
          "type": "readingLamp",
          "u": 0.16,
          "v": 0.62,
          "worldX": 298,
          "worldY": 532,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        },
        {
          "id": "station-archive-sofa-4",
          "type": "sofa",
          "u": 0.27,
          "v": 0.68,
          "worldX": 392,
          "worldY": 568,
          "worldFootprint": {
            "width": 144,
            "height": 92
          }
        },
        {
          "id": "station-archive-wall-display-5",
          "type": "wallDisplay",
          "u": 0.3,
          "v": 0.83,
          "worldX": 418,
          "worldY": 658,
          "worldFootprint": {
            "width": 96,
            "height": 68
          }
        },
        {
          "id": "station-archive-nutrition-station-6",
          "type": "nutritionStation",
          "u": 0.76,
          "v": 0.17,
          "worldX": 814,
          "worldY": 262,
          "worldFootprint": {
            "width": 112,
            "height": 96
          }
        },
        {
          "id": "station-archive-recycling-unit-7",
          "type": "recyclingUnit",
          "u": 0.84,
          "v": 0.86,
          "worldX": 882,
          "worldY": 676,
          "worldFootprint": {
            "width": 112,
            "height": 96
          }
        },
        {
          "id": "station-archive-holo-projector-8",
          "type": "holoProjector",
          "u": 0.31,
          "v": 0.84,
          "worldX": 427,
          "worldY": 664,
          "worldFootprint": {
            "width": 96,
            "height": 68
          }
        }
      ],
      "comms": [
        {
          "id": "upload-a",
          "type": "task",
          "u": 0.58,
          "v": 0.18,
          "worldX": 3318,
          "worldY": 1859,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "upload-e",
          "type": "task",
          "u": 0.36,
          "v": 0.18,
          "worldX": 3103,
          "worldY": 1859,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "repair-comms",
          "type": "repair",
          "u": 0.45,
          "v": 0.18,
          "worldX": 3191,
          "worldY": 1859,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "repair-oxygen-b",
          "type": "repair",
          "u": 0.57,
          "v": 0.18,
          "worldX": 3309,
          "worldY": 1859,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "doorlog",
          "type": "utility",
          "u": 0.22,
          "v": 0.8,
          "worldX": 2966,
          "worldY": 2268,
          "worldFootprint": {
            "width": 80,
            "height": 72
          }
        },
        {
          "id": "station-hush",
          "type": "hushField",
          "u": 0.67,
          "v": 0.65,
          "worldX": 3407,
          "worldY": 2169,
          "worldFootprint": {
            "width": 80,
            "height": 72
          }
        },
        {
          "id": "station-plant-comms",
          "type": "airPlant",
          "u": 0.86,
          "v": 0.83,
          "worldX": 3593,
          "worldY": 2288,
          "worldFootprint": {
            "width": 72,
            "height": 84
          }
        },
        {
          "id": "station-comms-radio-console-1",
          "type": "radioConsole",
          "u": 0.22,
          "v": 0.8,
          "worldX": 2966,
          "worldY": 2268,
          "worldFootprint": {
            "width": 96,
            "height": 68
          }
        },
        {
          "id": "station-comms-antenna-array-2",
          "type": "antennaArray",
          "u": 0.82,
          "v": 0.3,
          "worldX": 3554,
          "worldY": 1938,
          "worldFootprint": {
            "width": 96,
            "height": 68
          }
        },
        {
          "id": "station-comms-server-rack-3",
          "type": "serverRack",
          "u": 0.84,
          "v": 0.55,
          "worldX": 3573,
          "worldY": 2103,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "station-comms-wall-display-4",
          "type": "wallDisplay",
          "u": 0.94,
          "v": 0.27,
          "worldX": 3671,
          "worldY": 1918,
          "worldFootprint": {
            "width": 96,
            "height": 68
          }
        },
        {
          "id": "station-comms-command-desk-5",
          "type": "commandDesk",
          "u": 0.53,
          "v": 0.18,
          "worldX": 3269,
          "worldY": 1859,
          "worldFootprint": {
            "width": 112,
            "height": 96
          }
        },
        {
          "id": "station-comms-nutrition-station-6",
          "type": "nutritionStation",
          "u": 0.72,
          "v": 0.83,
          "worldX": 3456,
          "worldY": 2288,
          "worldFootprint": {
            "width": 112,
            "height": 96
          }
        },
        {
          "id": "station-comms-emergency-kit-7",
          "type": "emergencyKit",
          "u": 0.94,
          "v": 0.69,
          "worldX": 3671,
          "worldY": 2195,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        }
      ],
      "electrical": [
        {
          "id": "download-b",
          "type": "task",
          "u": 0.73,
          "v": 0.37,
          "worldX": 862,
          "worldY": 1936,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "station-desk-electrical",
          "type": "commandDesk",
          "u": 0.16,
          "v": 0.7,
          "worldX": 337,
          "worldY": 2174,
          "worldFootprint": {
            "width": 112,
            "height": 96
          }
        },
        {
          "id": "station-electrical-power-cabinet-1",
          "type": "powerCabinet",
          "u": 0.17,
          "v": 0.14,
          "worldX": 346,
          "worldY": 1771,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "station-electrical-server-rack-2",
          "type": "serverRack",
          "u": 0.8,
          "v": 0.45,
          "worldX": 926,
          "worldY": 1994,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "station-electrical-cable-spool-3",
          "type": "cableSpool",
          "u": 0.1,
          "v": 0.35,
          "worldX": 282,
          "worldY": 1922,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        },
        {
          "id": "station-electrical-tool-cart-4",
          "type": "toolCart",
          "u": 0.31,
          "v": 0.72,
          "worldX": 475,
          "worldY": 2188,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        },
        {
          "id": "station-electrical-workbench-5",
          "type": "workbench",
          "u": 0.15,
          "v": 0.7,
          "worldX": 328,
          "worldY": 2174,
          "worldFootprint": {
            "width": 144,
            "height": 92
          }
        },
        {
          "id": "station-electrical-reactor-gauge-6",
          "type": "reactorGauge",
          "u": 0.47,
          "v": 0.88,
          "worldX": 622,
          "worldY": 2304,
          "worldFootprint": {
            "width": 96,
            "height": 68
          }
        },
        {
          "id": "station-electrical-cooling-unit-7",
          "type": "coolingUnit",
          "u": 0.88,
          "v": 0.8,
          "worldX": 1000,
          "worldY": 2246,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "station-electrical-emergency-kit-8",
          "type": "emergencyKit",
          "u": 0.74,
          "v": 0.9,
          "worldX": 871,
          "worldY": 2318,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        }
      ],
      "engine": [
        {
          "id": "upload-c",
          "type": "task",
          "u": 0.15,
          "v": 0.32,
          "worldX": 3114,
          "worldY": 1216,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "station-locker-engine",
          "type": "equipmentLocker",
          "u": 0.92,
          "v": 0.8,
          "worldX": 3699,
          "worldY": 1466,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "station-engine-workbench-1",
          "type": "workbench",
          "u": 0.2,
          "v": 0.82,
          "worldX": 3152,
          "worldY": 1476,
          "worldFootprint": {
            "width": 144,
            "height": 92
          }
        },
        {
          "id": "station-engine-tool-cart-2",
          "type": "toolCart",
          "u": 0.57,
          "v": 0.82,
          "worldX": 3433,
          "worldY": 1476,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        },
        {
          "id": "station-engine-cable-spool-3",
          "type": "cableSpool",
          "u": 0.62,
          "v": 0.84,
          "worldX": 3471,
          "worldY": 1487,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        },
        {
          "id": "station-engine-cooling-unit-4",
          "type": "coolingUnit",
          "u": 0.72,
          "v": 0.88,
          "worldX": 3547,
          "worldY": 1508,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "station-engine-power-cabinet-5",
          "type": "powerCabinet",
          "u": 0.9,
          "v": 0.87,
          "worldX": 3684,
          "worldY": 1502,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "station-engine-equipment-locker-6",
          "type": "equipmentLocker",
          "u": 0.08,
          "v": 0.18,
          "worldX": 3061,
          "worldY": 1144,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "station-engine-emergency-kit-7",
          "type": "emergencyKit",
          "u": 0.93,
          "v": 0.42,
          "worldX": 3707,
          "worldY": 1268,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        }
      ],
      "med": [
        {
          "id": "download-c",
          "type": "task",
          "u": 0.17,
          "v": 0.39,
          "worldX": 1506,
          "worldY": 2203,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "vitals",
          "type": "utility",
          "u": 0.17,
          "v": 0.64,
          "worldX": 1506,
          "worldY": 2333,
          "worldFootprint": {
            "width": 80,
            "height": 72
          }
        },
        {
          "id": "station-medpod",
          "type": "medPod",
          "u": 0.77,
          "v": 0.39,
          "worldX": 1950,
          "worldY": 2203,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "station-plant-med",
          "type": "airPlant",
          "u": 0.77,
          "v": 0.7,
          "worldX": 1950,
          "worldY": 2364,
          "worldFootprint": {
            "width": 72,
            "height": 84
          }
        },
        {
          "id": "station-water-med",
          "type": "hydration",
          "u": 0.7,
          "v": 0.9,
          "worldX": 1898,
          "worldY": 2468,
          "worldFootprint": {
            "width": 72,
            "height": 84
          }
        },
        {
          "id": "station-med-diagnostic-bed-1",
          "type": "diagnosticBed",
          "u": 0.19,
          "v": 0.38,
          "worldX": 1521,
          "worldY": 2198,
          "worldFootprint": {
            "width": 144,
            "height": 92
          }
        },
        {
          "id": "station-med-medical-cabinet-2",
          "type": "medicalCabinet",
          "u": 0.45,
          "v": 0.15,
          "worldX": 1713,
          "worldY": 2078,
          "worldFootprint": {
            "width": 112,
            "height": 96
          }
        },
        {
          "id": "station-med-sterilizer-3",
          "type": "sterilizer",
          "u": 0.12,
          "v": 0.9,
          "worldX": 1469,
          "worldY": 2468,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "station-med-specimen-case-4",
          "type": "specimenCase",
          "u": 0.77,
          "v": 0.7,
          "worldX": 1950,
          "worldY": 2364,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        },
        {
          "id": "station-med-emergency-kit-5",
          "type": "emergencyKit",
          "u": 0.82,
          "v": 0.5,
          "worldX": 1987,
          "worldY": 2260,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        },
        {
          "id": "station-med-mist-sprayer-6",
          "type": "mistSprayer",
          "u": 0.88,
          "v": 0.15,
          "worldX": 2031,
          "worldY": 2078,
          "worldFootprint": {
            "width": 72,
            "height": 84
          }
        }
      ],
      "meeting": [
        {
          "id": "upload-b",
          "type": "task",
          "u": 0.35,
          "v": 0.16,
          "worldX": 1949,
          "worldY": 1162,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "meeting-button",
          "type": "emergency",
          "u": 0.5,
          "v": 0.5,
          "worldX": 2090,
          "worldY": 1400,
          "worldFootprint": {
            "width": 80,
            "height": 72
          }
        },
        {
          "id": "admin",
          "type": "utility",
          "u": 0.84,
          "v": 0.46,
          "worldX": 2410,
          "worldY": 1372,
          "worldFootprint": {
            "width": 80,
            "height": 72
          }
        },
        {
          "id": "station-seat-meeting-a",
          "type": "restSeat",
          "u": 0.25,
          "v": 0.81,
          "worldX": 1855,
          "worldY": 1617,
          "worldFootprint": {
            "width": 80,
            "height": 72
          }
        },
        {
          "id": "station-seat-meeting-b",
          "type": "restSeat",
          "u": 0.73,
          "v": 0.81,
          "worldX": 2306,
          "worldY": 1617,
          "worldFootprint": {
            "width": 80,
            "height": 72
          }
        },
        {
          "id": "station-water-meeting",
          "type": "hydration",
          "u": 0.72,
          "v": 0.16,
          "worldX": 2297,
          "worldY": 1162,
          "worldFootprint": {
            "width": 72,
            "height": 84
          }
        },
        {
          "id": "station-meeting-conference-table-1",
          "type": "conferenceTable",
          "u": 0.5,
          "v": 0.5,
          "worldX": 2090,
          "worldY": 1400,
          "worldFootprint": {
            "width": 144,
            "height": 92
          }
        },
        {
          "id": "station-meeting-sofa-2",
          "type": "sofa",
          "u": 0.14,
          "v": 0.72,
          "worldX": 1752,
          "worldY": 1554,
          "worldFootprint": {
            "width": 144,
            "height": 92
          }
        },
        {
          "id": "station-meeting-holo-projector-3",
          "type": "holoProjector",
          "u": 0.5,
          "v": 0.85,
          "worldX": 2090,
          "worldY": 1645,
          "worldFootprint": {
            "width": 96,
            "height": 68
          }
        },
        {
          "id": "station-meeting-reading-lamp-4",
          "type": "readingLamp",
          "u": 0.16,
          "v": 0.38,
          "worldX": 1770,
          "worldY": 1316,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        },
        {
          "id": "station-meeting-wall-display-5",
          "type": "wallDisplay",
          "u": 0.19,
          "v": 0.14,
          "worldX": 1799,
          "worldY": 1148,
          "worldFootprint": {
            "width": 96,
            "height": 68
          }
        },
        {
          "id": "station-meeting-nutrition-station-6",
          "type": "nutritionStation",
          "u": 0.67,
          "v": 0.14,
          "worldX": 2250,
          "worldY": 1148,
          "worldFootprint": {
            "width": 112,
            "height": 96
          }
        },
        {
          "id": "station-meeting-hydration-7",
          "type": "hydration",
          "u": 0.72,
          "v": 0.14,
          "worldX": 2297,
          "worldY": 1148,
          "worldFootprint": {
            "width": 72,
            "height": 84
          }
        },
        {
          "id": "station-meeting-recycling-unit-8",
          "type": "recyclingUnit",
          "u": 0.9,
          "v": 0.15,
          "worldX": 2466,
          "worldY": 1155,
          "worldFootprint": {
            "width": 112,
            "height": 96
          }
        }
      ],
      "reactor": [
        {
          "id": "download-d",
          "type": "task",
          "u": 0.68,
          "v": 0.27,
          "worldX": 3447,
          "worldY": 344,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "upload-d",
          "type": "task",
          "u": 0.35,
          "v": 0.27,
          "worldX": 3104,
          "worldY": 344,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "repair-reactor-a",
          "type": "repair",
          "u": 0.35,
          "v": 0.27,
          "worldX": 3104,
          "worldY": 344,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "repair-reactor-b",
          "type": "repair",
          "u": 0.68,
          "v": 0.27,
          "worldX": 3447,
          "worldY": 344,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "station-desk-reactor",
          "type": "commandDesk",
          "u": 0.64,
          "v": 0.82,
          "worldX": 3406,
          "worldY": 718,
          "worldFootprint": {
            "width": 112,
            "height": 96
          }
        },
        {
          "id": "station-reactor-reactor-gauge-1",
          "type": "reactorGauge",
          "u": 0.38,
          "v": 0.3,
          "worldX": 3135,
          "worldY": 364,
          "worldFootprint": {
            "width": 96,
            "height": 68
          }
        },
        {
          "id": "station-reactor-cooling-unit-2",
          "type": "coolingUnit",
          "u": 0.84,
          "v": 0.18,
          "worldX": 3614,
          "worldY": 282,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "station-reactor-power-cabinet-3",
          "type": "powerCabinet",
          "u": 0.9,
          "v": 0.55,
          "worldX": 3676,
          "worldY": 534,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "station-reactor-cable-spool-4",
          "type": "cableSpool",
          "u": 0.85,
          "v": 0.67,
          "worldX": 3624,
          "worldY": 616,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        },
        {
          "id": "station-reactor-tool-cart-5",
          "type": "toolCart",
          "u": 0.52,
          "v": 0.82,
          "worldX": 3281,
          "worldY": 718,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        },
        {
          "id": "station-reactor-workbench-6",
          "type": "workbench",
          "u": 0.3,
          "v": 0.82,
          "worldX": 3052,
          "worldY": 718,
          "worldFootprint": {
            "width": 144,
            "height": 92
          }
        },
        {
          "id": "station-reactor-emergency-kit-7",
          "type": "emergencyKit",
          "u": 0.9,
          "v": 0.75,
          "worldX": 3676,
          "worldY": 670,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        },
        {
          "id": "station-reactor-wall-display-8",
          "type": "wallDisplay",
          "u": 0.15,
          "v": 0.15,
          "worldX": 2896,
          "worldY": 262,
          "worldFootprint": {
            "width": 96,
            "height": 68
          }
        }
      ],
      "security": [
        {
          "id": "station-decoy",
          "type": "decoy",
          "u": 0.49,
          "v": 0.88,
          "worldX": 1763,
          "worldY": 653,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "station-desk-security",
          "type": "commandDesk",
          "u": 0.7,
          "v": 0.66,
          "worldX": 1914,
          "worldY": 530,
          "worldFootprint": {
            "width": 112,
            "height": 96
          }
        },
        {
          "id": "station-security-security-console-1",
          "type": "securityConsole",
          "u": 0.38,
          "v": 0.18,
          "worldX": 1684,
          "worldY": 261,
          "worldFootprint": {
            "width": 112,
            "height": 96
          }
        },
        {
          "id": "station-security-camera-tripod-2",
          "type": "cameraTripod",
          "u": 0.17,
          "v": 0.44,
          "worldX": 1532,
          "worldY": 406,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        },
        {
          "id": "station-security-server-rack-3",
          "type": "serverRack",
          "u": 0.83,
          "v": 0.18,
          "worldX": 2008,
          "worldY": 261,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "station-security-wall-display-4",
          "type": "wallDisplay",
          "u": 0.55,
          "v": 0.17,
          "worldX": 1806,
          "worldY": 255,
          "worldFootprint": {
            "width": 96,
            "height": 68
          }
        },
        {
          "id": "station-security-reading-lamp-5",
          "type": "readingLamp",
          "u": 0.72,
          "v": 0.66,
          "worldX": 1928,
          "worldY": 530,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        },
        {
          "id": "station-security-emergency-kit-6",
          "type": "emergencyKit",
          "u": 0.86,
          "v": 0.67,
          "worldX": 2029,
          "worldY": 535,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        },
        {
          "id": "station-security-nutrition-station-7",
          "type": "nutritionStation",
          "u": 0.23,
          "v": 0.83,
          "worldX": 1576,
          "worldY": 625,
          "worldFootprint": {
            "width": 112,
            "height": 96
          }
        }
      ],
      "storage": [
        {
          "id": "download-e",
          "type": "task",
          "u": 0.78,
          "v": 0.83,
          "worldX": 1352,
          "worldY": 1569,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "station-recharge",
          "type": "recharge",
          "u": 0.68,
          "v": 0.83,
          "worldX": 1312,
          "worldY": 1569,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "station-locker-storage",
          "type": "equipmentLocker",
          "u": 0.14,
          "v": 0.2,
          "worldX": 1096,
          "worldY": 1304,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "station-storage-cargo-crate-1",
          "type": "cargoCrate",
          "u": 0.45,
          "v": 0.85,
          "worldX": 1220,
          "worldY": 1577,
          "worldFootprint": {
            "width": 144,
            "height": 92
          }
        },
        {
          "id": "station-storage-cargo-crate-2",
          "type": "cargoCrate",
          "u": 0.5,
          "v": 0.85,
          "worldX": 1240,
          "worldY": 1577,
          "worldFootprint": {
            "width": 144,
            "height": 92
          }
        },
        {
          "id": "station-storage-pallet-jack-3",
          "type": "palletJack",
          "u": 0.14,
          "v": 0.77,
          "worldX": 1096,
          "worldY": 1543,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        },
        {
          "id": "station-storage-equipment-locker-4",
          "type": "equipmentLocker",
          "u": 0.15,
          "v": 0.18,
          "worldX": 1100,
          "worldY": 1296,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "station-storage-recycling-unit-5",
          "type": "recyclingUnit",
          "u": 0.3,
          "v": 0.19,
          "worldX": 1160,
          "worldY": 1300,
          "worldFootprint": {
            "width": 112,
            "height": 96
          }
        },
        {
          "id": "station-storage-tool-cart-6",
          "type": "toolCart",
          "u": 0.58,
          "v": 0.84,
          "worldX": 1272,
          "worldY": 1573,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        }
      ]
    },
    "outpost": {
      "drill": [
        {
          "id": "download-o-d",
          "type": "task",
          "u": 0.84,
          "v": 0.18,
          "worldX": 3446,
          "worldY": 299,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "upload-o-c",
          "type": "task",
          "u": 0.87,
          "v": 0.32,
          "worldX": 3475,
          "worldY": 391,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "repair-reactor-a",
          "type": "repair",
          "u": 0.56,
          "v": 0.17,
          "worldX": 3178,
          "worldY": 292,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "repair-reactor-b",
          "type": "repair",
          "u": 0.66,
          "v": 0.17,
          "worldX": 3274,
          "worldY": 292,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "outpost-supply",
          "type": "supply",
          "u": 0.85,
          "v": 0.8,
          "worldX": 3456,
          "worldY": 708,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "outpost-desk-drill",
          "type": "commandDesk",
          "u": 0.84,
          "v": 0.3,
          "worldX": 3446,
          "worldY": 378,
          "worldFootprint": {
            "width": 112,
            "height": 96
          }
        },
        {
          "id": "outpost-locker-drill",
          "type": "equipmentLocker",
          "u": 0.93,
          "v": 0.18,
          "worldX": 3533,
          "worldY": 299,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "outpost-drill-mineral-scanner-1",
          "type": "mineralScanner",
          "u": 0.84,
          "v": 0.2,
          "worldX": 3446,
          "worldY": 312,
          "worldFootprint": {
            "width": 96,
            "height": 68
          }
        },
        {
          "id": "outpost-drill-workbench-2",
          "type": "workbench",
          "u": 0.47,
          "v": 0.8,
          "worldX": 3091,
          "worldY": 708,
          "worldFootprint": {
            "width": 144,
            "height": 92
          }
        },
        {
          "id": "outpost-drill-tool-cart-3",
          "type": "toolCart",
          "u": 0.61,
          "v": 0.8,
          "worldX": 3226,
          "worldY": 708,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        },
        {
          "id": "outpost-drill-cable-spool-4",
          "type": "cableSpool",
          "u": 0.73,
          "v": 0.8,
          "worldX": 3341,
          "worldY": 708,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        },
        {
          "id": "outpost-drill-power-cabinet-5",
          "type": "powerCabinet",
          "u": 0.91,
          "v": 0.5,
          "worldX": 3514,
          "worldY": 510,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "outpost-drill-cargo-crate-6",
          "type": "cargoCrate",
          "u": 0.25,
          "v": 0.8,
          "worldX": 2880,
          "worldY": 708,
          "worldFootprint": {
            "width": 144,
            "height": 92
          }
        },
        {
          "id": "outpost-drill-pallet-jack-7",
          "type": "palletJack",
          "u": 0.36,
          "v": 0.8,
          "worldX": 2986,
          "worldY": 708,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        },
        {
          "id": "outpost-drill-emergency-kit-8",
          "type": "emergencyKit",
          "u": 0.85,
          "v": 0.8,
          "worldX": 3456,
          "worldY": 708,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        }
      ],
      "greenhouse": [
        {
          "id": "upload-o-a",
          "type": "task",
          "u": 0.88,
          "v": 0.42,
          "worldX": 3475,
          "worldY": 1857,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "download-o-e",
          "type": "task",
          "u": 0.89,
          "v": 0.57,
          "worldX": 3486,
          "worldY": 1956,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "repair-oxygen-a",
          "type": "repair",
          "u": 0.89,
          "v": 0.5,
          "worldX": 3486,
          "worldY": 1910,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "doorlog",
          "type": "utility",
          "u": 0.88,
          "v": 0.37,
          "worldX": 3475,
          "worldY": 1824,
          "worldFootprint": {
            "width": 80,
            "height": 72
          }
        },
        {
          "id": "outpost-hush",
          "type": "hushField",
          "u": 0.8,
          "v": 0.65,
          "worldX": 3392,
          "worldY": 2009,
          "worldFootprint": {
            "width": 80,
            "height": 72
          }
        },
        {
          "id": "outpost-plant-greenhouse-a",
          "type": "airPlant",
          "u": 0.25,
          "v": 0.32,
          "worldX": 2820,
          "worldY": 1791,
          "worldFootprint": {
            "width": 72,
            "height": 84
          }
        },
        {
          "id": "outpost-plant-greenhouse-b",
          "type": "airPlant",
          "u": 0.72,
          "v": 0.55,
          "worldX": 3309,
          "worldY": 1943,
          "worldFootprint": {
            "width": 72,
            "height": 84
          }
        },
        {
          "id": "outpost-water-greenhouse",
          "type": "hydration",
          "u": 0.53,
          "v": 0.12,
          "worldX": 3111,
          "worldY": 1659,
          "worldFootprint": {
            "width": 72,
            "height": 84
          }
        },
        {
          "id": "outpost-greenhouse-greenhouse-planter-1",
          "type": "greenhousePlanter",
          "u": 0.5,
          "v": 0.28,
          "worldX": 3080,
          "worldY": 1765,
          "worldFootprint": {
            "width": 144,
            "height": 92
          }
        },
        {
          "id": "outpost-greenhouse-greenhouse-planter-2",
          "type": "greenhousePlanter",
          "u": 0.5,
          "v": 0.5,
          "worldX": 3080,
          "worldY": 1910,
          "worldFootprint": {
            "width": 144,
            "height": 92
          }
        },
        {
          "id": "outpost-greenhouse-greenhouse-planter-3",
          "type": "greenhousePlanter",
          "u": 0.5,
          "v": 0.7,
          "worldX": 3080,
          "worldY": 2042,
          "worldFootprint": {
            "width": 144,
            "height": 92
          }
        },
        {
          "id": "outpost-greenhouse-mist-sprayer-4",
          "type": "mistSprayer",
          "u": 0.3,
          "v": 0.28,
          "worldX": 2872,
          "worldY": 1765,
          "worldFootprint": {
            "width": 72,
            "height": 84
          }
        },
        {
          "id": "outpost-greenhouse-compost-unit-5",
          "type": "compostUnit",
          "u": 0.13,
          "v": 0.85,
          "worldX": 2695,
          "worldY": 2141,
          "worldFootprint": {
            "width": 112,
            "height": 96
          }
        },
        {
          "id": "outpost-greenhouse-nutrition-station-6",
          "type": "nutritionStation",
          "u": 0.58,
          "v": 0.13,
          "worldX": 3163,
          "worldY": 1666,
          "worldFootprint": {
            "width": 112,
            "height": 96
          }
        },
        {
          "id": "outpost-greenhouse-sofa-7",
          "type": "sofa",
          "u": 0.33,
          "v": 0.85,
          "worldX": 2903,
          "worldY": 2141,
          "worldFootprint": {
            "width": 144,
            "height": 92
          }
        },
        {
          "id": "outpost-greenhouse-recycling-unit-8",
          "type": "recyclingUnit",
          "u": 0.15,
          "v": 0.85,
          "worldX": 2716,
          "worldY": 2141,
          "worldFootprint": {
            "width": 112,
            "height": 96
          }
        }
      ],
      "hub": [
        {
          "id": "upload-o-b",
          "type": "task",
          "u": 0.15,
          "v": 0.12,
          "worldX": 1595,
          "worldY": 1020,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "upload-o-d",
          "type": "task",
          "u": 0.7,
          "v": 0.12,
          "worldX": 2090,
          "worldY": 1020,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "meeting-button",
          "type": "emergency",
          "u": 0.5,
          "v": 0.51,
          "worldX": 1910,
          "worldY": 1282,
          "worldFootprint": {
            "width": 80,
            "height": 72
          }
        },
        {
          "id": "repair-comms",
          "type": "repair",
          "u": 0.72,
          "v": 0.12,
          "worldX": 2108,
          "worldY": 1020,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "admin",
          "type": "utility",
          "u": 0.55,
          "v": 0.5,
          "worldX": 1955,
          "worldY": 1275,
          "worldFootprint": {
            "width": 80,
            "height": 72
          }
        },
        {
          "id": "outpost-recharge",
          "type": "recharge",
          "u": 0.88,
          "v": 0.72,
          "worldX": 2252,
          "worldY": 1422,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "outpost-seat-hub-a",
          "type": "restSeat",
          "u": 0.18,
          "v": 0.8,
          "worldX": 1622,
          "worldY": 1476,
          "worldFootprint": {
            "width": 80,
            "height": 72
          }
        },
        {
          "id": "outpost-seat-hub-b",
          "type": "restSeat",
          "u": 0.84,
          "v": 0.8,
          "worldX": 2216,
          "worldY": 1476,
          "worldFootprint": {
            "width": 80,
            "height": 72
          }
        },
        {
          "id": "outpost-plant-hub",
          "type": "airPlant",
          "u": 0.14,
          "v": 0.16,
          "worldX": 1586,
          "worldY": 1047,
          "worldFootprint": {
            "width": 72,
            "height": 84
          }
        },
        {
          "id": "outpost-water-hub",
          "type": "hydration",
          "u": 0.82,
          "v": 0.12,
          "worldX": 2198,
          "worldY": 1020,
          "worldFootprint": {
            "width": 72,
            "height": 84
          }
        },
        {
          "id": "outpost-hub-conference-table-1",
          "type": "conferenceTable",
          "u": 0.5,
          "v": 0.53,
          "worldX": 1910,
          "worldY": 1295,
          "worldFootprint": {
            "width": 144,
            "height": 92
          }
        },
        {
          "id": "outpost-hub-sofa-2",
          "type": "sofa",
          "u": 0.12,
          "v": 0.8,
          "worldX": 1568,
          "worldY": 1476,
          "worldFootprint": {
            "width": 144,
            "height": 92
          }
        },
        {
          "id": "outpost-hub-sofa-3",
          "type": "sofa",
          "u": 0.86,
          "v": 0.8,
          "worldX": 2234,
          "worldY": 1476,
          "worldFootprint": {
            "width": 144,
            "height": 92
          }
        },
        {
          "id": "outpost-hub-holo-projector-4",
          "type": "holoProjector",
          "u": 0.5,
          "v": 0.53,
          "worldX": 1910,
          "worldY": 1295,
          "worldFootprint": {
            "width": 96,
            "height": 68
          }
        },
        {
          "id": "outpost-hub-wall-display-5",
          "type": "wallDisplay",
          "u": 0.75,
          "v": 0.12,
          "worldX": 2135,
          "worldY": 1020,
          "worldFootprint": {
            "width": 96,
            "height": 68
          }
        },
        {
          "id": "outpost-hub-nutrition-station-6",
          "type": "nutritionStation",
          "u": 0.82,
          "v": 0.12,
          "worldX": 2198,
          "worldY": 1020,
          "worldFootprint": {
            "width": 112,
            "height": 96
          }
        },
        {
          "id": "outpost-hub-hydration-7",
          "type": "hydration",
          "u": 0.88,
          "v": 0.12,
          "worldX": 2252,
          "worldY": 1020,
          "worldFootprint": {
            "width": 72,
            "height": 84
          }
        },
        {
          "id": "outpost-hub-recycling-unit-8",
          "type": "recyclingUnit",
          "u": 0.82,
          "v": 0.72,
          "worldX": 2198,
          "worldY": 1422,
          "worldFootprint": {
            "width": 112,
            "height": 96
          }
        }
      ],
      "labs": [
        {
          "id": "download-o-a",
          "type": "task",
          "u": 0.19,
          "v": 0.14,
          "worldX": 339,
          "worldY": 250,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "download-o-c",
          "type": "task",
          "u": 0.32,
          "v": 0.14,
          "worldX": 461,
          "worldY": 250,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "repair-oxygen-b",
          "type": "repair",
          "u": 0.55,
          "v": 0.14,
          "worldX": 677,
          "worldY": 250,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "vitals",
          "type": "utility",
          "u": 0.72,
          "v": 0.72,
          "worldX": 837,
          "worldY": 621,
          "worldFootprint": {
            "width": 80,
            "height": 72
          }
        },
        {
          "id": "outpost-medpod",
          "type": "medPod",
          "u": 0.76,
          "v": 0.72,
          "worldX": 874,
          "worldY": 621,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "outpost-plant-labs",
          "type": "airPlant",
          "u": 0.15,
          "v": 0.87,
          "worldX": 301,
          "worldY": 717,
          "worldFootprint": {
            "width": 72,
            "height": 84
          }
        },
        {
          "id": "outpost-desk-labs",
          "type": "commandDesk",
          "u": 0.45,
          "v": 0.14,
          "worldX": 583,
          "worldY": 250,
          "worldFootprint": {
            "width": 112,
            "height": 96
          }
        },
        {
          "id": "outpost-labs-diagnostic-bed-1",
          "type": "diagnosticBed",
          "u": 0.67,
          "v": 0.72,
          "worldX": 790,
          "worldY": 621,
          "worldFootprint": {
            "width": 144,
            "height": 92
          }
        },
        {
          "id": "outpost-labs-medical-cabinet-2",
          "type": "medicalCabinet",
          "u": 0.88,
          "v": 0.7,
          "worldX": 987,
          "worldY": 608,
          "worldFootprint": {
            "width": 112,
            "height": 96
          }
        },
        {
          "id": "outpost-labs-sterilizer-3",
          "type": "sterilizer",
          "u": 0.08,
          "v": 0.32,
          "worldX": 235,
          "worldY": 365,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "outpost-labs-specimen-case-4",
          "type": "specimenCase",
          "u": 0.22,
          "v": 0.88,
          "worldX": 367,
          "worldY": 723,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        },
        {
          "id": "outpost-labs-mineral-scanner-5",
          "type": "mineralScanner",
          "u": 0.3,
          "v": 0.88,
          "worldX": 442,
          "worldY": 723,
          "worldFootprint": {
            "width": 96,
            "height": 68
          }
        },
        {
          "id": "outpost-labs-server-rack-6",
          "type": "serverRack",
          "u": 0.7,
          "v": 0.14,
          "worldX": 818,
          "worldY": 250,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "outpost-labs-emergency-kit-7",
          "type": "emergencyKit",
          "u": 0.63,
          "v": 0.88,
          "worldX": 752,
          "worldY": 723,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        },
        {
          "id": "outpost-labs-mist-sprayer-8",
          "type": "mistSprayer",
          "u": 0.55,
          "v": 0.88,
          "worldX": 677,
          "worldY": 723,
          "worldFootprint": {
            "width": 72,
            "height": 84
          }
        }
      ],
      "power": [
        {
          "id": "download-o-b",
          "type": "task",
          "u": 0.45,
          "v": 0.88,
          "worldX": 640,
          "worldY": 2186,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "upload-o-e",
          "type": "task",
          "u": 0.79,
          "v": 0.78,
          "worldX": 980,
          "worldY": 2116,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "outpost-decoy",
          "type": "decoy",
          "u": 0.57,
          "v": 0.86,
          "worldX": 760,
          "worldY": 2172,
          "worldFootprint": {
            "width": 112,
            "height": 76
          }
        },
        {
          "id": "outpost-desk-power",
          "type": "commandDesk",
          "u": 0.45,
          "v": 0.87,
          "worldX": 640,
          "worldY": 2179,
          "worldFootprint": {
            "width": 112,
            "height": 96
          }
        },
        {
          "id": "outpost-locker-power",
          "type": "equipmentLocker",
          "u": 0.1,
          "v": 0.8,
          "worldX": 290,
          "worldY": 2130,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "outpost-power-reactor-gauge-1",
          "type": "reactorGauge",
          "u": 0.42,
          "v": 0.14,
          "worldX": 610,
          "worldY": 1668,
          "worldFootprint": {
            "width": 96,
            "height": 68
          }
        },
        {
          "id": "outpost-power-cooling-unit-2",
          "type": "coolingUnit",
          "u": 0.25,
          "v": 0.14,
          "worldX": 440,
          "worldY": 1668,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "outpost-power-power-cabinet-3",
          "type": "powerCabinet",
          "u": 0.71,
          "v": 0.14,
          "worldX": 900,
          "worldY": 1668,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "outpost-power-server-rack-4",
          "type": "serverRack",
          "u": 0.1,
          "v": 0.85,
          "worldX": 290,
          "worldY": 2165,
          "worldFootprint": {
            "width": 104,
            "height": 132
          }
        },
        {
          "id": "outpost-power-cable-spool-5",
          "type": "cableSpool",
          "u": 0.15,
          "v": 0.55,
          "worldX": 340,
          "worldY": 1955,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        },
        {
          "id": "outpost-power-tool-cart-6",
          "type": "toolCart",
          "u": 0.3,
          "v": 0.7,
          "worldX": 490,
          "worldY": 2060,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        },
        {
          "id": "outpost-power-workbench-7",
          "type": "workbench",
          "u": 0.15,
          "v": 0.66,
          "worldX": 340,
          "worldY": 2032,
          "worldFootprint": {
            "width": 144,
            "height": 92
          }
        },
        {
          "id": "outpost-power-emergency-kit-8",
          "type": "emergencyKit",
          "u": 0.64,
          "v": 0.86,
          "worldX": 830,
          "worldY": 2172,
          "worldFootprint": {
            "width": 58,
            "height": 58
          }
        }
      ]
    }
  },
  "objectFootprints": {
    "airPlant": {
      "width": 72,
      "height": 84
    },
    "antennaArray": {
      "width": 96,
      "height": 68
    },
    "archiveCabinet": {
      "width": 104,
      "height": 132
    },
    "bookshelf": {
      "width": 104,
      "height": 132
    },
    "cableSpool": {
      "width": 58,
      "height": 58
    },
    "cameraTripod": {
      "width": 58,
      "height": 58
    },
    "cargoCrate": {
      "width": 144,
      "height": 92
    },
    "commandDesk": {
      "width": 112,
      "height": 96
    },
    "compostUnit": {
      "width": 112,
      "height": 96
    },
    "conferenceTable": {
      "width": 144,
      "height": 92
    },
    "coolingUnit": {
      "width": 104,
      "height": 132
    },
    "decoy": {
      "width": 112,
      "height": 76
    },
    "diagnosticBed": {
      "width": 144,
      "height": 92
    },
    "emergencyKit": {
      "width": 58,
      "height": 58
    },
    "equipmentLocker": {
      "width": 104,
      "height": 132
    },
    "greenhousePlanter": {
      "width": 144,
      "height": 92
    },
    "holoProjector": {
      "width": 96,
      "height": 68
    },
    "hydration": {
      "width": 72,
      "height": 84
    },
    "medPod": {
      "width": 112,
      "height": 76
    },
    "medicalCabinet": {
      "width": 112,
      "height": 96
    },
    "mineralScanner": {
      "width": 96,
      "height": 68
    },
    "mistSprayer": {
      "width": 72,
      "height": 84
    },
    "nutritionStation": {
      "width": 112,
      "height": 96
    },
    "palletJack": {
      "width": 58,
      "height": 58
    },
    "powerCabinet": {
      "width": 104,
      "height": 132
    },
    "radioConsole": {
      "width": 96,
      "height": 68
    },
    "reactorGauge": {
      "width": 96,
      "height": 68
    },
    "readingLamp": {
      "width": 58,
      "height": 58
    },
    "recharge": {
      "width": 112,
      "height": 76
    },
    "recyclingUnit": {
      "width": 112,
      "height": 96
    },
    "restSeat": {
      "width": 80,
      "height": 72
    },
    "securityConsole": {
      "width": 112,
      "height": 96
    },
    "serverRack": {
      "width": 104,
      "height": 132
    },
    "sofa": {
      "width": 144,
      "height": 92
    },
    "specimenCase": {
      "width": 58,
      "height": 58
    },
    "sterilizer": {
      "width": 104,
      "height": 132
    },
    "supply": {
      "width": 112,
      "height": 76
    },
    "toolCart": {
      "width": 58,
      "height": 58
    },
    "wallDisplay": {
      "width": 96,
      "height": 68
    },
    "workbench": {
      "width": 144,
      "height": 92
    }
  },
  "portals": {
    "station": [
      {
        "id": "portal-archive-c1",
        "doorId": "door-archive",
        "orientation": "vertical",
        "worldBoundary": 1020,
        "worldOpeningSpan": 140,
        "worldOpeningRect": {
          "x": 992,
          "y": 410,
          "w": 56,
          "h": 140
        },
        "roomId": "archive",
        "corridorId": "c1"
      },
      {
        "id": "portal-comms-c12",
        "doorId": "",
        "orientation": "horizontal",
        "worldBoundary": 1740,
        "worldOpeningSpan": 168,
        "worldOpeningRect": {
          "x": 3231,
          "y": 1712,
          "w": 168,
          "h": 56
        },
        "roomId": "comms",
        "corridorId": "c12"
      },
      {
        "id": "portal-comms-c7",
        "doorId": "door-comms",
        "orientation": "vertical",
        "worldBoundary": 2750,
        "worldOpeningSpan": 164,
        "worldOpeningRect": {
          "x": 2722,
          "y": 1913,
          "w": 56,
          "h": 164
        },
        "roomId": "comms",
        "corridorId": "c7"
      },
      {
        "id": "portal-electrical-c5",
        "doorId": "",
        "orientation": "vertical",
        "worldBoundary": 1110,
        "worldOpeningSpan": 168,
        "worldOpeningRect": {
          "x": 1082,
          "y": 1991,
          "w": 56,
          "h": 168
        },
        "roomId": "electrical",
        "corridorId": "c5"
      },
      {
        "id": "portal-electrical-c9",
        "doorId": "door-electrical",
        "orientation": "horizontal",
        "worldBoundary": 1670,
        "worldOpeningSpan": 180,
        "worldOpeningRect": {
          "x": 655,
          "y": 1642,
          "w": 180,
          "h": 56
        },
        "roomId": "electrical",
        "corridorId": "c9"
      },
      {
        "id": "portal-engine-c11",
        "doorId": "",
        "orientation": "horizontal",
        "worldBoundary": 1050,
        "worldOpeningSpan": 168,
        "worldOpeningRect": {
          "x": 3396,
          "y": 1022,
          "w": 168,
          "h": 56
        },
        "roomId": "engine",
        "corridorId": "c11"
      },
      {
        "id": "portal-engine-c12",
        "doorId": "",
        "orientation": "horizontal",
        "worldBoundary": 1570,
        "worldOpeningSpan": 168,
        "worldOpeningRect": {
          "x": 3231,
          "y": 1542,
          "w": 168,
          "h": 56
        },
        "roomId": "engine",
        "corridorId": "c12"
      },
      {
        "id": "portal-engine-c13b",
        "doorId": "",
        "orientation": "vertical",
        "worldBoundary": 3000,
        "worldOpeningSpan": 146,
        "worldOpeningRect": {
          "x": 2972,
          "y": 1062,
          "w": 56,
          "h": 146
        },
        "roomId": "engine",
        "corridorId": "c13b"
      },
      {
        "id": "portal-engine-c6",
        "doorId": "",
        "orientation": "vertical",
        "worldBoundary": 3000,
        "worldOpeningSpan": 168,
        "worldOpeningRect": {
          "x": 2972,
          "y": 1316,
          "w": 56,
          "h": 168
        },
        "roomId": "engine",
        "corridorId": "c6"
      },
      {
        "id": "portal-med-c4",
        "doorId": "",
        "orientation": "horizontal",
        "worldBoundary": 2000,
        "worldOpeningSpan": 126,
        "worldOpeningRect": {
          "x": 1982,
          "y": 1972,
          "w": 126,
          "h": 56
        },
        "roomId": "med",
        "corridorId": "c4"
      },
      {
        "id": "portal-med-c5",
        "doorId": "",
        "orientation": "vertical",
        "worldBoundary": 1380,
        "worldOpeningSpan": 166,
        "worldOpeningRect": {
          "x": 1352,
          "y": 2012,
          "w": 56,
          "h": 166
        },
        "roomId": "med",
        "corridorId": "c5"
      },
      {
        "id": "portal-meeting-c13a",
        "doorId": "",
        "orientation": "horizontal",
        "worldBoundary": 1050,
        "worldOpeningSpan": 168,
        "worldOpeningRect": {
          "x": 2366,
          "y": 1022,
          "w": 168,
          "h": 56
        },
        "roomId": "meeting",
        "corridorId": "c13a"
      },
      {
        "id": "portal-meeting-c13b",
        "doorId": "",
        "orientation": "vertical",
        "worldBoundary": 2560,
        "worldOpeningSpan": 146,
        "worldOpeningRect": {
          "x": 2532,
          "y": 1062,
          "w": 56,
          "h": 146
        },
        "roomId": "meeting",
        "corridorId": "c13b"
      },
      {
        "id": "portal-meeting-c3",
        "doorId": "",
        "orientation": "horizontal",
        "worldBoundary": 1050,
        "worldOpeningSpan": 168,
        "worldOpeningRect": {
          "x": 2011,
          "y": 1022,
          "w": 168,
          "h": 56
        },
        "roomId": "meeting",
        "corridorId": "c3"
      },
      {
        "id": "portal-meeting-c4",
        "doorId": "",
        "orientation": "horizontal",
        "worldBoundary": 1750,
        "worldOpeningSpan": 168,
        "worldOpeningRect": {
          "x": 2011,
          "y": 1722,
          "w": 168,
          "h": 56
        },
        "roomId": "meeting",
        "corridorId": "c4"
      },
      {
        "id": "portal-meeting-c6",
        "doorId": "",
        "orientation": "vertical",
        "worldBoundary": 2560,
        "worldOpeningSpan": 168,
        "worldOpeningRect": {
          "x": 2532,
          "y": 1316,
          "w": 56,
          "h": 168
        },
        "roomId": "meeting",
        "corridorId": "c6"
      },
      {
        "id": "portal-meeting-c8e",
        "doorId": "",
        "orientation": "vertical",
        "worldBoundary": 1620,
        "worldOpeningSpan": 168,
        "worldOpeningRect": {
          "x": 1592,
          "y": 1256,
          "w": 56,
          "h": 168
        },
        "roomId": "meeting",
        "corridorId": "c8e"
      },
      {
        "id": "portal-reactor-c11",
        "doorId": "",
        "orientation": "horizontal",
        "worldBoundary": 840,
        "worldOpeningSpan": 168,
        "worldOpeningRect": {
          "x": 3396,
          "y": 812,
          "w": 168,
          "h": 56
        },
        "roomId": "reactor",
        "corridorId": "c11"
      },
      {
        "id": "portal-reactor-c2",
        "doorId": "door-reactor",
        "orientation": "vertical",
        "worldBoundary": 2740,
        "worldOpeningSpan": 156,
        "worldOpeningRect": {
          "x": 2712,
          "y": 402,
          "w": 56,
          "h": 156
        },
        "roomId": "reactor",
        "corridorId": "c2"
      },
      {
        "id": "portal-security-c1",
        "doorId": "",
        "orientation": "vertical",
        "worldBoundary": 1410,
        "worldOpeningSpan": 168,
        "worldOpeningRect": {
          "x": 1382,
          "y": 396,
          "w": 56,
          "h": 168
        },
        "roomId": "security",
        "corridorId": "c1"
      },
      {
        "id": "portal-security-c2",
        "doorId": "",
        "orientation": "vertical",
        "worldBoundary": 2130,
        "worldOpeningSpan": 168,
        "worldOpeningRect": {
          "x": 2102,
          "y": 396,
          "w": 56,
          "h": 168
        },
        "roomId": "security",
        "corridorId": "c2"
      },
      {
        "id": "portal-security-c3",
        "doorId": "",
        "orientation": "horizontal",
        "worldBoundary": 720,
        "worldOpeningSpan": 136,
        "worldOpeningRect": {
          "x": 1982,
          "y": 692,
          "w": 136,
          "h": 56
        },
        "roomId": "security",
        "corridorId": "c3"
      },
      {
        "id": "portal-storage-c8e",
        "doorId": "",
        "orientation": "vertical",
        "worldBoundary": 1440,
        "worldOpeningSpan": 168,
        "worldOpeningRect": {
          "x": 1412,
          "y": 1256,
          "w": 56,
          "h": 168
        },
        "roomId": "storage",
        "corridorId": "c8e"
      },
      {
        "id": "portal-storage-c8w",
        "doorId": "",
        "orientation": "vertical",
        "worldBoundary": 1040,
        "worldOpeningSpan": 168,
        "worldOpeningRect": {
          "x": 1012,
          "y": 1256,
          "w": 56,
          "h": 168
        },
        "roomId": "storage",
        "corridorId": "c8w"
      }
    ],
    "outpost": [
      {
        "id": "portal-drill-o2",
        "doorId": "door-drill",
        "orientation": "vertical",
        "worldBoundary": 2640,
        "worldOpeningSpan": 132,
        "worldOpeningRect": {
          "x": 2612,
          "y": 454,
          "w": 56,
          "h": 132
        },
        "roomId": "drill",
        "corridorId": "o2"
      },
      {
        "id": "portal-greenhouse-o8",
        "doorId": "door-garden",
        "orientation": "horizontal",
        "worldBoundary": 1580,
        "worldOpeningSpan": 144,
        "worldOpeningRect": {
          "x": 2828,
          "y": 1552,
          "w": 144,
          "h": 56
        },
        "roomId": "greenhouse",
        "corridorId": "o8"
      },
      {
        "id": "portal-hub-o3",
        "doorId": "",
        "orientation": "horizontal",
        "worldBoundary": 940,
        "worldOpeningSpan": 168,
        "worldOpeningRect": {
          "x": 1841,
          "y": 912,
          "w": 168,
          "h": 56
        },
        "roomId": "hub",
        "corridorId": "o3"
      },
      {
        "id": "portal-hub-o4",
        "doorId": "",
        "orientation": "vertical",
        "worldBoundary": 1460,
        "worldOpeningSpan": 168,
        "worldOpeningRect": {
          "x": 1432,
          "y": 1206,
          "w": 56,
          "h": 168
        },
        "roomId": "hub",
        "corridorId": "o4"
      },
      {
        "id": "portal-hub-o5",
        "doorId": "",
        "orientation": "vertical",
        "worldBoundary": 2360,
        "worldOpeningSpan": 168,
        "worldOpeningRect": {
          "x": 2332,
          "y": 1226,
          "w": 56,
          "h": 168
        },
        "roomId": "hub",
        "corridorId": "o5"
      },
      {
        "id": "portal-hub-o6",
        "doorId": "",
        "orientation": "horizontal",
        "worldBoundary": 1610,
        "worldOpeningSpan": 168,
        "worldOpeningRect": {
          "x": 1836,
          "y": 1582,
          "w": 168,
          "h": 56
        },
        "roomId": "hub",
        "corridorId": "o6"
      },
      {
        "id": "portal-labs-o1",
        "doorId": "door-labs",
        "orientation": "vertical",
        "worldBoundary": 1100,
        "worldOpeningSpan": 136,
        "worldOpeningRect": {
          "x": 1072,
          "y": 442,
          "w": 56,
          "h": 136
        },
        "roomId": "labs",
        "corridorId": "o1"
      },
      {
        "id": "portal-power-o7",
        "doorId": "door-power",
        "orientation": "horizontal",
        "worldBoundary": 1570,
        "worldOpeningSpan": 156,
        "worldOpeningRect": {
          "x": 857,
          "y": 1542,
          "w": 156,
          "h": 56
        },
        "roomId": "power",
        "corridorId": "o7"
      }
    ]
  }
});
const ADVANCED_STATION_MAP = Object.freeze({
  "schema": "dva.authored-map.v302",
  "authoredGeometry": true,
  "id": "station",
  "label": "アウレリア自然共生館",
  "width": 4800,
  "height": 3400,
  "playerRadius": 32,
  "speed": 460,
  "ghostSpeed": 560,
  "reportRange": 172,
  "taskRange": 220,
  "ventRange": 0,
  "spawns": [
    {
      "x": 2422,
      "y": 1561,
      "room": "atrium"
    },
    {
      "x": 2500,
      "y": 1561,
      "room": "atrium"
    },
    {
      "x": 2578,
      "y": 1561,
      "room": "atrium"
    },
    {
      "x": 2422,
      "y": 1665,
      "room": "atrium"
    },
    {
      "x": 2500,
      "y": 1665,
      "room": "atrium"
    },
    {
      "x": 2578,
      "y": 1665,
      "room": "atrium"
    },
    {
      "x": 2461,
      "y": 1769,
      "room": "atrium"
    },
    {
      "x": 2539,
      "y": 1769,
      "room": "atrium"
    },
    {
      "x": 2370,
      "y": 1704,
      "room": "atrium"
    },
    {
      "x": 2630,
      "y": 1704,
      "room": "atrium"
    }
  ],
  "rooms": [
    {
      "x": 80,
      "y": 180,
      "w": 1100,
      "h": 660,
      "id": "archive",
      "label": "木洩れ日の記録院",
      "polygon": [
        [
          80,
          260
        ],
        [
          150,
          180
        ],
        [
          1100,
          180
        ],
        [
          1180,
          260
        ],
        [
          1180,
          760
        ],
        [
          1100,
          840
        ],
        [
          150,
          840
        ],
        [
          80,
          760
        ]
      ]
    },
    {
      "x": 1300,
      "y": 520,
      "w": 660,
      "h": 610,
      "id": "security",
      "label": "静謐の協議室",
      "polygon": [
        [
          1380,
          520
        ],
        [
          1880,
          520
        ],
        [
          1960,
          600
        ],
        [
          1960,
          1050
        ],
        [
          1880,
          1130
        ],
        [
          1380,
          1130
        ],
        [
          1300,
          1050
        ],
        [
          1300,
          600
        ]
      ]
    },
    {
      "x": 2000,
      "y": 140,
      "w": 1000,
      "h": 680,
      "id": "observatory",
      "label": "星見の間",
      "polygon": [
        [
          2000,
          220
        ],
        [
          2080,
          140
        ],
        [
          2900,
          140
        ],
        [
          3000,
          240
        ],
        [
          3000,
          720
        ],
        [
          2900,
          820
        ],
        [
          2080,
          820
        ],
        [
          2000,
          740
        ]
      ]
    },
    {
      "x": 3400,
      "y": 150,
      "w": 1300,
      "h": 850,
      "id": "reactor",
      "label": "水鏡の庭",
      "polygon": [
        [
          3500,
          150
        ],
        [
          4600,
          150
        ],
        [
          4700,
          250
        ],
        [
          4700,
          900
        ],
        [
          4600,
          1000
        ],
        [
          3500,
          1000
        ],
        [
          3400,
          900
        ],
        [
          3400,
          250
        ]
      ]
    },
    {
      "x": 40,
      "y": 1250,
      "w": 1040,
      "h": 900,
      "id": "power",
      "label": "灯りの休息庭",
      "polygon": [
        [
          40,
          1350
        ],
        [
          140,
          1250
        ],
        [
          980,
          1250
        ],
        [
          1080,
          1350
        ],
        [
          1080,
          2050
        ],
        [
          980,
          2150
        ],
        [
          140,
          2150
        ],
        [
          40,
          2050
        ]
      ]
    },
    {
      "x": 1030,
      "y": 1500,
      "w": 750,
      "h": 700,
      "id": "storage",
      "label": "暮らしの収納室",
      "polygon": [
        [
          1100,
          1500
        ],
        [
          1700,
          1500
        ],
        [
          1780,
          1580
        ],
        [
          1780,
          2120
        ],
        [
          1700,
          2200
        ],
        [
          1100,
          2200
        ],
        [
          1030,
          2130
        ],
        [
          1030,
          1570
        ]
      ]
    },
    {
      "x": 1850,
      "y": 950,
      "w": 1300,
      "h": 1300,
      "id": "atrium",
      "label": "陽だまりの中庭",
      "polygon": [
        [
          1850,
          1200
        ],
        [
          2120,
          950
        ],
        [
          2820,
          950
        ],
        [
          3150,
          1200
        ],
        [
          3150,
          2020
        ],
        [
          2850,
          2250
        ],
        [
          2120,
          2250
        ],
        [
          1850,
          2030
        ]
      ]
    },
    {
      "x": 3320,
      "y": 1120,
      "w": 1300,
      "h": 700,
      "id": "engineering",
      "label": "木工房",
      "polygon": [
        [
          3320,
          1200
        ],
        [
          3420,
          1120
        ],
        [
          4520,
          1120
        ],
        [
          4620,
          1220
        ],
        [
          4620,
          1720
        ],
        [
          4520,
          1820
        ],
        [
          3420,
          1820
        ],
        [
          3320,
          1720
        ]
      ]
    },
    {
      "x": 3350,
      "y": 1900,
      "w": 1270,
      "h": 720,
      "id": "fabrication",
      "label": "手仕事の工房",
      "polygon": [
        [
          3350,
          1980
        ],
        [
          3450,
          1900
        ],
        [
          4520,
          1900
        ],
        [
          4620,
          2000
        ],
        [
          4620,
          2520
        ],
        [
          4520,
          2620
        ],
        [
          3450,
          2620
        ],
        [
          3350,
          2520
        ]
      ]
    },
    {
      "x": 80,
      "y": 2400,
      "w": 970,
      "h": 900,
      "id": "greenhouse",
      "label": "実りの温室",
      "polygon": [
        [
          80,
          2500
        ],
        [
          180,
          2400
        ],
        [
          950,
          2400
        ],
        [
          1050,
          2500
        ],
        [
          1050,
          3200
        ],
        [
          950,
          3300
        ],
        [
          180,
          3300
        ],
        [
          80,
          3200
        ]
      ]
    },
    {
      "x": 1120,
      "y": 2420,
      "w": 930,
      "h": 860,
      "id": "cafeteria",
      "label": "実りの食堂",
      "polygon": [
        [
          1120,
          2500
        ],
        [
          1220,
          2420
        ],
        [
          1950,
          2420
        ],
        [
          2050,
          2520
        ],
        [
          2050,
          3180
        ],
        [
          1950,
          3280
        ],
        [
          1220,
          3280
        ],
        [
          1120,
          3180
        ]
      ]
    },
    {
      "x": 2200,
      "y": 2520,
      "w": 950,
      "h": 780,
      "id": "medical",
      "label": "源泉の湯治処",
      "polygon": [
        [
          2200,
          2600
        ],
        [
          2300,
          2520
        ],
        [
          3050,
          2520
        ],
        [
          3150,
          2620
        ],
        [
          3150,
          3200
        ],
        [
          3050,
          3300
        ],
        [
          2300,
          3300
        ],
        [
          2200,
          3200
        ]
      ]
    },
    {
      "x": 3480,
      "y": 2720,
      "w": 1140,
      "h": 580,
      "id": "comms",
      "label": "便りの間",
      "polygon": [
        [
          3480,
          2800
        ],
        [
          3580,
          2720
        ],
        [
          4520,
          2720
        ],
        [
          4620,
          2820
        ],
        [
          4620,
          3220
        ],
        [
          4520,
          3300
        ],
        [
          3580,
          3300
        ],
        [
          3480,
          3220
        ]
      ]
    }
  ],
  "corridors": [
    {
      "x": 1180,
      "y": 650,
      "w": 200,
      "h": 180,
      "id": "a01",
      "polygon": [
        [
          1180,
          650
        ],
        [
          1380,
          650
        ],
        [
          1380,
          830
        ],
        [
          1180,
          830
        ]
      ],
      "renderSegments": [
        {
          "x": 1180,
          "y": 650,
          "w": 200,
          "h": 180,
          "polygon": [
            [
              1180,
              650
            ],
            [
              1380,
              650
            ],
            [
              1380,
              830
            ],
            [
              1180,
              830
            ]
          ]
        }
      ]
    },
    {
      "x": 450,
      "y": 840,
      "w": 200,
      "h": 410,
      "id": "a02",
      "polygon": [
        [
          450,
          840
        ],
        [
          650,
          840
        ],
        [
          650,
          1250
        ],
        [
          450,
          1250
        ]
      ],
      "renderSegments": [
        {
          "x": 450,
          "y": 840,
          "w": 200,
          "h": 410,
          "polygon": [
            [
              450,
              840
            ],
            [
              650,
              840
            ],
            [
              650,
              1250
            ],
            [
              450,
              1250
            ]
          ]
        }
      ]
    },
    {
      "x": 1880,
      "y": 610,
      "w": 200,
      "h": 180,
      "id": "a03",
      "polygon": [
        [
          1880,
          610
        ],
        [
          2080,
          610
        ],
        [
          2080,
          790
        ],
        [
          1880,
          790
        ]
      ],
      "renderSegments": [
        {
          "x": 1880,
          "y": 610,
          "w": 200,
          "h": 180,
          "polygon": [
            [
              1880,
              610
            ],
            [
              2080,
              610
            ],
            [
              2080,
              790
            ],
            [
              1880,
              790
            ]
          ]
        }
      ]
    },
    {
      "x": 3000,
      "y": 500,
      "w": 400,
      "h": 180,
      "id": "a04",
      "polygon": [
        [
          3000,
          500
        ],
        [
          3400,
          500
        ],
        [
          3400,
          680
        ],
        [
          3000,
          680
        ]
      ],
      "renderSegments": [
        {
          "x": 3000,
          "y": 500,
          "w": 400,
          "h": 180,
          "polygon": [
            [
              3000,
              500
            ],
            [
              3400,
              500
            ],
            [
              3400,
              680
            ],
            [
              3000,
              680
            ]
          ]
        }
      ]
    },
    {
      "x": 2380,
      "y": 820,
      "w": 220,
      "h": 260,
      "id": "a05",
      "polygon": [
        [
          2380,
          820
        ],
        [
          2600,
          820
        ],
        [
          2600,
          1080
        ],
        [
          2380,
          1080
        ]
      ],
      "renderSegments": [
        {
          "x": 2380,
          "y": 820,
          "w": 220,
          "h": 260,
          "polygon": [
            [
              2380,
              820
            ],
            [
              2600,
              820
            ],
            [
              2600,
              1080
            ],
            [
              2380,
              1080
            ]
          ]
        }
      ]
    },
    {
      "x": 1780,
      "y": 960,
      "w": 220,
      "h": 420,
      "id": "a06",
      "polygon": [
        [
          1780,
          960
        ],
        [
          2000,
          960
        ],
        [
          2000,
          1380
        ],
        [
          1780,
          1380
        ]
      ],
      "renderSegments": [
        {
          "x": 1780,
          "y": 960,
          "w": 220,
          "h": 420,
          "polygon": [
            [
              1780,
              960
            ],
            [
              2000,
              960
            ],
            [
              2000,
              1380
            ],
            [
              1780,
              1380
            ]
          ]
        }
      ]
    },
    {
      "x": 3150,
      "y": 1400,
      "w": 170,
      "h": 190,
      "id": "a07",
      "polygon": [
        [
          3150,
          1400
        ],
        [
          3320,
          1400
        ],
        [
          3320,
          1590
        ],
        [
          3150,
          1590
        ]
      ],
      "renderSegments": [
        {
          "x": 3150,
          "y": 1400,
          "w": 170,
          "h": 190,
          "polygon": [
            [
              3150,
              1400
            ],
            [
              3320,
              1400
            ],
            [
              3320,
              1590
            ],
            [
              3150,
              1590
            ]
          ]
        }
      ]
    },
    {
      "x": 3150,
      "y": 1960,
      "w": 200,
      "h": 180,
      "id": "a08",
      "polygon": [
        [
          3150,
          1960
        ],
        [
          3350,
          1960
        ],
        [
          3350,
          2140
        ],
        [
          3150,
          2140
        ]
      ],
      "renderSegments": [
        {
          "x": 3150,
          "y": 1960,
          "w": 200,
          "h": 180,
          "polygon": [
            [
              3150,
              1960
            ],
            [
              3350,
              1960
            ],
            [
              3350,
              2140
            ],
            [
              3150,
              2140
            ]
          ]
        }
      ]
    },
    {
      "x": 3900,
      "y": 1000,
      "w": 220,
      "h": 120,
      "id": "a09",
      "polygon": [
        [
          3900,
          1000
        ],
        [
          4120,
          1000
        ],
        [
          4120,
          1120
        ],
        [
          3900,
          1120
        ]
      ],
      "renderSegments": [
        {
          "x": 3900,
          "y": 1000,
          "w": 220,
          "h": 120,
          "polygon": [
            [
              3900,
              1000
            ],
            [
              4120,
              1000
            ],
            [
              4120,
              1120
            ],
            [
              3900,
              1120
            ]
          ]
        }
      ]
    },
    {
      "x": 3900,
      "y": 1820,
      "w": 220,
      "h": 80,
      "id": "a10",
      "polygon": [
        [
          3900,
          1820
        ],
        [
          4120,
          1820
        ],
        [
          4120,
          1900
        ],
        [
          3900,
          1900
        ]
      ],
      "renderSegments": [
        {
          "x": 3900,
          "y": 1820,
          "w": 220,
          "h": 80,
          "polygon": [
            [
              3900,
              1820
            ],
            [
              4120,
              1820
            ],
            [
              4120,
              1900
            ],
            [
              3900,
              1900
            ]
          ]
        }
      ]
    },
    {
      "x": 3900,
      "y": 2620,
      "w": 220,
      "h": 100,
      "id": "a11",
      "polygon": [
        [
          3900,
          2620
        ],
        [
          4120,
          2620
        ],
        [
          4120,
          2720
        ],
        [
          3900,
          2720
        ]
      ],
      "renderSegments": [
        {
          "x": 3900,
          "y": 2620,
          "w": 220,
          "h": 100,
          "polygon": [
            [
              3900,
              2620
            ],
            [
              4120,
              2620
            ],
            [
              4120,
              2720
            ],
            [
              3900,
              2720
            ]
          ]
        }
      ]
    },
    {
      "x": 2400,
      "y": 2250,
      "w": 220,
      "h": 270,
      "id": "a12",
      "polygon": [
        [
          2400,
          2250
        ],
        [
          2620,
          2250
        ],
        [
          2620,
          2520
        ],
        [
          2400,
          2520
        ]
      ],
      "renderSegments": [
        {
          "x": 2400,
          "y": 2250,
          "w": 220,
          "h": 270,
          "polygon": [
            [
              2400,
              2250
            ],
            [
              2620,
              2250
            ],
            [
              2620,
              2520
            ],
            [
              2400,
              2520
            ]
          ]
        }
      ]
    },
    {
      "x": 1650,
      "y": 2010,
      "w": 300,
      "h": 490,
      "id": "a13",
      "polygon": [
        [
          1750,
          2010
        ],
        [
          1950,
          2010
        ],
        [
          1950,
          2250
        ],
        [
          1830,
          2250
        ],
        [
          1830,
          2500
        ],
        [
          1650,
          2500
        ],
        [
          1650,
          2200
        ],
        [
          1750,
          2200
        ]
      ],
      "renderSegments": [
        {
          "x": 1650,
          "y": 2010,
          "w": 300,
          "h": 490,
          "polygon": [
            [
              1750,
              2010
            ],
            [
              1950,
              2010
            ],
            [
              1950,
              2250
            ],
            [
              1830,
              2250
            ],
            [
              1830,
              2500
            ],
            [
              1650,
              2500
            ],
            [
              1650,
              2200
            ],
            [
              1750,
              2200
            ]
          ]
        }
      ]
    },
    {
      "x": 950,
      "y": 2780,
      "w": 170,
      "h": 190,
      "id": "a14",
      "polygon": [
        [
          950,
          2780
        ],
        [
          1120,
          2780
        ],
        [
          1120,
          2970
        ],
        [
          950,
          2970
        ]
      ],
      "renderSegments": [
        {
          "x": 950,
          "y": 2780,
          "w": 170,
          "h": 190,
          "polygon": [
            [
              950,
              2780
            ],
            [
              1120,
              2780
            ],
            [
              1120,
              2970
            ],
            [
              950,
              2970
            ]
          ]
        }
      ]
    },
    {
      "x": 980,
      "y": 1660,
      "w": 120,
      "h": 180,
      "id": "a15",
      "polygon": [
        [
          980,
          1660
        ],
        [
          1100,
          1660
        ],
        [
          1100,
          1840
        ],
        [
          980,
          1840
        ]
      ],
      "renderSegments": [
        {
          "x": 980,
          "y": 1660,
          "w": 120,
          "h": 180,
          "polygon": [
            [
              980,
              1660
            ],
            [
              1100,
              1660
            ],
            [
              1100,
              1840
            ],
            [
              980,
              1840
            ]
          ]
        }
      ]
    },
    {
      "x": 1700,
      "y": 1720,
      "w": 150,
      "h": 190,
      "id": "a16",
      "polygon": [
        [
          1700,
          1720
        ],
        [
          1850,
          1720
        ],
        [
          1850,
          1910
        ],
        [
          1700,
          1910
        ]
      ],
      "renderSegments": [
        {
          "x": 1700,
          "y": 1720,
          "w": 150,
          "h": 190,
          "polygon": [
            [
              1700,
              1720
            ],
            [
              1850,
              1720
            ],
            [
              1850,
              1910
            ],
            [
              1700,
              1910
            ]
          ]
        }
      ]
    },
    {
      "x": 650,
      "y": 930,
      "w": 650,
      "h": 320,
      "id": "a17",
      "polygon": [
        [
          650,
          930
        ],
        [
          1300,
          930
        ],
        [
          1300,
          1110
        ],
        [
          900,
          1110
        ],
        [
          900,
          1250
        ],
        [
          650,
          1250
        ]
      ],
      "renderSegments": [
        {
          "x": 650,
          "y": 930,
          "w": 650,
          "h": 320,
          "polygon": [
            [
              650,
              930
            ],
            [
              1300,
              930
            ],
            [
              1300,
              1110
            ],
            [
              900,
              1110
            ],
            [
              900,
              1250
            ],
            [
              650,
              1250
            ]
          ]
        }
      ]
    },
    {
      "x": 3050,
      "y": 2880,
      "w": 430,
      "h": 320,
      "id": "a18",
      "polygon": [
        [
          3050,
          2880
        ],
        [
          3480,
          2880
        ],
        [
          3480,
          3060
        ],
        [
          3250,
          3060
        ],
        [
          3250,
          3200
        ],
        [
          3050,
          3200
        ]
      ],
      "renderSegments": [
        {
          "x": 3050,
          "y": 2880,
          "w": 430,
          "h": 320,
          "polygon": [
            [
              3050,
              2880
            ],
            [
              3480,
              2880
            ],
            [
              3480,
              3060
            ],
            [
              3250,
              3060
            ],
            [
              3250,
              3200
            ],
            [
              3050,
              3200
            ]
          ]
        }
      ]
    }
  ],
  "stations": [
    {
      "id": "download-a",
      "type": "task",
      "task": "download",
      "label": "ダウンロード",
      "x": 630,
      "y": 497,
      "room": "archive",
      "integrated": true
    },
    {
      "id": "upload-a",
      "type": "task",
      "task": "upload",
      "label": "アップロード",
      "x": 4073,
      "y": 3022,
      "room": "comms",
      "integrated": true
    },
    {
      "id": "download-b",
      "type": "task",
      "task": "download",
      "label": "ダウンロード",
      "x": 581,
      "y": 1700,
      "room": "power",
      "integrated": true
    },
    {
      "id": "upload-b",
      "type": "task",
      "task": "upload",
      "label": "アップロード",
      "x": 2500,
      "y": 1366,
      "room": "atrium",
      "integrated": true
    },
    {
      "id": "download-c",
      "type": "task",
      "task": "download",
      "label": "ダウンロード",
      "x": 2500,
      "y": 466,
      "room": "observatory",
      "integrated": true
    },
    {
      "id": "upload-c",
      "type": "task",
      "task": "upload",
      "label": "アップロード",
      "x": 3996,
      "y": 1470,
      "room": "engineering",
      "integrated": true
    },
    {
      "id": "download-d",
      "type": "task",
      "task": "download",
      "label": "ダウンロード",
      "x": 584,
      "y": 2850,
      "room": "greenhouse",
      "integrated": true
    },
    {
      "id": "upload-d",
      "type": "task",
      "task": "upload",
      "label": "アップロード",
      "x": 2694,
      "y": 2910,
      "room": "medical",
      "integrated": true
    },
    {
      "id": "download-e",
      "type": "task",
      "task": "download",
      "label": "ダウンロード",
      "x": 1420,
      "y": 1850,
      "room": "storage",
      "integrated": true
    },
    {
      "id": "upload-e",
      "type": "task",
      "task": "upload",
      "label": "アップロード",
      "x": 4010,
      "y": 2260,
      "room": "fabrication",
      "integrated": true
    },
    {
      "id": "download-f",
      "type": "task",
      "task": "download",
      "label": "ダウンロード",
      "x": 1630,
      "y": 837,
      "room": "security",
      "integrated": true
    },
    {
      "id": "upload-f",
      "type": "task",
      "task": "upload",
      "label": "アップロード",
      "x": 1604,
      "y": 2850,
      "room": "cafeteria",
      "integrated": true
    },
    {
      "id": "meeting-button",
      "type": "emergency",
      "label": "緊急会議",
      "x": 2500,
      "y": 1652,
      "room": "atrium",
      "integrated": true
    },
    {
      "id": "repair-lights",
      "type": "repair",
      "repair": "lights",
      "label": "配電復旧",
      "x": 872,
      "y": 1718,
      "room": "power",
      "integrated": true
    },
    {
      "id": "repair-comms",
      "type": "repair",
      "repair": "comms",
      "label": "通信復旧",
      "x": 4369,
      "y": 3039,
      "room": "comms",
      "integrated": true
    },
    {
      "id": "repair-reactor-a",
      "type": "repair",
      "repair": "reactor",
      "label": "炉心A",
      "x": 3842,
      "y": 592,
      "room": "reactor",
      "integrated": true
    },
    {
      "id": "repair-reactor-b",
      "type": "repair",
      "repair": "reactor",
      "label": "炉心B",
      "x": 4271,
      "y": 592,
      "room": "reactor",
      "integrated": true
    }
  ],
  "objects": [
    {
      "id": "v302-archive-bookshelf-1",
      "type": "bookshelf",
      "label": "閲覧書架",
      "effectLabel": "マナ +1",
      "effectKind": "mana",
      "effectAmount": 1,
      "x": 333,
      "y": 365,
      "room": "archive",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 32000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-archive-archiveCabinet-2",
      "type": "archiveCabinet",
      "label": "保存箪笥",
      "effectLabel": "2C 獲得",
      "effectKind": "credits",
      "effectAmount": 2,
      "x": 916,
      "y": 365,
      "room": "archive",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 36000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-archive-readingLamp-3",
      "type": "readingLamp",
      "label": "読書席",
      "effectLabel": "マナ +1",
      "effectKind": "mana",
      "effectAmount": 1,
      "x": 344,
      "y": 662,
      "room": "archive",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 26000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-security-securityConsole-1",
      "type": "securityConsole",
      "label": "協議地図机",
      "effectLabel": "幸運／直観 +15%・20秒",
      "effectKind": "luckBoost",
      "effectAmount": 0.15,
      "x": 1452,
      "y": 691,
      "room": "security",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 40000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76,
      "effectDurationMs": 20000
    },
    {
      "id": "v302-security-cameraTripod-2",
      "type": "cameraTripod",
      "label": "観察台",
      "effectLabel": "幸運／直観 +15%・20秒",
      "effectKind": "luckBoost",
      "effectAmount": 0.15,
      "x": 1802,
      "y": 691,
      "room": "security",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 36000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76,
      "effectDurationMs": 20000
    },
    {
      "id": "v302-security-equipmentLocker-3",
      "type": "equipmentLocker",
      "label": "備品箪笥",
      "effectLabel": "スタミナ +70",
      "effectKind": "stamina",
      "effectAmount": 70,
      "x": 1458,
      "y": 965,
      "room": "security",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 36000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-observatory-holoProjector-1",
      "type": "holoProjector",
      "label": "星図円卓",
      "effectLabel": "幸運／直観 +20%・20秒",
      "effectKind": "luckBoost",
      "effectAmount": 0.2,
      "x": 2230,
      "y": 330,
      "room": "observatory",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 38000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76,
      "effectDurationMs": 20000
    },
    {
      "id": "v302-observatory-readingLamp-2",
      "type": "readingLamp",
      "label": "星見読書席",
      "effectLabel": "マナ +1",
      "effectKind": "mana",
      "effectAmount": 1,
      "x": 2760,
      "y": 330,
      "room": "observatory",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 26000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-observatory-commandDesk-3",
      "type": "commandDesk",
      "label": "観測机",
      "effectLabel": "幸運／直観 +15%・20秒",
      "effectKind": "luckBoost",
      "effectAmount": 0.15,
      "x": 2240,
      "y": 636,
      "room": "observatory",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 38000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76,
      "effectDurationMs": 20000
    },
    {
      "id": "v302-reactor-reactorGauge-1",
      "type": "reactorGauge",
      "label": "湧水時計",
      "effectLabel": "幸運／直観 +15%・20秒",
      "effectKind": "luckBoost",
      "effectAmount": 0.15,
      "x": 3699,
      "y": 388,
      "room": "reactor",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 38000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76,
      "effectDurationMs": 20000
    },
    {
      "id": "v302-reactor-coolingUnit-2",
      "type": "coolingUnit",
      "label": "清流の石鉢",
      "effectLabel": "スタミナ +120",
      "effectKind": "stamina",
      "effectAmount": 120,
      "x": 4388,
      "y": 388,
      "room": "reactor",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 36000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-reactor-powerCabinet-3",
      "type": "powerCabinet",
      "label": "常夜石灯籠",
      "effectLabel": "スタミナ +80",
      "effectKind": "stamina",
      "effectAmount": 80,
      "x": 3712,
      "y": 771,
      "room": "reactor",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 38000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-power-powerCabinet-1",
      "type": "powerCabinet",
      "label": "行灯棚",
      "effectLabel": "マナ +1",
      "effectKind": "mana",
      "effectAmount": 1,
      "x": 279,
      "y": 1502,
      "room": "power",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 38000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-power-cableSpool-2",
      "type": "cableSpool",
      "label": "手仕事台",
      "effectLabel": "2C 獲得",
      "effectKind": "credits",
      "effectAmount": 2,
      "x": 830,
      "y": 1502,
      "room": "power",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 34000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-power-recharge-3",
      "type": "recharge",
      "label": "休息座",
      "effectLabel": "スタミナ +200",
      "effectKind": "stamina",
      "effectAmount": 200,
      "x": 290,
      "y": 1907,
      "room": "power",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 15000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-storage-cargoCrate-1",
      "type": "cargoCrate",
      "label": "保存木箱",
      "effectLabel": "3C 獲得",
      "effectKind": "credits",
      "effectAmount": 3,
      "x": 1203,
      "y": 1696,
      "room": "storage",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 34000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-storage-palletJack-2",
      "type": "palletJack",
      "label": "籐かご手押し台",
      "effectLabel": "加速 1.25・8秒",
      "effectKind": "acceleration",
      "effectAmount": 1.25,
      "x": 1600,
      "y": 1696,
      "room": "storage",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 34000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76,
      "effectDurationMs": 8000
    },
    {
      "id": "v302-storage-equipmentLocker-3",
      "type": "equipmentLocker",
      "label": "リネン棚",
      "effectLabel": "スタミナ +90",
      "effectKind": "stamina",
      "effectAmount": 90,
      "x": 1210,
      "y": 2011,
      "room": "storage",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 36000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-atrium-sofa-1",
      "type": "conferenceSofa",
      "label": "陽だまりソファ",
      "effectLabel": "オーバーヒール +1",
      "effectKind": "overheal",
      "effectAmount": 1,
      "x": 2149,
      "y": 1314,
      "room": "atrium",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 18000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-atrium-hydration-2",
      "type": "mineralWaterBar",
      "label": "湧水給水卓",
      "effectLabel": "スタミナ +100",
      "effectKind": "stamina",
      "effectAmount": 100,
      "x": 2838,
      "y": 1314,
      "room": "atrium",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 15000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-atrium-airPlant-3",
      "type": "indoorGarden",
      "label": "季節の中庭植栽",
      "effectLabel": "幸運／直観 +12%・20秒",
      "effectKind": "luckBoost",
      "effectAmount": 0.12,
      "x": 2162,
      "y": 1899,
      "room": "atrium",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 16000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76,
      "effectDurationMs": 20000
    },
    {
      "id": "v302-atrium-conferenceTable-4",
      "type": "conferenceTable",
      "label": "木製協議卓",
      "effectLabel": "マナ +1",
      "effectKind": "mana",
      "effectAmount": 1,
      "x": 2812,
      "y": 1886,
      "room": "atrium",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 36000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-engineering-workbench-1",
      "type": "workbench",
      "label": "木工作業台",
      "effectLabel": "スタミナ +120",
      "effectKind": "stamina",
      "effectAmount": 120,
      "x": 3619,
      "y": 1316,
      "room": "engineering",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 38000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-engineering-toolCart-2",
      "type": "toolCart",
      "label": "端材手押し棚",
      "effectLabel": "2C 獲得",
      "effectKind": "credits",
      "effectAmount": 2,
      "x": 4308,
      "y": 1316,
      "room": "engineering",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 34000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-engineering-coolingUnit-3",
      "type": "coolingUnit",
      "label": "石の洗い場",
      "effectLabel": "スタミナ +120",
      "effectKind": "stamina",
      "effectAmount": 120,
      "x": 3632,
      "y": 1631,
      "room": "engineering",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 36000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-fabrication-workbench-1",
      "type": "workbench",
      "label": "工芸作業台",
      "effectLabel": "スタミナ +120",
      "effectKind": "stamina",
      "effectAmount": 120,
      "x": 3642,
      "y": 2102,
      "room": "fabrication",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 38000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-fabrication-recyclingUnit-2",
      "type": "recyclingUnit",
      "label": "粘土再生槽",
      "effectLabel": "3C 獲得",
      "effectKind": "credits",
      "effectAmount": 3,
      "x": 4315,
      "y": 2102,
      "room": "fabrication",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 34000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-fabrication-toolCart-3",
      "type": "toolCart",
      "label": "染織手押し台",
      "effectLabel": "加速 1.30・8秒",
      "effectKind": "acceleration",
      "effectAmount": 1.3,
      "x": 3655,
      "y": 2426,
      "room": "fabrication",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 34000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76,
      "effectDurationMs": 8000
    },
    {
      "id": "v302-greenhouse-greenhousePlanter-1",
      "type": "aromaticGarden",
      "label": "芳香植物庭園",
      "effectLabel": "幸運／直観 +15%・24秒",
      "effectKind": "luckBoost",
      "effectAmount": 0.15,
      "x": 303,
      "y": 2652,
      "room": "greenhouse",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 18000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76,
      "effectDurationMs": 24000
    },
    {
      "id": "v302-greenhouse-mistSprayer-2",
      "type": "restorativeMist",
      "label": "薬草の霧鉢",
      "effectLabel": "幸運／直観 +12%・20秒",
      "effectKind": "luckBoost",
      "effectAmount": 0.12,
      "x": 817,
      "y": 2652,
      "room": "greenhouse",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 18000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76,
      "effectDurationMs": 20000
    },
    {
      "id": "v302-greenhouse-compostUnit-3",
      "type": "herbPreparationTable",
      "label": "薬草調合台",
      "effectLabel": "HP +1",
      "effectKind": "heal",
      "effectAmount": 1,
      "x": 313,
      "y": 3057,
      "room": "greenhouse",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 34000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-cafeteria-nutritionStation-1",
      "type": "healthyMealTable",
      "label": "健康食ビュッフェ",
      "effectLabel": "HP +1・スタミナ +120・マナ +1",
      "effectKind": "healthyMeal",
      "effectAmount": 1,
      "x": 1334,
      "y": 2661,
      "room": "cafeteria",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 18000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-cafeteria-hydration-2",
      "type": "mineralWaterBar",
      "label": "ミネラル給水卓",
      "effectLabel": "スタミナ +100",
      "effectKind": "stamina",
      "effectAmount": 100,
      "x": 1827,
      "y": 2661,
      "room": "cafeteria",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 15000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-cafeteria-sofa-3",
      "type": "relaxationSalon",
      "label": "静養ソファ",
      "effectLabel": "加速 1.35・12秒",
      "effectKind": "acceleration",
      "effectAmount": 1.35,
      "x": 1343,
      "y": 3048,
      "room": "cafeteria",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 18000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76,
      "effectDurationMs": 12000
    },
    {
      "id": "v302-medical-diagnosticBed-1",
      "type": "relaxationBed",
      "label": "布張り施術寝台",
      "effectLabel": "加速 1.35・12秒",
      "effectKind": "acceleration",
      "effectAmount": 1.35,
      "x": 2419,
      "y": 2738,
      "room": "medical",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 30000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76,
      "effectDurationMs": 12000
    },
    {
      "id": "v302-medical-medicalCabinet-2",
      "type": "herbalCabinet",
      "label": "薬草とリネンの棚",
      "effectLabel": "HP +1",
      "effectKind": "heal",
      "effectAmount": 1,
      "x": 2922,
      "y": 2738,
      "room": "medical",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 30000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-medical-sterilizer-3",
      "type": "footBath",
      "label": "源泉掛け流し足湯",
      "effectLabel": "回復・浄化・再使用待機 -6秒",
      "effectKind": "footBath",
      "effectAmount": 1,
      "x": 2428,
      "y": 3089,
      "room": "medical",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 36000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-comms-radioConsole-1",
      "type": "radioConsole",
      "label": "書簡机",
      "effectLabel": "幸運／直観 +15%・20秒",
      "effectKind": "luckBoost",
      "effectAmount": 0.15,
      "x": 3742,
      "y": 2882,
      "room": "comms",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 38000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76,
      "effectDurationMs": 20000
    },
    {
      "id": "v302-comms-serverRack-2",
      "type": "serverRack",
      "label": "文箱棚",
      "effectLabel": "3C 獲得",
      "effectKind": "credits",
      "effectAmount": 3,
      "x": 4346,
      "y": 2882,
      "room": "comms",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 40000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v302-comms-antennaArray-3",
      "type": "antennaArray",
      "label": "風鈴の小庭",
      "effectLabel": "マナ +1",
      "effectKind": "mana",
      "effectAmount": 1,
      "x": 3754,
      "y": 3143,
      "room": "comms",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "cooldownMs": 40000,
      "useRange": 128,
      "visualWidth": 110,
      "visualHeight": 76
    },
    {
      "id": "v317-corridor-a01-1",
      "type": "wallSconce",
      "label": "壁灯",
      "effectLabel": "幸運／直観 +15%・20秒",
      "effectKind": "luckBoost",
      "effectAmount": 0.15,
      "effectDurationMs": 20000,
      "x": 1240,
      "y": 672,
      "corridor": "a01",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "sourceTexture": "field-aurelia-corridor-objects-v317.webp",
      "sourceLocalX": 60,
      "sourceLocalY": 22,
      "cooldownMs": 32000,
      "useRange": 104,
      "visualWidth": 24,
      "visualHeight": 24
    },
    {
      "id": "v317-corridor-a02-1",
      "type": "corridorPlanter",
      "label": "回復植栽",
      "effectLabel": "幸運／直観 +12%・20秒",
      "effectKind": "luckBoost",
      "effectAmount": 0.12,
      "effectDurationMs": 20000,
      "x": 485,
      "y": 1046,
      "corridor": "a02",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "sourceTexture": "field-aurelia-corridor-objects-v317.webp",
      "sourceLocalX": 35,
      "sourceLocalY": 206,
      "cooldownMs": 32000,
      "useRange": 104,
      "visualWidth": 42,
      "visualHeight": 42
    },
    {
      "id": "v317-corridor-a03-1",
      "type": "wallSconce",
      "label": "壁灯",
      "effectLabel": "幸運／直観 +15%・20秒",
      "effectKind": "luckBoost",
      "effectAmount": 0.15,
      "effectDurationMs": 20000,
      "x": 2005,
      "y": 632,
      "corridor": "a03",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "sourceTexture": "field-aurelia-corridor-objects-v317.webp",
      "sourceLocalX": 125,
      "sourceLocalY": 22,
      "cooldownMs": 32000,
      "useRange": 104,
      "visualWidth": 24,
      "visualHeight": 24
    },
    {
      "id": "v317-corridor-a04-1",
      "type": "corridorBench",
      "label": "休息腰掛け",
      "effectLabel": "加速 1.4・18秒",
      "effectKind": "acceleration",
      "effectAmount": 1.4,
      "effectDurationMs": 18000,
      "x": 3201,
      "y": 532,
      "corridor": "a04",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "sourceTexture": "field-aurelia-corridor-objects-v317.webp",
      "sourceLocalX": 201,
      "sourceLocalY": 32,
      "cooldownMs": 32000,
      "useRange": 104,
      "visualWidth": 100,
      "visualHeight": 40
    },
    {
      "id": "v317-corridor-a05-1",
      "type": "corridorPlanter",
      "label": "香草鉢",
      "effectLabel": "HP +1",
      "effectKind": "heal",
      "effectAmount": 1,
      "x": 2414,
      "y": 885,
      "corridor": "a05",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "sourceTexture": "field-aurelia-corridor-objects-v317.webp",
      "sourceLocalX": 34,
      "sourceLocalY": 65,
      "cooldownMs": 32000,
      "useRange": 104,
      "visualWidth": 42,
      "visualHeight": 42
    },
    {
      "id": "v317-corridor-a06-1",
      "type": "corridorBench",
      "label": "静養腰掛け",
      "effectLabel": "加速 1.4・18秒",
      "effectKind": "acceleration",
      "effectAmount": 1.4,
      "effectDurationMs": 18000,
      "x": 1828,
      "y": 1170,
      "corridor": "a06",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "sourceTexture": "field-aurelia-corridor-objects-v317.webp",
      "sourceLocalX": 48,
      "sourceLocalY": 210,
      "cooldownMs": 32000,
      "useRange": 104,
      "visualWidth": 40,
      "visualHeight": 100
    },
    {
      "id": "v317-corridor-a07-1",
      "type": "wallSconce",
      "label": "壁灯",
      "effectLabel": "幸運／直観 +15%・20秒",
      "effectKind": "luckBoost",
      "effectAmount": 0.15,
      "effectDurationMs": 20000,
      "x": 3235,
      "y": 1422,
      "corridor": "a07",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "sourceTexture": "field-aurelia-corridor-objects-v317.webp",
      "sourceLocalX": 85,
      "sourceLocalY": 22,
      "cooldownMs": 32000,
      "useRange": 104,
      "visualWidth": 24,
      "visualHeight": 24
    },
    {
      "id": "v317-corridor-a08-1",
      "type": "corridorPlanter",
      "label": "小葉鉢",
      "effectLabel": "スタミナ +55",
      "effectKind": "stamina",
      "effectAmount": 55,
      "x": 3182,
      "y": 1992,
      "corridor": "a08",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "sourceTexture": "field-aurelia-corridor-objects-v317.webp",
      "sourceLocalX": 32,
      "sourceLocalY": 32,
      "cooldownMs": 32000,
      "useRange": 104,
      "visualWidth": 42,
      "visualHeight": 42
    },
    {
      "id": "v317-corridor-a09-1",
      "type": "wallSconce",
      "label": "壁灯",
      "effectLabel": "幸運／直観 +15%・20秒",
      "effectKind": "luckBoost",
      "effectAmount": 0.15,
      "effectDurationMs": 20000,
      "x": 3928,
      "y": 1061,
      "corridor": "a09",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "sourceTexture": "field-aurelia-corridor-objects-v317.webp",
      "sourceLocalX": 28,
      "sourceLocalY": 61,
      "cooldownMs": 32000,
      "useRange": 104,
      "visualWidth": 24,
      "visualHeight": 24
    },
    {
      "id": "v317-corridor-a10-1",
      "type": "wallSconce",
      "label": "足元灯",
      "effectLabel": "幸運／直観 +10%・15秒",
      "effectKind": "luckBoost",
      "effectAmount": 0.1,
      "effectDurationMs": 15000,
      "x": 3928,
      "y": 1861,
      "corridor": "a10",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "sourceTexture": "field-aurelia-corridor-objects-v317.webp",
      "sourceLocalX": 28,
      "sourceLocalY": 41,
      "cooldownMs": 32000,
      "useRange": 104,
      "visualWidth": 24,
      "visualHeight": 24
    },
    {
      "id": "v317-corridor-a11-1",
      "type": "wallSconce",
      "label": "足元灯",
      "effectLabel": "幸運／直観 +10%・15秒",
      "effectKind": "luckBoost",
      "effectAmount": 0.1,
      "effectDurationMs": 15000,
      "x": 3928,
      "y": 2671,
      "corridor": "a11",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "sourceTexture": "field-aurelia-corridor-objects-v317.webp",
      "sourceLocalX": 28,
      "sourceLocalY": 51,
      "cooldownMs": 32000,
      "useRange": 104,
      "visualWidth": 24,
      "visualHeight": 24
    },
    {
      "id": "v317-corridor-a12-1",
      "type": "corridorPlanter",
      "label": "薬草鉢",
      "effectLabel": "幸運／直観 +12%・20秒",
      "effectKind": "luckBoost",
      "effectAmount": 0.12,
      "effectDurationMs": 20000,
      "x": 2434,
      "y": 2386,
      "corridor": "a12",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "sourceTexture": "field-aurelia-corridor-objects-v317.webp",
      "sourceLocalX": 34,
      "sourceLocalY": 136,
      "cooldownMs": 32000,
      "useRange": 104,
      "visualWidth": 42,
      "visualHeight": 42
    },
    {
      "id": "v317-corridor-a13-1",
      "type": "corridorPlanter",
      "label": "木陰鉢",
      "effectLabel": "スタミナ +60",
      "effectKind": "stamina",
      "effectAmount": 60,
      "x": 1900,
      "y": 2180,
      "corridor": "a13",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "sourceTexture": "field-aurelia-corridor-objects-v317.webp",
      "sourceLocalX": 250,
      "sourceLocalY": 170,
      "cooldownMs": 32000,
      "useRange": 104,
      "visualWidth": 42,
      "visualHeight": 42
    },
    {
      "id": "v317-corridor-a13-2",
      "type": "corridorBench",
      "label": "曲がり角腰掛け",
      "effectLabel": "加速 1.4・18秒",
      "effectKind": "acceleration",
      "effectAmount": 1.4,
      "effectDurationMs": 18000,
      "x": 1718,
      "y": 2385,
      "corridor": "a13",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "sourceTexture": "field-aurelia-corridor-objects-v317.webp",
      "sourceLocalX": 68,
      "sourceLocalY": 375,
      "cooldownMs": 32000,
      "useRange": 104,
      "visualWidth": 100,
      "visualHeight": 40
    },
    {
      "id": "v317-corridor-a14-1",
      "type": "wallSconce",
      "label": "壁灯",
      "effectLabel": "幸運／直観 +15%・20秒",
      "effectKind": "luckBoost",
      "effectAmount": 0.15,
      "effectDurationMs": 20000,
      "x": 1085,
      "y": 2802,
      "corridor": "a14",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "sourceTexture": "field-aurelia-corridor-objects-v317.webp",
      "sourceLocalX": 135,
      "sourceLocalY": 22,
      "cooldownMs": 32000,
      "useRange": 104,
      "visualWidth": 24,
      "visualHeight": 24
    },
    {
      "id": "v317-corridor-a15-1",
      "type": "wallSconce",
      "label": "壁灯",
      "effectLabel": "マナ +1",
      "effectKind": "mana",
      "effectAmount": 1,
      "x": 1040,
      "y": 1682,
      "corridor": "a15",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "sourceTexture": "field-aurelia-corridor-objects-v317.webp",
      "sourceLocalX": 60,
      "sourceLocalY": 22,
      "cooldownMs": 32000,
      "useRange": 104,
      "visualWidth": 24,
      "visualHeight": 24
    },
    {
      "id": "v317-corridor-a16-1",
      "type": "wallSconce",
      "label": "壁灯",
      "effectLabel": "マナ +1",
      "effectKind": "mana",
      "effectAmount": 1,
      "x": 1815,
      "y": 1742,
      "corridor": "a16",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "sourceTexture": "field-aurelia-corridor-objects-v317.webp",
      "sourceLocalX": 115,
      "sourceLocalY": 22,
      "cooldownMs": 32000,
      "useRange": 104,
      "visualWidth": 24,
      "visualHeight": 24
    },
    {
      "id": "v317-corridor-a17-1",
      "type": "corridorBench",
      "label": "窓辺腰掛け",
      "effectLabel": "加速 1.4・18秒",
      "effectKind": "acceleration",
      "effectAmount": 1.4,
      "effectDurationMs": 18000,
      "x": 1150,
      "y": 968,
      "corridor": "a17",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "sourceTexture": "field-aurelia-corridor-objects-v317.webp",
      "sourceLocalX": 500,
      "sourceLocalY": 38,
      "cooldownMs": 32000,
      "useRange": 104,
      "visualWidth": 100,
      "visualHeight": 40
    },
    {
      "id": "v317-corridor-a17-2",
      "type": "corridorPlanter",
      "label": "木陰鉢",
      "effectLabel": "幸運／直観 +12%・20秒",
      "effectKind": "luckBoost",
      "effectAmount": 0.12,
      "effectDurationMs": 20000,
      "x": 745,
      "y": 1185,
      "corridor": "a17",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "sourceTexture": "field-aurelia-corridor-objects-v317.webp",
      "sourceLocalX": 95,
      "sourceLocalY": 255,
      "cooldownMs": 32000,
      "useRange": 104,
      "visualWidth": 42,
      "visualHeight": 42
    },
    {
      "id": "v317-corridor-a18-1",
      "type": "corridorBench",
      "label": "静養腰掛け",
      "effectLabel": "加速 1.4・18秒",
      "effectKind": "acceleration",
      "effectAmount": 1.4,
      "effectDurationMs": 18000,
      "x": 3401,
      "y": 2918,
      "corridor": "a18",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "sourceTexture": "field-aurelia-corridor-objects-v317.webp",
      "sourceLocalX": 351,
      "sourceLocalY": 38,
      "cooldownMs": 32000,
      "useRange": 104,
      "visualWidth": 100,
      "visualHeight": 40
    },
    {
      "id": "v317-corridor-a18-2",
      "type": "corridorPlanter",
      "label": "香草鉢",
      "effectLabel": "HP +1",
      "effectKind": "heal",
      "effectAmount": 1,
      "x": 3233,
      "y": 3130,
      "corridor": "a18",
      "interactive": true,
      "integrated": true,
      "assetAnchor": true,
      "sourceTexture": "field-aurelia-corridor-objects-v317.webp",
      "sourceLocalX": 183,
      "sourceLocalY": 250,
      "cooldownMs": 32000,
      "useRange": 104,
      "visualWidth": 42,
      "visualHeight": 42
    }
  ],
  "vents": [],
  "cameras": [
    {
      "id": "cam-archive",
      "label": "記録院",
      "x": 1026,
      "y": 299,
      "room": "archive",
      "range": 420
    },
    {
      "id": "cam-atrium",
      "label": "中央アトリウム",
      "x": 2500,
      "y": 1145,
      "room": "atrium",
      "range": 480
    },
    {
      "id": "cam-engineering",
      "label": "工学区",
      "x": 3528,
      "y": 1274,
      "room": "engineering",
      "range": 420
    },
    {
      "id": "cam-south",
      "label": "南部区画",
      "x": 2371,
      "y": 2676,
      "room": "medical",
      "range": 420
    }
  ],
  "doors": [
    {
      "id": "d-archive-security",
      "label": "区画扉",
      "orientation": "vertical",
      "x": 1165,
      "y": 675,
      "w": 30,
      "h": 130
    },
    {
      "id": "d-archive-power",
      "label": "区画扉",
      "orientation": "horizontal",
      "x": 485,
      "y": 825,
      "w": 130,
      "h": 30
    },
    {
      "id": "d-security-north",
      "label": "区画扉",
      "orientation": "vertical",
      "x": 1865,
      "y": 635,
      "w": 30,
      "h": 130
    },
    {
      "id": "d-observatory-west",
      "label": "区画扉",
      "orientation": "vertical",
      "x": 1985,
      "y": 635,
      "w": 30,
      "h": 130
    },
    {
      "id": "d-observatory-reactor",
      "label": "区画扉",
      "orientation": "vertical",
      "x": 2985,
      "y": 525,
      "w": 30,
      "h": 130
    },
    {
      "id": "d-observatory-atrium",
      "label": "区画扉",
      "orientation": "horizontal",
      "x": 2425,
      "y": 805,
      "w": 130,
      "h": 30
    },
    {
      "id": "d-security-atrium",
      "label": "区画扉",
      "orientation": "vertical",
      "x": 1865,
      "y": 985,
      "w": 30,
      "h": 100
    },
    {
      "id": "d-atrium-engineering",
      "label": "区画扉",
      "orientation": "vertical",
      "x": 3135,
      "y": 1430,
      "w": 30,
      "h": 130
    },
    {
      "id": "d-atrium-fabrication",
      "label": "区画扉",
      "orientation": "vertical",
      "x": 3135,
      "y": 1985,
      "w": 30,
      "h": 130
    },
    {
      "id": "d-reactor-engineering",
      "label": "区画扉",
      "orientation": "horizontal",
      "x": 3945,
      "y": 985,
      "w": 130,
      "h": 30
    },
    {
      "id": "d-engineering-fabrication",
      "label": "区画扉",
      "orientation": "horizontal",
      "x": 3945,
      "y": 1805,
      "w": 130,
      "h": 30
    },
    {
      "id": "d-fabrication-comms",
      "label": "区画扉",
      "orientation": "horizontal",
      "x": 3945,
      "y": 2605,
      "w": 130,
      "h": 30
    },
    {
      "id": "d-atrium-medical",
      "label": "区画扉",
      "orientation": "horizontal",
      "x": 2445,
      "y": 2235,
      "w": 130,
      "h": 30
    },
    {
      "id": "d-atrium-cafeteria",
      "label": "区画扉",
      "orientation": "vertical",
      "x": 1835,
      "y": 2060,
      "w": 30,
      "h": 120
    },
    {
      "id": "d-greenhouse-east",
      "label": "区画扉",
      "orientation": "vertical",
      "x": 1035,
      "y": 2810,
      "w": 30,
      "h": 130
    },
    {
      "id": "d-cafeteria-west",
      "label": "区画扉",
      "orientation": "vertical",
      "x": 1105,
      "y": 2810,
      "w": 30,
      "h": 130
    },
    {
      "id": "d-power-storage",
      "label": "区画扉",
      "orientation": "vertical",
      "x": 1065,
      "y": 1685,
      "w": 30,
      "h": 130
    },
    {
      "id": "d-storage-atrium",
      "label": "区画扉",
      "orientation": "vertical",
      "x": 1765,
      "y": 1750,
      "w": 30,
      "h": 130
    },
    {
      "id": "d-medical-north",
      "label": "区画扉",
      "orientation": "horizontal",
      "x": 2445,
      "y": 2505,
      "w": 130,
      "h": 30
    },
    {
      "id": "d-medical-east",
      "label": "区画扉",
      "orientation": "vertical",
      "x": 3135,
      "y": 2910,
      "w": 30,
      "h": 130
    },
    {
      "id": "d-comms-west",
      "label": "区画扉",
      "orientation": "vertical",
      "x": 3465,
      "y": 2910,
      "w": 30,
      "h": 130
    }
  ],
  "sourceTexture": "assets/generated/field-aurelia-corridor-objects-v317.webp",
  "assetRevision": "v340-full-map-world-scale"
});
const LABORATORY_MAP = Object.freeze({
  "schema": "dva-map-laboratory-v458",
  "id": "outpost",
  "label": "ルミナ総合研究・休養棟",
  "authoredGeometry": true,
  "width": 4750,
  "height": 3100,
  "playerRadius": 20,
  "speed": 281,
  "ghostSpeed": 350,
  "reportRange": 105,
  "taskRange": 175,
  "ventRange": 95,
  "spawns": [
    {
      "x": 2263,
      "y": 1450
    },
    {
      "x": 2488,
      "y": 1450
    },
    {
      "x": 2263,
      "y": 1650
    },
    {
      "x": 2488,
      "y": 1650
    },
    {
      "x": 2113,
      "y": 1550
    },
    {
      "x": 2638,
      "y": 1550
    },
    {
      "x": 2375,
      "y": 1313
    },
    {
      "x": 2375,
      "y": 1788
    }
  ],
  "rooms": [
    {
      "id": "labs",
      "label": "分析・合成研究室",
      "x": 200,
      "y": 175,
      "w": 1313,
      "h": 813,
      "textureBounds": {
        "x": 160,
        "y": 140,
        "w": 1050,
        "h": 650
      },
      "textureCode": "room-labs.py",
      "textureAsset": "room-labs.png"
    },
    {
      "id": "drill",
      "label": "量子物性研究室",
      "x": 3238,
      "y": 175,
      "w": 1313,
      "h": 813,
      "textureBounds": {
        "x": 2590,
        "y": 140,
        "w": 1050,
        "h": 650
      },
      "textureCode": "room-drill.py",
      "textureAsset": "room-drill.png"
    },
    {
      "id": "hub",
      "label": "研究統合ロビー",
      "x": 1750,
      "y": 1013,
      "w": 1250,
      "h": 1075,
      "textureBounds": {
        "x": 1400,
        "y": 810,
        "w": 1000,
        "h": 860
      },
      "textureCode": "room-hub.py",
      "textureAsset": "room-hub.png"
    },
    {
      "id": "power",
      "label": "生体工学研究室",
      "x": 200,
      "y": 2113,
      "w": 1313,
      "h": 813,
      "textureBounds": {
        "x": 160,
        "y": 1690,
        "w": 1050,
        "h": 650
      },
      "textureCode": "room-power.py",
      "textureAsset": "room-power.png"
    },
    {
      "id": "greenhouse",
      "label": "リラクゼーションラウンジ",
      "x": 3238,
      "y": 2113,
      "w": 1313,
      "h": 813,
      "textureBounds": {
        "x": 2590,
        "y": 1690,
        "w": 1050,
        "h": 650
      },
      "textureCode": "room-greenhouse.py",
      "textureAsset": "room-greenhouse.png"
    }
  ],
  "corridors": [
    {
      "id": "north-gallery",
      "label": "北研究ギャラリー",
      "x": 1513,
      "y": 788,
      "w": 1725,
      "h": 225,
      "textureBounds": {
        "x": 1210,
        "y": 630,
        "w": 1380,
        "h": 180
      },
      "textureCode": "corridor-north-gallery.py",
      "textureAsset": "corridor-north-gallery.png",
      "openings": [
        "W",
        "E",
        "S"
      ],
      "topology": "junction"
    },
    {
      "id": "south-gallery",
      "label": "南静養ギャラリー",
      "x": 1513,
      "y": 2088,
      "w": 1725,
      "h": 225,
      "textureBounds": {
        "x": 1210,
        "y": 1670,
        "w": 1380,
        "h": 180
      },
      "textureCode": "corridor-south-gallery.py",
      "textureAsset": "corridor-south-gallery.png",
      "openings": [
        "W",
        "E",
        "N"
      ],
      "topology": "junction"
    },
    {
      "id": "west-service",
      "label": "西研究連絡廊",
      "x": 650,
      "y": 988,
      "w": 250,
      "h": 1125,
      "textureBounds": {
        "x": 520,
        "y": 790,
        "w": 200,
        "h": 900
      },
      "textureCode": "corridor-west-service.py",
      "textureAsset": "corridor-west-service.png",
      "openings": [
        "N",
        "S"
      ],
      "topology": "straight"
    },
    {
      "id": "east-botanical",
      "label": "東緑化連絡廊",
      "x": 3850,
      "y": 988,
      "w": 250,
      "h": 1125,
      "textureBounds": {
        "x": 3080,
        "y": 790,
        "w": 200,
        "h": 900
      },
      "textureCode": "corridor-east-botanical.py",
      "textureAsset": "corridor-east-botanical.png",
      "openings": [
        "N",
        "S"
      ],
      "topology": "straight"
    }
  ],
  "stations": [
    {
      "id": "download-o-a",
      "type": "task",
      "task": "download",
      "label": "分析データ取得",
      "x": 463,
      "y": 444,
      "room": "labs"
    },
    {
      "id": "upload-o-a",
      "type": "task",
      "task": "upload",
      "label": "分析データ送信",
      "x": 1250,
      "y": 706,
      "room": "labs"
    },
    {
      "id": "download-o-b",
      "type": "task",
      "task": "download",
      "label": "量子ログ取得",
      "x": 3513,
      "y": 431,
      "room": "drill"
    },
    {
      "id": "upload-o-b",
      "type": "task",
      "task": "upload",
      "label": "量子ログ送信",
      "x": 4275,
      "y": 706,
      "room": "drill"
    },
    {
      "id": "download-o-c",
      "type": "task",
      "task": "download",
      "label": "培養記録取得",
      "x": 456,
      "y": 2381,
      "room": "power"
    },
    {
      "id": "upload-o-c",
      "type": "task",
      "task": "upload",
      "label": "培養記録送信",
      "x": 1244,
      "y": 2700,
      "room": "power"
    },
    {
      "id": "download-o-d",
      "type": "task",
      "task": "download",
      "label": "環境記録取得",
      "x": 3513,
      "y": 2381,
      "room": "greenhouse"
    },
    {
      "id": "upload-o-d",
      "type": "task",
      "task": "upload",
      "label": "環境記録送信",
      "x": 4275,
      "y": 2700,
      "room": "greenhouse"
    },
    {
      "id": "download-o-e",
      "type": "task",
      "task": "download",
      "label": "統合記録取得",
      "x": 1975,
      "y": 1300,
      "room": "hub"
    },
    {
      "id": "upload-o-e",
      "type": "task",
      "task": "upload",
      "label": "統合記録送信",
      "x": 2775,
      "y": 1825,
      "room": "hub"
    },
    {
      "id": "meeting-button",
      "type": "emergency",
      "label": "緊急招集卓",
      "x": 2375,
      "y": 1550,
      "room": "hub"
    },
    {
      "id": "repair-lights",
      "type": "repair",
      "repair": "lights",
      "label": "照明制御盤",
      "x": 781,
      "y": 2738,
      "room": "power"
    },
    {
      "id": "repair-comms",
      "type": "repair",
      "repair": "comms",
      "label": "研究通信卓",
      "x": 2725,
      "y": 1300,
      "room": "hub"
    },
    {
      "id": "repair-reactor-a",
      "type": "repair",
      "repair": "reactor",
      "label": "量子封止器A",
      "x": 3575,
      "y": 300,
      "room": "drill"
    },
    {
      "id": "repair-reactor-b",
      "type": "repair",
      "repair": "reactor",
      "label": "量子封止器B",
      "x": 4213,
      "y": 588,
      "room": "drill"
    },
    {
      "id": "repair-oxygen-a",
      "type": "repair",
      "repair": "oxygen",
      "label": "培養気相調整A",
      "x": 606,
      "y": 2219,
      "room": "power"
    },
    {
      "id": "repair-oxygen-b",
      "type": "repair",
      "repair": "oxygen",
      "label": "温室気相調整B",
      "x": 4138,
      "y": 2219,
      "room": "greenhouse"
    },
    {
      "id": "admin",
      "type": "utility",
      "utility": "admin",
      "label": "研究区画台帳",
      "x": 2100,
      "y": 1781,
      "room": "hub"
    },
    {
      "id": "cameras",
      "type": "utility",
      "utility": "cameras",
      "label": "観測カメラ卓",
      "x": 1113,
      "y": 313,
      "room": "labs"
    },
    {
      "id": "vitals",
      "type": "utility",
      "utility": "vitals",
      "label": "生体指標端末",
      "x": 1063,
      "y": 2294,
      "room": "power"
    },
    {
      "id": "doorlog",
      "type": "utility",
      "utility": "doorlog",
      "label": "入退室記録",
      "x": 2725,
      "y": 1825,
      "room": "hub"
    }
  ],
  "objects": [
    {
      "id": "outpost-labs-recovery",
      "type": "medPod",
      "label": "試薬除染ポッド",
      "effectLabel": "HP全回復・オーバーヒール",
      "effectKind": "fullRecovery",
      "effectAmount": 1,
      "x": 1144,
      "y": 463,
      "room": "labs",
      "interactive": true,
      "integrated": true,
      "cooldownMs": 30000,
      "useRange": 160,
      "visualWidth": 140,
      "visualHeight": 95
    },
    {
      "id": "outpost-labs-mana",
      "type": "specimenCase",
      "label": "標準試料ケース",
      "effectLabel": "マナ +1",
      "effectKind": "mana",
      "effectAmount": 1,
      "x": 663,
      "y": 813,
      "room": "labs",
      "interactive": true,
      "integrated": true,
      "cooldownMs": 36000,
      "useRange": 160,
      "visualWidth": 73,
      "visualHeight": 73
    },
    {
      "id": "outpost-drill-credit",
      "type": "creditCache",
      "label": "研究助成クレジット端末",
      "effectLabel": "+3クレジット",
      "effectKind": "credits",
      "effectAmount": 3,
      "x": 4138,
      "y": 331,
      "room": "drill",
      "interactive": true,
      "integrated": true,
      "cooldownMs": 45000,
      "useRange": 160,
      "visualWidth": 120,
      "visualHeight": 85
    },
    {
      "id": "outpost-drill-cooldown",
      "type": "mineralScanner",
      "label": "位相同期計",
      "effectLabel": "再使用待機 -6秒",
      "effectKind": "cooldownReduction",
      "effectAmount": 6000,
      "x": 3825,
      "y": 813,
      "room": "drill",
      "interactive": true,
      "integrated": true,
      "cooldownMs": 36000,
      "useRange": 160,
      "visualWidth": 120,
      "visualHeight": 85
    },
    {
      "id": "outpost-hub-stamina",
      "type": "recharge",
      "label": "研究員補給卓",
      "effectLabel": "スタミナ +160",
      "effectKind": "stamina",
      "effectAmount": 160,
      "x": 1969,
      "y": 1813,
      "room": "hub",
      "interactive": true,
      "integrated": true,
      "cooldownMs": 24000,
      "useRange": 160,
      "visualWidth": 140,
      "visualHeight": 95
    },
    {
      "id": "outpost-hub-luck",
      "type": "wallDisplay",
      "label": "共同仮説ボード",
      "effectLabel": "幸運／直観 +15%・20秒",
      "effectKind": "luckBoost",
      "effectAmount": 0.15,
      "effectDurationMs": 20000,
      "x": 2781,
      "y": 1288,
      "room": "hub",
      "interactive": true,
      "integrated": true,
      "cooldownMs": 32000,
      "useRange": 160,
      "visualWidth": 120,
      "visualHeight": 85
    },
    {
      "id": "outpost-power-heal",
      "type": "diagnosticBed",
      "label": "細胞回復寝台",
      "effectLabel": "HP +1",
      "effectKind": "heal",
      "effectAmount": 1,
      "x": 1063,
      "y": 2588,
      "room": "power",
      "interactive": true,
      "integrated": true,
      "cooldownMs": 30000,
      "useRange": 160,
      "visualWidth": 180,
      "visualHeight": 115
    },
    {
      "id": "outpost-power-status",
      "type": "sterilizer",
      "label": "遺伝子汚染除去槽",
      "effectLabel": "状態異常回復",
      "effectKind": "statusRecovery",
      "effectAmount": 1,
      "x": 481,
      "y": 2738,
      "room": "power",
      "interactive": true,
      "integrated": true,
      "cooldownMs": 32000,
      "useRange": 160,
      "visualWidth": 130,
      "visualHeight": 165
    },
    {
      "id": "outpost-relaxation-pod-a",
      "type": "relaxationBed",
      "label": "呼吸同期リラクゼーションポッド",
      "effectLabel": "加速 1.35・12秒",
      "effectKind": "relaxation",
      "effectAmount": 1.35,
      "effectDurationMs": 12000,
      "x": 3519,
      "y": 2525,
      "room": "greenhouse",
      "interactive": true,
      "integrated": true,
      "cooldownMs": 30000,
      "useRange": 160,
      "visualWidth": 180,
      "visualHeight": 115
    },
    {
      "id": "outpost-relaxation-pod-b",
      "type": "relaxationBed",
      "label": "温熱リラクゼーションポッド",
      "effectLabel": "加速 1.35・12秒",
      "effectKind": "relaxation",
      "effectAmount": 1.35,
      "effectDurationMs": 12000,
      "x": 4238,
      "y": 2538,
      "room": "greenhouse",
      "interactive": true,
      "integrated": true,
      "cooldownMs": 30000,
      "useRange": 160,
      "visualWidth": 180,
      "visualHeight": 115
    },
    {
      "id": "outpost-relaxation-tea",
      "type": "hydration",
      "label": "温製ハーブティー",
      "effectLabel": "スタミナ +100",
      "effectKind": "stamina",
      "effectAmount": 100,
      "x": 3925,
      "y": 2769,
      "room": "greenhouse",
      "interactive": true,
      "integrated": true,
      "cooldownMs": 18000,
      "useRange": 160,
      "visualWidth": 90,
      "visualHeight": 105
    },
    {
      "id": "outpost-relaxation-sofa",
      "type": "sofa",
      "label": "ひだまりソファ",
      "effectLabel": "再使用待機 -6秒",
      "effectKind": "cooldownReduction",
      "effectAmount": 6000,
      "x": 3813,
      "y": 2269,
      "room": "greenhouse",
      "interactive": true,
      "integrated": true,
      "cooldownMs": 30000,
      "useRange": 160,
      "visualWidth": 180,
      "visualHeight": 115
    }
  ],
  "vents": [
    {
      "id": "vent-labs",
      "x": 1300,
      "y": 863,
      "links": [
        "vent-hub",
        "vent-power"
      ]
    },
    {
      "id": "vent-hub",
      "x": 2813,
      "y": 1913,
      "links": [
        "vent-labs",
        "vent-drill",
        "vent-garden"
      ]
    },
    {
      "id": "vent-drill",
      "x": 4375,
      "y": 850,
      "links": [
        "vent-hub"
      ]
    },
    {
      "id": "vent-power",
      "x": 1325,
      "y": 2813,
      "links": [
        "vent-labs",
        "vent-garden"
      ]
    },
    {
      "id": "vent-garden",
      "x": 4375,
      "y": 2813,
      "links": [
        "vent-hub",
        "vent-power"
      ]
    }
  ],
  "cameras": [
    {
      "id": "cam-labs",
      "label": "分析・合成研究室",
      "x": 1475,
      "y": 875,
      "range": 525
    },
    {
      "id": "cam-hub",
      "label": "研究統合ロビー",
      "x": 2375,
      "y": 1075,
      "range": 575
    },
    {
      "id": "cam-drill",
      "label": "量子物性研究室",
      "x": 3275,
      "y": 875,
      "range": 525
    },
    {
      "id": "cam-relax",
      "label": "リラクゼーションラウンジ",
      "x": 3275,
      "y": 2213,
      "range": 525
    }
  ],
  "doors": [
    {
      "id": "door-labs",
      "label": "分析区画扉",
      "orientation": "vertical",
      "x": 1478,
      "y": 813,
      "w": 70,
      "h": 150
    },
    {
      "id": "door-drill",
      "label": "量子区画扉",
      "orientation": "vertical",
      "x": 3203,
      "y": 813,
      "w": 70,
      "h": 150
    },
    {
      "id": "door-hub-north",
      "label": "中央北扉",
      "orientation": "horizontal",
      "x": 2300,
      "y": 978,
      "w": 150,
      "h": 70
    },
    {
      "id": "door-hub-south",
      "label": "中央南扉",
      "orientation": "horizontal",
      "x": 2300,
      "y": 2053,
      "w": 150,
      "h": 70
    },
    {
      "id": "door-power",
      "label": "生体区画扉",
      "orientation": "vertical",
      "x": 1478,
      "y": 2138,
      "w": 70,
      "h": 150
    },
    {
      "id": "door-garden",
      "label": "休養区画扉",
      "orientation": "vertical",
      "x": 3203,
      "y": 2138,
      "w": 70,
      "h": 150
    }
  ],
  "sourceTexture": "assets/generated/field-lumina-laboratory-v458.webp",
  "sourceWidth": 3800,
  "sourceHeight": 2480,
  "worldScale": 1.25,
  "expandedScale": 1.25,
  "runtimePixelsPerWorldUnit": 0.8,
  "assetRevision": "v497-uniform-world-scale-1-25"
});

(function exposeDvaEconomyCatalog(root, factory) {
  const catalog = factory();
  if (typeof module === "object" && module?.exports) module.exports = catalog;
  if (root) root.DVAEconomyCatalog = catalog;
})(typeof globalThis === "object" ? globalThis : this, () => {
  "use strict";

  const COOLDOWN_MS_PER_CREDIT = 5_000;
  const creditIncome = Object.freeze({
    passiveIntervalMs: 10_000,
    passiveReward: 1,
    taskReward: 2,
    sabotageReward: 2,
    cacheReward: 3,
    quantumMercuryReward: 100,
    quantumLeadReward: 100,
    goldInstantReward: 100,
    mysteryJackpot: 6,
    donationCost: 1,
    hackerDuplicateBonus: 2
  });

  const categories = Object.freeze([
    Object.freeze({ id: "generate-supply", label: "生成・物資", defaultCooldownPerCredit: COOLDOWN_MS_PER_CREDIT }),
    Object.freeze({ id: "instant-item", label: "即席アイテム", defaultCooldownPerCredit: COOLDOWN_MS_PER_CREDIT }),
    Object.freeze({ id: "weapon", label: "武器", defaultCooldownPerCredit: COOLDOWN_MS_PER_CREDIT }),
    Object.freeze({ id: "generate-tech", label: "生成・技術", defaultCooldownPerCredit: COOLDOWN_MS_PER_CREDIT })
  ]);

  // One credit is the price of the least expensive product. Every other price
  // is a relative gameplay-value unit. Hacker CT uses the same five seconds per
  // credit for every shared product, so price changes cannot drift from CT.
  const rows = [
    ["mineral-water", "ミネラルウォーター", 1, "generate-supply", "mineral-water", "mineral-water"],
    ["antidote", "解毒剤", 2, "generate-supply", "antidote", "antidote"],
    ["molotov", "火炎瓶", 4, "generate-supply", "molotov", "molotov"],
    ["evade", "回避拡張", 4, "instant-item", "vending-evade", "instant-evade"],
    ["speed", "アクセラレート飲料", 5, "instant-item", "vending-speed", "instant-speed"],
    ["warp", "テレポートマップスクロール", 3, "instant-item", "warp", "warp"],
    ["mystery", "ミステリー", 4, "instant-item", "vending-mystery", "instant-mystery"],
    ["fire", "火遁の術", 8, "instant-item", "fire", "fire"],
    ["substitution", "変わり身の術", 8, "instant-item", "substitution", "substitution"],
    ["grit", "踏ん張り", 5, "instant-item", "grit", "grit"],
    ["heal", "回復", 4, "instant-item", "heal", "heal"],
    ["reason", "押し込み", 5, "instant-item", "reason", "reason"],
    ["mana", "マナポーション", 3, "instant-item", "vending-mana", "mana"],
    ["stamina", "スタミナ", 6, "instant-item", "stamina", "stamina"],
    ["hsg", "HSG", 8, "weapon", "hsg", "hsg"],
    ["railgun", "レールガン", 13, "weapon", "vending-railgun", "railgun"],
    ["particle-cannon", "荷電粒子砲", 16, "weapon", "vending-particle-cannon", "particle-cannon"],
    ["excalibur", "エクスカリバー", 19, "weapon", "vending-excalibur", "excalibur"],
    ["exile", "亡命", 22, "instant-item", "vending-exile", "exile"],
    ["computer", "パソコン", 10, "instant-item", "vending-computer", "computer"],
    ["handgun", "ハンドガン", 3, "weapon", "vending-handgun", "handgun"],
    ["smg", "サブマシンガン", 5, "weapon", "vending-smg", "smg"],
    ["assault", "アサルトライフル", 7, "weapon", "vending-assault", "assault"],
    ["sniper", "スナイパーライフル", 10, "weapon", "vending-sniper", "sniper"],
    ["taser", "テーザー銃", 5, "weapon", "vending-taser", "taser"],
    ["mercury", "水銀瓶", 3, "generate-supply", "mercury", "quantum-mercury"],
    ["lead", "鉛瓶", 1, "generate-supply", "lead", "quantum-lead"],
    ["uranium", "ウラン容器", 12, "generate-supply", "uranium", "quantum-uranium"],
    ["plutonium", "プルトニウム容器", 15, "generate-supply", "plutonium", "quantum-plutonium"],
    ["orichalcum-sword", "オリハルコン・ソード", 17, "weapon", "orichalcum-sword", "orichalcum-sword"],
    ["iai", "居合", 9, "instant-item", "iai", "iai"],
    ["ice", "氷結水", 2, "generate-supply", "vending-ice", "ice", "root-only"],
    ["heated-water", "高温水", 2, "generate-supply", "vending-heated-water", "heated-water", "root-only"],
    ["gold", "金", 4, "instant-item", "gold", "gold", "root-only"],
    ["rpg", "RPG", 14, "weapon", "vending-rpg", "rpg"],
    ["missile", "ミサイル", 17, "weapon", "vending-missile", "missile"]
  ];

  const products = Object.freeze(rows.map(([id, label, price, category, hackerRecipeId, asset, availability = "shared"]) =>
    Object.freeze({
      id,
      label,
      price,
      category,
      hackerRecipeId,
      cooldownPerCredit: COOLDOWN_MS_PER_CREDIT,
      asset,
      availability,
      vendingAvailable: availability === "shared",
      hackerAccess: availability === "root-only" ? "root" : "ordinary"
    })
  ));
  const categoryById = new Map(categories.map((entry) => [entry.id, entry]));
  const productById = new Map(products.map((entry) => [entry.id, entry]));
  const productByRecipeId = new Map(products.map((entry) => [entry.hackerRecipeId, entry]));
  const productCosts = Object.freeze(Object.fromEntries(products.filter((entry) => entry.vendingAvailable).map((entry) => [entry.id, entry.price])));
  const productLabels = Object.freeze(Object.fromEntries(products.map((entry) => [entry.id, entry.label])));
  const vendingProducts = Object.freeze(products.filter((entry) => entry.vendingAvailable));
  const ordinaryHackerProducts = Object.freeze(products.filter((entry) => entry.hackerAccess === "ordinary"));

  const product = (itemId) => productById.get(String(itemId || "")) || null;
  const productForRecipe = (recipeId) => productByRecipeId.get(String(recipeId || "")) || null;
  const categoryForProduct = (itemId) => product(itemId)?.category || "generate-supply";
  const cooldownForRecipe = (recipeId) => {
    const entry = productForRecipe(recipeId);
    if (!entry) return 0;
    const fallback = Number(categoryById.get(entry.category)?.defaultCooldownPerCredit) || COOLDOWN_MS_PER_CREDIT;
    return Math.max(1_000, Math.round(entry.price * (Number(entry.cooldownPerCredit) || fallback)));
  };

  return Object.freeze({
    version: "physical-hsg-contribution-ranking-v514",
    cooldownMsPerCredit: COOLDOWN_MS_PER_CREDIT,
    creditIncome,
    categories,
    products,
    vendingProducts,
    ordinaryHackerProducts,
    productCosts,
    productLabels,
    product,
    productForRecipe,
    categoryForProduct,
    cooldownForRecipe
  });
});
const DVA_ECONOMY = globalThis.DVAEconomyCatalog;
const CREDIT_ECONOMY = DVA_ECONOMY.creditIncome;

function vendingProductOrThrow(itemId) {
  const product = DVA_ECONOMY.product(itemId);
  if (!product) throw new Error(`Unknown shared economy product: ${itemId}`);
  return product;
}

function vendingPrice(itemId) {
  return vendingProductOrThrow(itemId).price;
}

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");
function renderCapacityStatus() {
  return {
    available: true,
    renderCapacity: "available",
    source: "reachable-matchmaking-service"
  };
}

const MIN_KILL_COOLDOWN = 5;
const QUICK_ATTACK_DELAY_MS = 1000;
const QUICK_FOLLOW_UP_COOLDOWN_MS = 1000;
const QUICK_ATTACK_LETHAL_CHANCE = 0.45;
const NINJUTSU_DURATION_MS = 5000;
const AIM_HOLD_MS = 5000;
const AIM_TARGET_MOVE_TOLERANCE = 1;
const ACCELERATE_SPEED_MULTIPLIER = 2.5;
const LUMINOUS_SPEED_MULTIPLIER = ACCELERATE_SPEED_MULTIPLIER * 0.66;
const DODGE_DURATION_MS = 1000;
const TELEPORT_COOLDOWN_MS = 25_000;
const SMARTPHONE_ACTION_MS = 4_000;
const AUTO_REPORT_POST_KILL_GRACE_MS = 4_000;
const PAIR_ROUTE_RADIUS = 82;
const PAIR_ROUTE_GRACE_MS = 5_000;
const PAIR_ROUTE_DAMAGE_INTERVAL_MS = 3_000;
const TASK_STAMINA_REQUIREMENT = 200;
const AUTO_TASK_INTERVAL_MS = 2_500;
const AUTO_TASK_PRESENCE_MS = 1800;
const HACKER_AUTO_TASK_INTERVAL_MS = 12_000;
const PREPARATION_PHASE_MS = 5_000;
const GUNNER_RELOAD_MS = 2_200;
const GUNNER_IDLE_AUTO_RELOAD_DELAY_MS = 2_600;
const GUNNER_SPECIAL_AMMO_INTERVAL_MS = 18_000;
const GUNNER_SPECIAL_AMMO_TYPES = Object.freeze(["weak", "shock"]);
const GUNNER_SPECIAL_AMMO_LABELS = Object.freeze({
  weak: "ウィーク",
  shock: "ショック"
});
const GUNNER_SHOCK_SLOW_MS = 6_000;
const GUNNER_SHOCK_LOW_LUCK_THRESHOLD = 0;
const DEFAULT_GUNNER_WEAPON = "assault";
const GUNNER_WEAPON_ORDER = ["handgun", "smg", "assault", "sniper", "taser"];
const GUNNER_WEAPONS = Object.freeze({
  handgun: Object.freeze({
    id: "handgun", name: "ハンドガン", shortName: "HG", maxAmmo: 12, ammoPerShot: 1,
    range: 520, lineWidth: 58, damage: 0.48, minDamageRatio: 0.65, cooldownMs: 380,
    manaCost: 0, lethalChance: 0, soundDistance: 1500, volume: 0.72
  }),
  smg: Object.freeze({
    id: "smg", name: "サブマシンガン", shortName: "SMG", maxAmmo: 30, ammoPerShot: 1,
    range: 460, lineWidth: 78, damage: 0.42, minDamageRatio: 0.28, cooldownMs: 100,
    manaCost: 0, lethalChance: 0, soundDistance: 2200, volume: 1
  }),
  assault: Object.freeze({
    id: "assault", name: "アサルトライフル", shortName: "AR", maxAmmo: 18, ammoPerShot: 1,
    range: 760, lineWidth: 46, damage: 0.58, minDamageRatio: 0.80, cooldownMs: 240,
    manaCost: 0, lethalChance: 0, soundDistance: 2400, volume: 0.95
  }),
  sniper: Object.freeze({
    id: "sniper", name: "スナイパーライフル", shortName: "SR", maxAmmo: 5, ammoPerShot: 1,
    range: 1200, lineWidth: 22, damage: 1.35, minDamageRatio: 1, cooldownMs: 1100,
    manaCost: 0, scopeMs: 0, lethalChance: 0, soundDistance: 3200, volume: 1.15
  }),
  taser: Object.freeze({
    id: "taser", name: "テーザー銃", shortName: "TSR", maxAmmo: 8, ammoPerShot: 1,
    range: 420, lineWidth: 62, damage: 0.16, minDamageRatio: 0.72, cooldownMs: 720,
    manaCost: 0, lethalChance: 0, slowMs: 6000,
    movementScale: 0.65, soundDistance: 1200, volume: 0.55
  })
});
const FLORA_COOLDOWN_MS = 30_000;
const FLORA_SELF_EFFECT_RADIUS = 110;
const FLORA_SPEED_MULTIPLIER = ACCELERATE_SPEED_MULTIPLIER * 0.72;
const FLORA_SPEED_DURATION_MS = 12_000;
const MAX_STAMINA = 100;
const MAX_STORED_STAMINA = 500;
const REMOTE_REPAIR_STAMINA_COST = 300;
const SLEEP_REGEN_MULTIPLIER = 4;
const DEFAULT_MOVEMENT_SPEED_MULTIPLIER = 0.48;
const FIXED_MOVEMENT_ACC = 2;
const NORMAL_MOVEMENT_ACC = 1;
const MOVEMENT_ACC_ACTIVATION_THRESHOLD = 2;
const DASH_MULTIPLIER = 1.75;
const DASH_DRAIN_PER_SECOND = 42;
const WALK_DRAIN_PER_SECOND = 9;
const SLOW_WALK_DRAIN_PER_SECOND = 1.2;
const STAMINA_REGEN_PER_SECOND = 19;
const LEVITATION_MANA_DRAIN_PER_SECOND = 0.04;
// Full-SP overflow restores about 0.127 MP/s. Clairvoyance must still have a
// meaningful net cost while leaving Renki and field recovery as viable fuel.
const CLAIRVOYANCE_MANA_DRAIN_PER_SECOND = 0.25;
const JUMP_BASE_DISTANCE = 120;
const JUMP_DISTANCE_PER_PREPARE_MS = 0.9;
const JUMP_BASE_COST = 24;
const JUMP_DISTANCE_COST = 0.14;
const DRONE_SPEED_MULTIPLIER = 3.4;
const DRONE_ALTITUDE_MAX = 2;
const TASK_CREDIT_REWARD = CREDIT_ECONOMY.taskReward;
const SABOTAGE_CREDIT_REWARD = CREDIT_ECONOMY.sabotageReward;
const PASSIVE_CREDIT_INTERVAL_MS = CREDIT_ECONOMY.passiveIntervalMs;
const PASSIVE_CREDIT_REWARD = CREDIT_ECONOMY.passiveReward;
const SABOTAGE_COOLDOWN_MS = 45_000;
const SLOW_WALK_MULTIPLIER = 0.52;
const EMP_RANGE = 260;
const EMP_COOLDOWN_MS = 18_000;
const EMP_SLOW_DURATION_MS = 5_000;
const EMP_SLOW_MULTIPLIER = 0.55;
const TASER_MOVEMENT_MULTIPLIER = 0.65;
const EMP_INITIAL_LOCK_MS = 15_000;
const HACKER_EMP_OPENING_PROTECTION_MS = 30_000;
const HSG_BASE_DURATION_MS = 8_000;
const HSG_BASE_ACC_MULTIPLIER = 1.8;
const HSG_ENHANCE_DURATION_MS_PER_LEVEL = 2_000;
const HSG_ENHANCE_ACC_PER_LEVEL = 0.2;
const HSG_ACTIVATION_COOLDOWN_MS = 20_000;
const HACKER_INVENTION_LABELS = Object.freeze({
  railgun: "レールガン",
  "particle-cannon": "荷電粒子砲",
  excalibur: "エクスカリバー"
});
const HEAVY_WEAPON_DEFINITIONS = Object.freeze({
  rpg: Object.freeze({ id: "rpg", label: vendingProductOrThrow("rpg").label, cost: vendingPrice("rpg"), asset: "rpg" }),
  missile: Object.freeze({ id: "missile", label: vendingProductOrThrow("missile").label, cost: vendingPrice("missile"), asset: "missile" })
});
const HACKER_ROOT_OPERATOR_TYPES = Object.freeze(["fighter", "gravity", "flora", "gunner", "quantum"]);
const HACKER_ROOT_HEALTH = 0.0001;
const HACKER_ACTION_STAMINA_COST = 5;
const FIGHTER_SLASH_STAMINA_COST = 75;
const FIGHTER_SLASH_GUARD_DURATION_MS = 700;
const FIGHTER_SLASH_PERFECT_GUARD_MS = 140;
const FIGHTER_SLASH_PERFECT_REARM_MS = 1_100;
const FIGHTER_ENERGY_CHARGE_MANA_COST = 1;
const FIGHTER_IAI_REWARD_THRESHOLD = 25;
const FIGHTER_INFINITE_RESOURCE_THRESHOLD = 50;
const FIGHTER_ENERGY_PASSIVE_INTERVAL_MS = 12_000;
const IAI_VENDING_COST = vendingPrice("iai");
const ORICHALCUM_SWORD_VENDING_COST = vendingPrice("orichalcum-sword");
const FIGHTER_SHOCKWAVE_RANGE = 950;
const FIGHTER_SHOCKWAVE_WIDTH = 70;
const FIGHTER_SHOCKWAVE_ORIGIN_OFFSET = 20;
const FIGHTER_THROW_SHOCKWAVE_RADIUS = 180;
const FIGHTER_GIANT_SHOCKWAVE_EC_COST = 100;
const FIGHTER_GIANT_SHOCKWAVE_RANGE = 1_900;
const FIGHTER_GIANT_SHOCKWAVE_WIDTH = 240;
const FIGHTER_GIANT_SHOCKWAVE_DURATION_MS = 1_150;
const HACKER_MANA_GPU_DRAIN_PER_SECOND = 0.025;
const HACKER_MANA_GPU_COOLDOWN_REDUCTION_MS_PER_MANA = 20_000;
const EXILE_COST = vendingPrice("exile");
const TASK_CONTRIBUTION = 0;
const EMP_INTERACTION_WINDOW_MS = 900;
const EMP_INTERACTION_RANGE = EMP_RANGE * 2;
const EMP_RESONANCE_LETHAL_RANGE = 110;
const EMP_RESONANCE_BODY_RANGE = EMP_RANGE;
const EMP_ITEM_LOCK_MS = 7_000;
const MAP_OBJECT_RANGE = 150;
const RESOLVE_POINT_USE_RANGE = 82;
const RESOLVE_POINT_CLEARANCE = 118;
const MAP_OBJECT_SPEED_MULTIPLIER = 1.35;
const LIMIT_BREAK_SPEED_MULTIPLIER = 3;
const LIMIT_BREAK_MANA_DRAIN_PER_SECOND = 0.08;
const FIRE_JUTSU_COST = vendingPrice("fire");
const FIRE_JUTSU_RADIUS = 240;
const ENHANCE_HOLD_STEP_MS = 600;
const ENHANCE_MAX_LEVEL = 4;
const ENHANCE_FIXED_MANA_COST = 1;
const GBO_HOLD_MS = ENHANCE_HOLD_STEP_MS * (ENHANCE_MAX_LEVEL + 1);
const GBO_FIXED_MANA_COST = 2;
const GBO_PERFORMANCE_MULTIPLIER = 10;
const FIGHTER_ENHANCE_SLASH_RANGE_PER_LEVEL = 40;
const FIGHTER_ENHANCE_SLASH_GUARD_MS_PER_LEVEL = 90;
const GUNNER_ENHANCE_DAMAGE_PER_LEVEL = 0.20;
const ITEM_THROW_BASE_DISTANCE = 220;
const ITEM_THROW_SPEED = 1120;
const ITEM_THROW_MIN_FLIGHT_MS = 240;
const ITEM_THROW_MAX_FLIGHT_MS = 920;
const BOTTLE_ITEM_IDS = new Set(["mercury", "lead", "mineral-water", "antidote", "molotov", "ice", "heated-water"]);
const BOTTLE_SHARD_BASE_RADIUS = 112;
const BOTTLE_SHARD_HIT_CHANCE = 0.32;
const BOTTLE_SHARD_MIN_DAMAGE = 0.18;
const BOTTLE_SHARD_MAX_DAMAGE = 0.42;
const RIGID_THROW_COLLISION_RADIUS = 42;
const RIGID_THROW_BLADE_SEVERITY = 0.82;
const GROUND_ITEM_PICKUP_RANGE = 92;
const HAZARD_FIELD_DURATION_MS = 12_000;
const HAZARD_TICK_MS = 1_000;
const POISON_DAMAGE_PER_TICK = 0.2;
const BURN_DAMAGE_PER_TICK = 0.25;
const NATURAL_RECOVERY_HP_PER_SECOND = 0.05;
const TOXIC_THROW_ITEM_IDS = new Set(["mercury", "lead", "uranium", "plutonium"]);
const GOLD_INSTANT_CREDITS = CREDIT_ECONOMY.goldInstantReward;
const QUANTUM_ACTION_STAMINA_COST = 8;
const QUANTUM_NUCLEAR_MANA_COST = 2;
const MINERAL_WATER_STAMINA = 100;
const MOLOTOV_COST = vendingPrice("molotov");
const MINERAL_WATER_COST = vendingPrice("mineral-water");
const ANTIDOTE_COST = vendingPrice("antidote");
const SUBSTITUTION_COST = vendingPrice("substitution");
const MYSTERY_COST = vendingPrice("mystery");
const MYSTERY_ABILITY_LOCK_MS = 15_000;
const MYSTERY_UNCONSCIOUS_MS = 8_000;
const DESIRE_RESOURCE_DEBT = -100;
const RATIONAL_MANA_THRESHOLD = 2;
const STARTING_MANA = RATIONAL_MANA_THRESHOLD;
const MANA_CONVERSION_AMOUNT = 1;
const STAMINA_TO_MANA_COST = 150;
const AUTO_MANA_TO_STAMINA_RESERVE = RATIONAL_MANA_THRESHOLD;
const AUTO_MANA_TO_STAMINA_THRESHOLD = 250;
const AUTO_MANA_TO_STAMINA_RATE_PER_SECOND = 30;
const DONATION_CREDIT_COST = CREDIT_ECONOMY.donationCost;
const DONATION_LUCK_GAIN = 0.05;
const DONATION_LUCK_MIN_BONUS = -0.7;
const DONATION_LUCK_MAX_BONUS = 0.7;
const ABILITY_MANA_COST = 1;
const DESIRE_BIAS_COST_MULTIPLIER = 1.5;
const DESIRE_BIAS_TIME_MULTIPLIER = 0.72;
const DESIRE_BIAS_LUCK_PENALTY = 0.45;
const DESIRE_BIAS_GROUP_RADIUS = 260;
const DESIRE_BIAS_GROUP_MULTIPLIER = 0.6;
const DESIRE_BIASES = Object.freeze([
  Object.freeze({ id: "cognitive-dissonance", label: "認知的不協和", detail: "移動・行動不能時間・クールタイム進行が72%になる" }),
  Object.freeze({ id: "confirmation-bias", label: "確証バイアス", detail: "幸運・直観が0.45低下する" }),
  Object.freeze({ id: "sunk-cost", label: "サンクコスト効果", detail: "マナとスタミナの消費量が1.5倍になる" }),
  Object.freeze({ id: "in-group-bias", label: "内集団バイアス", detail: "他者が近い間、移動速度とスタミナ回復が60%になる" })
]);
const RENKI_FOCUS_DURATION_MS = 3500;
const RATIONAL_FREE_ABILITY_INTERVAL_MS = 30_000;
const DODGE_MANA_COST = 0;
const TELEPORT_MANA_COST = 1;
const HEART_TELEPORT_MANA_COST = 10;
const DRONE_MANA_COST = 0;
const EMP_MANA_COST = 0;
const GUNNER_MANA_COST = 0;
const FLORA_MANA_COST = ABILITY_MANA_COST;
const ALCHEMY_MANA_COST = ABILITY_MANA_COST;
const SABOTAGE_MANA_COST = 0;
const STAND_FIRM_COST = vendingPrice("grit");
const HEAL_COST = vendingPrice("heal");
const PUSH_COST = vendingPrice("reason");
const PUSH_BACKLASH_DAMAGE_PER_CHARGE = 0.5;
const MANA_POTION_COST = vendingPrice("mana");
// Six minutes without donations. Passive income fully donated shortens this to
// about 5:30; six task rewards donated as well shorten it to about 5:00.
const IDEA_FIRST_ASPECT_MS = 50_000;
const IDEA_SECOND_ASPECT_MS = 120_000;
const IDEA_GOOD_MS = 220_000;
const IDEA_ASCENSION_MS = 360_000;
const IDEA_ASCENSION_ANIMATION_MS = 5_000;
const IDEA_LUCK_BASELINE = 0.3;
const IDEA_LUCK_MAX_TIME_REDUCTION_MS = 1_000;
const GOOD_SPEED_MULTIPLIER = ACCELERATE_SPEED_MULTIPLIER * 0.56;
const FLORA_AROMA_REGEN_MULTIPLIER = 1.75;
const SUNBEAM_RANGE = 950;
const SUNBEAM_WIDTH = 52;
const SUNBEAM_KILL_CHANCE = 0.48;
const GRAVITY_STORM_VISUAL_RADIUS = 520;
const GRAVITY_STORM_MANA_COST = 10;
const GRAVITY_STORM_DURATION_MS = 12_000;
const GRAVITY_STORM_PULSE_MS = 600;
const GRAVITY_STORM_BARRIER_RELEASE_MS = 1_000;
const GRAVITY_STORM_BARRIER_RADIUS = 140;
const GRAVITY_STORM_DAMAGE_MIN = 0.035;
const GRAVITY_STORM_DAMAGE_MAX = 0.095;
const GRAVITY_STORM_FINAL_DAMAGE_MIN = 0.55;
const GRAVITY_STORM_FINAL_DAMAGE_MAX = 1.15;
const GRAVITY_STORM_SLOW_MULTIPLIER_MIN = 0.35;
const GRAVITY_STORM_SLOW_MULTIPLIER_MAX = 0.82;
const GRAVITY_STORM_SLOW_LINGER_MS = 900;
const GRAVITY_STORM_PULL_MIN = 80;
const GRAVITY_STORM_PULL_MAX = 260;
const GRAVITY_STORM_PIN_MIN_MS = 420;
const GRAVITY_STORM_PIN_MAX_MS = 1_800;
const GRAVITY_TIME_DURATION_MS = 8_000;
const GRAVITY_TIME_SCALE_FAST = ACCELERATE_SPEED_MULTIPLIER;
const GRAVITY_TIME_SCALE_SLOW = 0.38;
const GRAVITY_TIME_KEEPER_DURATION_MS = 5_000;
const GRAVITY_TIME_KEEPER_MANA_COST = 50;
const BOT_HEARING_MEMORY_MS = 5000;
const BOT_STAND_FIRM_RETALIATION_MS = 30_000;
const BOT_KILL_WITNESS_RANGE = 340;
const BOT_ATTACKER_ISOLATION_RANGE = 430;
const BOT_BODY_NOTICE_RANGE = 760;
const BOT_VISIBLE_THROW_MEMORY_MS = 30_000;
const BOT_VISIBLE_POISON_ASSOCIATION_PADDING = 56;
const BOT_KILL_DECISION_TRACE_TTL_MS = 45_000;
const BOT_CLAIRVOYANCE_DURATION_MS = 4000;
const BOT_CLAIRVOYANCE_MEMORY_MS = 8000;
const BOT_CLAIRVOYANCE_INTERVAL_MIN_MS = 18_000;
const BOT_CLAIRVOYANCE_INTERVAL_JITTER_MS = 10_000;
const BOT_ATTACKER_CLAIRVOYANCE_INTERVAL_MIN_MS = 6_500;
const BOT_ATTACKER_CLAIRVOYANCE_INTERVAL_JITTER_MS = 3_500;
const BOT_ATTACKER_FAKE_TASK_TRAVEL_MS = 7_000;
const BOT_ATTACKER_FAKE_TASK_PRESENCE_MS = 1_350;
const BOT_ATTACKER_DECOY_PURSUIT_MS = 2_800;
const BOT_ATTACKER_COMMIT_MS = 6_200;
const MODERATION_DIR = path.join(__dirname, "data");
const MODERATION_FILE = path.join(MODERATION_DIR, "moderation.json");
const PLAYER_PROFILE_FILE = path.join(MODERATION_DIR, "player-profiles.json");
const CHECKPOINT_FILE = path.join(MODERATION_DIR, "checkpoints.json");
const CHECKPOINT_SESSIONS_FILE = path.join(MODERATION_DIR, "checkpoint-sessions.json");
const CHECKPOINT_ARCHIVE_FILE = path.join(MODERATION_DIR, "checkpoint-history.json");
const CHECKPOINT_ACTIVE_TIMEOUT_MS = 45_000;
const ANALYTICS_REMOTE_URL = String(
  process.env.ANALYTICS_REMOTE_URL ||
  "https://raw.githubusercontent.com/player13579/-/analytics-data/data/checkpoint-history.json"
).trim();
const ANALYTICS_REMOTE_TOKEN = String(process.env.ANALYTICS_REMOTE_TOKEN || "").trim();
const ANALYTICS_REMOTE_WRITE_URL = String(process.env.ANALYTICS_REMOTE_WRITE_URL || (() => {
  const match = ANALYTICS_REMOTE_URL.match(/^https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)$/);
  return match ? `https://api.github.com/repos/${match[1]}/${match[2]}/contents/${match[4]}?ref=${encodeURIComponent(match[3])}` : "";
})()).trim();
const PROFILE_REMOTE_URL = String(
  process.env.PROFILE_REMOTE_URL ||
  "https://raw.githubusercontent.com/player13579/player13579.github.io/Codex-honoo/runtime-data/player-profiles.json"
).trim();
const PROFILE_REMOTE_WRITE_URL = String(process.env.PROFILE_REMOTE_WRITE_URL || (() => {
  const match = PROFILE_REMOTE_URL.match(/^https:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)$/);
  return match ? `https://api.github.com/repos/${match[1]}/${match[2]}/contents/${match[4]}?ref=${encodeURIComponent(match[3])}` : "";
})()).trim();
const RESERVED_DEVELOPER_NAME = "プレイヤー";
const DEVELOPER_CANONICAL_PROFILE_ID = "dfc48197c51d6b2a02fc8a7c";
const DEFAULT_DEVELOPER_PROFILE_IDS = [
  DEVELOPER_CANONICAL_PROFILE_ID,
  crypto.createHash("sha256").update("ip-profile:127.0.0.1").digest("hex").slice(0, 24),
  crypto.createHash("sha256").update("ip-profile:::1").digest("hex").slice(0, 24)
];
const DEVELOPER_PROFILE_IDS = new Set([
  ...DEFAULT_DEVELOPER_PROFILE_IDS,
  ...String(process.env.DEVELOPER_PROFILE_IDS || "").split(",").map((value) => value.trim()).filter(Boolean)
]);
const BOT_TICK_MS = 80;
const NAV_CELL_SIZE = 48;
const BOT_PATH_REFRESH_MS = 420;
const REALTIME_STATE_INTERVAL_MS = 100;
const PLICY_REALTIME_STATE_INTERVAL_MS = 220;
const ROOM_TTL_MS = 1000 * 60 * 60 * 4;
const OPERATOR_SELECT_MS = 45_000;
const MOVEMENT_MAX_ELAPSED_SECONDS = 1.5;
const MOVEMENT_INTEGRATION_STEP_SECONDS = 1 / 60;
const DEFAULT_ONLINE_BOT_COUNT = 7;
const MAP_SCALE = 2;
const WALKABLE_SEAM_MARGIN = 32;
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg"
};

const COLORS = [
  "#ef4444",
  "#2563eb",
  "#22c55e",
  "#f59e0b",
  "#a855f7",
  "#06b6d4",
  "#f97316",
  "#84cc16",
  "#ec4899",
  "#94a3b8"
];
const PLAYER_SKINS = new Set(["hood", "blue-dress"]);

const TASK_LABELS = {
  download: "Download",
  upload: "Upload"
};

const DEFAULT_SETTINGS = {
  mapId: "station",
  hostTeam: "random",
  attackerCount: 1,
  taskCount: 18,
  killCooldown: 18,
  killRange: 120,
  discussionTime: 0,
  votingTime: 300,
  anonymousVotes: true,
  confirmEjects: false,
  emergencyLimit: 1
};

const OPERATORS = {
  defender: [
    {
      id: "operator-fighter",
      role: "defender",
      name: "ファイター",
      special: "fighter",
      limit: 99,
      asset: "fighter",
      description: "EC、キルカウンター、リミットブレイクと、初期装備のオリハルコン・ソードを併せ持つ。",
      details: "12秒ごとに1MPを自動消費してECを1増やす。ECは衝撃波へ放出するエネルギーそのもので、別枠の衝撃波残弾は存在しない。オリハルコン・ソードの使用または投擲で通常衝撃波を1発発生させるたび現在ECを1放出する。衝撃波はオリハルコン・ソードの通常ガード対象だが、ジャストガード判定と反射は発生しない。初めてEC25へ到達すると即席の居合を1回獲得する。居合は押し込みの上位に当たる自動効果で、次の成功攻撃を破壊（死体あり）へ強化する。失敗・回避・ガード・準備バリア・非攻撃では消費せず、既に消滅する攻撃は死体なしのまま維持する。初めてEC50へ到達した後は現在ECを消費してもMP・SP・HP・踏ん張りが無限になり、リミットブレイクの被確殺デメリットが解除され、オリハルコン・ソードの斬るが常時消滅となって敵の死体を残さず、対象となる攻撃へのジャストガード成功時は全攻撃を反射する。斬るはファイターのパッシブではなく、オリハルコン・ソードを所持して使用したときに発動する武器行動である。通常の斬るは確殺で死体を残し、斬れそうな物理攻撃をガードし、短いジャストガードで攻撃元へ反射する。ファイターの初期装備「オリハルコン・ソード」の腹は、受けた衝撃を100%そのまま反発させる金属でできており、攻撃へ正確に合わせたとき、この性質によってジャストガード反射が成立する。オリハルコン・ソードは通常使用と投擲ができる武器アイテムで、ファイターは開始時に1振り所持する。100SPの回避で確殺を無効化した時だけ、キルカウンターで攻撃者を即時キルする。Hのリミットブレイクは発動ごとにHPを1消費してSPと加速を3倍ずつ重ね、マナが尽きるまで永続する。会議中は能力と残り時間が停止し、終了後にそのまま再開する。オーバーヒールはアドレナリン受容体を増やして肉体を強固にするため、HPが残る限り連続発動しても肉体は崩壊しない。"
    },
    {
      id: "defender-teleport",
      role: "defender",
      name: "グラビティ",
      special: "teleport",
      limit: 99,
      asset: "teleport",
      description: "重力と時空を操作し、転移・時間加減速・浮揚・重力嵐を扱う。",
      details: "重力による時空の曲率を操作するオペレーター。転移は1MPを消費し、他人の付近へ自分を移動する。心臓転移は10MPを消費して対象を遠隔確殺する。アクセラレートとディーセラレートは1MPで8秒間、対象の行動時間を相対変化させる。理知中はリビテーションで床のない場所も移動できる。グラビティストームは10MPを消費し、指定地点へ全域の敵を12秒間吸引して継続ダメージと減速・拘束を与える。発動者には最後の1秒を除いてバリアが発生する。"
    },
    {
      id: "defender-flora",
      role: "defender",
      name: "フローラ",
      special: "flora",
      limit: 99,
      asset: "flora",
      description: "回復とサンビームを切り替え、水・草木・木漏れ日の力を操る。",
      details: "回復は自分へHP・スタミナ・状態解除・加速を付与する。サンビームは選択対象へ黄色系の強い貫通光を放ち、通常時は交差した複数対象へ確率キル、収束時は交差した全対象を確殺する。理知中はアロマにより自分のスタミナ回復を速める。"
    },
    {
      id: "operator-quantum-control",
      role: "defender",
      name: "クオンタム",
      special: "quantum",
      limit: 99,
      asset: "quantum",
      description: "運動エネルギー制御・核変換・核分裂を使い分け、所持素材へ自動適用する。",
      details: "水銀・鉛・ウラン・プルトニウムを所持して開始する。運動エネルギー制御は加速か減速へ分岐し、所持している水を高温水か氷へ変える。核変換は所持している鉛か水銀を金へ変え、金の共通取得処理で100Cへ即時換金する。核分裂は所持しているウランかプルトニウムへ2MPで作用し、既存の核爆弾と同じ破壊効果を起こす。対象素材がなければ何も起きない。"
    }
  ],
  attacker: [
    {
      id: "attacker-gunner",
      role: "attacker",
      name: "ガンナー",
      special: "gunner",
      limit: 99,
      asset: "gunner",
      description: "ARとエイム・特殊弾装填パッシブ、物理HSGを持ち、5種の銃器を扱う。",
      details: "HG・SMG・AR・SR・テーザーを使用できる。SR固有の常時確殺はなく、通常時は1.35ダメージ。理知中かつダッシュ以外の移動状態ではパッシブ『エイム』が選択銃の射程内で遮蔽物越しでない最寄りの生存者を自動追尾し、追尾中の全射撃をHS確殺にする。正規movementModeがダッシュになると即解除され、手動ボタン・追尾移動はない。射撃はマナを消費せず、テーザーは6秒間の移動速度低下を付与する。全攻撃は生成遮蔽物を貫通する。パッシブ『特殊弾装填』は理知中に18秒ごと、選択中の銃へウィークまたはショックを1マガジン獲得し、非装填分も正規バッファへ保持して武器切替時に再適用する。開始装備の物理HSGはStorageに入り、足場上から足場のない場所へ進む直前に自動起動して通常8秒間の浮揚とACC 1.8を付与する。通常投擲は接地後に回収でき、譲渡・死亡時戦利品移動も可能。HSGを含む最後の浮揚が床のない場所で終了すると落下死する。起動から20秒のクールタイム中は再起動・延長・累積・リセット・準備変更できない。GBOはガンナー固有パッシブではなく、全員が所持武具へ使える共通長押しactionである。"
    },
    {
      id: "attacker-assassin",
      role: "attacker",
      name: "アサシン",
      special: "assassin",
      limit: 99,
      asset: "assassin",
      description: "共有忍殺を死体の残らない消滅へ変え、移動状態を問わず足音を一切発しない。",
      details: "忍殺の5秒静止、距離、対象喪失、防御、クールタイムの規則は共有忍殺と同じ。成功時は「アサシン忍殺による消滅」として対象を消滅させ、死体・通報対象・死体由来マーカーを残さない。歩行、ダッシュ、無音歩行のいずれでも足音イベントを発生させず、敵Botにも足音由来の観測情報を与えない。"
    },
    {
      id: "attacker-alchemist",
      role: "attacker",
      name: "ハッカー",
      special: "alchemist",
      limit: 99,
      asset: "hacker",
      description: "仮想訓練世界をバイブコーディングし、資源・物体・能力・状態を書き換える。",
      details: "バイブコーディングで資源、所持品、永続オブジェクト、オペ能力を生成する。共有商品はMP消費0、最終CTは自販機価格1Cにつき5秒で名称横へ表示する。対象のクレジット・アイテム・HP・マナは削除または増殖できる。Hのroot化は踏ん張り・変わり身などの確殺無効アイテムを所持したままROOT中だけ無効化し、自身へダメージを与えてHPを0.0001にした後、他オペレーターの能力を借用可能にする。ROOT解除後は保持していた確殺無効アイテムが再び有効になる。root化は低HPで自動発動しない。マナGPUは毎秒0.025MPを短縮クールへ変換し、1MPにつき20秒を上限なく蓄積して次の生成に使う。ハックで他人の位置を把握し、タスクを時間経過で自動完了する。手動タスクも可能で、自身のスマホはハッキングされない。"
    }
  ]
};

const ITEM_DEFINITIONS = Object.freeze({
  "orichalcum-sword": Object.freeze({ id: "orichalcum-sword", label: "オリハルコン・ソード", asset: "orichalcum-sword", throwable: true, weapon: true, reusable: true }),
  hsg: Object.freeze({ id: "hsg", label: "HSG", asset: "hsg", throwable: true, usable: true, reusable: true }),
  mercury: Object.freeze({ id: "mercury", label: "水銀瓶", asset: "quantum-mercury", throwable: true }),
  lead: Object.freeze({ id: "lead", label: "鉛瓶", asset: "quantum-lead", throwable: true }),
  uranium: Object.freeze({ id: "uranium", label: "ウラン容器", asset: "quantum-uranium", throwable: true }),
  plutonium: Object.freeze({ id: "plutonium", label: "プルトニウム容器", asset: "quantum-plutonium", throwable: true }),
  "mineral-water": Object.freeze({ id: "mineral-water", label: "ミネラルウォーター", asset: "mineral-water", throwable: true }),
  antidote: Object.freeze({ id: "antidote", label: "解毒剤", asset: "antidote", throwable: true }),
  molotov: Object.freeze({ id: "molotov", label: "火炎瓶", asset: "molotov", throwable: true }),
  ice: Object.freeze({ id: "ice", label: "氷結水", asset: "quantum-ice", throwable: true, transformed: true }),
  "heated-water": Object.freeze({ id: "heated-water", label: "高温水", asset: "quantum-heated-water", throwable: true, transformed: true })
});

const INSTANT_ITEM_DEFINITIONS = Object.freeze({
  grit: Object.freeze({ id: "grit", label: "踏ん張り", field: "gritCharges", automatic: true }),
  reason: Object.freeze({ id: "reason", label: "押し込み", field: "reasonCharges", automatic: true }),
  iai: Object.freeze({ id: "iai", label: "居合", field: "iaiCharges", asset: "iai", automatic: true }),
  gold: Object.freeze({ id: "gold", label: "金", automatic: true }),
  computer: Object.freeze({ id: "computer", label: "パソコン", field: "computerActive", automatic: true }),
  stamina: Object.freeze({ id: "stamina", label: "スタミナ", automatic: true })
});

const QUANTUM_STARTING_ITEMS = Object.freeze({ mercury: 1, lead: 1, uranium: 1, plutonium: 1 });

function createItemInventory(seed = {}) {
  const inventory = {};
  for (const [itemId, amount] of Object.entries(seed || {})) {
    if (!ITEM_DEFINITIONS[itemId]) continue;
    const count = Math.max(0, Math.floor(Number(amount) || 0));
    if (count > 0) inventory[itemId] = count;
  }
  return inventory;
}

function itemCount(player, itemId) {
  return Math.max(0, Math.floor(Number(player?.itemInventory?.[itemId]) || 0));
}

function addItem(player, itemId, amount = 1) {
  if (!ITEM_DEFINITIONS[itemId]) throw new ApiError(400, "不明なアイテムです。");
  player.itemInventory ||= {};
  const next = itemCount(player, itemId) + Math.max(0, Math.floor(Number(amount) || 0));
  if (next > 0) player.itemInventory[itemId] = next;
  else delete player.itemInventory[itemId];
  return next;
}

function consumeItem(player, itemId, amount = 1) {
  const count = Math.max(1, Math.floor(Number(amount) || 1));
  if (itemCount(player, itemId) < count) throw new ApiError(400, `${ITEM_DEFINITIONS[itemId]?.label || itemId}を所持していません。`);
  const next = itemCount(player, itemId) - count;
  if (next > 0) player.itemInventory[itemId] = next;
  else delete player.itemInventory[itemId];
  return next;
}

const SOLO_MISSIONS = Object.freeze({
  movement: Object.freeze({
    id: "movement",
    name: "機動・タスク訓練",
    objective: "自分でタスクを1件完了する",
    team: "defender",
    operatorId: "operator-fighter",
    botCount: 3,
    attackerCount: 1,
    taskCount: 6,
    metric: "task"
  }),
  combat: Object.freeze({
    id: "combat",
    name: "ガンナー射撃訓練",
    objective: "ディフェンダーを1人排除する",
    team: "attacker",
    operatorId: "attacker-gunner",
    botCount: 3,
    attackerCount: 1,
    taskCount: 6,
    metric: "kill"
  }),
  defense: Object.freeze({
    id: "defense",
    name: "回避・反撃訓練",
    objective: "回避を発動し、15秒間生存する",
    team: "defender",
    operatorId: "operator-fighter",
    botCount: 3,
    attackerCount: 1,
    taskCount: 6,
    metric: "defense",
    surviveMs: 15_000
  }),
  intel: Object.freeze({
    id: "intel",
    name: "千里眼・攪乱訓練",
    objective: "画面外へ投擲し、サボタージュを起動する",
    team: "attacker",
    operatorId: "attacker-alchemist",
    botCount: 3,
    attackerCount: 1,
    taskCount: 6,
    metric: "intel"
  }),
  emp: Object.freeze({
    id: "emp",
    name: "EMP打ち消し・増強訓練",
    objective: "停止BotのEMPへ逆位相で打ち消し、同位相で増強する",
    team: "defender",
    operatorId: "operator-fighter",
    botCount: 1,
    attackerCount: 1,
    taskCount: 6,
    metric: "emp"
  }),
  "cpu-gravity": Object.freeze({
    id: "cpu-gravity",
    name: "CPU戦・重力処刑手順",
    objective: "グラビティCPUの善のイデア到達前に行動パターンを崩して生存する",
    team: "defender",
    operatorId: "operator-fighter",
    botCount: 3,
    attackerCount: 1,
    taskCount: 6,
    metric: "cpu"
  }),
  "cpu-stage2": Object.freeze({
    id: "cpu-stage2",
    name: "CPU戦・ハッカー制圧訓練",
    objective: "資源と状態を書き換えるハッカーCPUを排除する",
    team: "defender",
    operatorId: "operator-fighter",
    botCount: 5,
    attackerCount: 1,
    taskCount: 6,
    metric: "cpu2"
  })
});

const MAPS = {
  station: {
    id: "station",
    label: "オルビス環状研究区",
    width: 2100,
    height: 1360,
    playerRadius: 16,
    speed: 230,
    ghostSpeed: 280,
    reportRange: 86,
    taskRange: 140,
    ventRange: 76,
    spawns: [
      { x: 1010, y: 665 },
      { x: 1085, y: 665 },
      { x: 1010, y: 730 },
      { x: 1085, y: 730 },
      { x: 950, y: 700 },
      { x: 1145, y: 700 },
      { x: 1048, y: 610 },
      { x: 1048, y: 785 },
      { x: 890, y: 665 },
      { x: 1210, y: 730 }
    ],
    rooms: [
      { id: "archive", label: "暗号保管庫", x: 80, y: 80, w: 430, h: 300 },
      { id: "security", label: "監視室", x: 705, y: 80, w: 360, h: 280 },
      { id: "reactor", label: "フラックス炉心", x: 1370, y: 80, w: 520, h: 340 },
      { id: "electrical", label: "配電区画", x: 95, y: 835, w: 460, h: 360 },
      { id: "meeting", label: "協議ホール", x: 810, y: 525, w: 470, h: 350 },
      { id: "med", label: "生命科学区", x: 690, y: 1000, w: 370, h: 260 },
      { id: "comms", label: "通信中枢", x: 1375, y: 870, w: 490, h: 330 },
      { id: "engine", label: "推進機関室", x: 1500, y: 525, w: 380, h: 260 },
      { id: "storage", label: "貨物庫", x: 520, y: 610, w: 200, h: 210 }
    ],
    corridors: [
      { id: "c1", x: 510, y: 185, w: 195, h: 110 },
      { id: "c2", x: 1065, y: 185, w: 305, h: 110 },
      { id: "c3", x: 985, y: 360, w: 125, h: 165 },
      { id: "c4", x: 985, y: 875, w: 125, h: 125 },
      { id: "c5", x: 555, y: 980, w: 135, h: 115 },
      { id: "c6", x: 1280, y: 650, w: 220, h: 100 },
      { id: "c7", x: 1280, y: 940, w: 95, h: 115 },
      { id: "c8w", x: 320, y: 610, w: 200, h: 120 },
      { id: "c8e", x: 720, y: 610, w: 120, h: 120 },
      { id: "c9", x: 315, y: 730, w: 115, h: 105 },
      { id: "c11", x: 1680, y: 420, w: 120, h: 105 },
      { id: "c12", x: 1600, y: 785, w: 115, h: 85 },
      { id: "c13a", x: 1170, y: 330, w: 110, h: 280 },
      { id: "c13b", x: 1280, y: 450, w: 220, h: 160 }
    ],
    stations: [
      { id: "download-a", type: "task", task: "download", label: "Download A", x: 245, y: 195, room: "archive" },
      { id: "upload-a", type: "task", task: "upload", label: "Upload A", x: 1610, y: 1010, room: "comms" },
      { id: "download-b", type: "task", task: "download", label: "Download B", x: 260, y: 1035, room: "electrical" },
      { id: "upload-b", type: "task", task: "upload", label: "Upload B", x: 920, y: 645, room: "meeting" },
      { id: "download-c", type: "task", task: "download", label: "Download C", x: 865, y: 1135, room: "med" },
      { id: "download-d", type: "task", task: "download", label: "Download D", x: 1630, y: 205, room: "reactor" },
      { id: "upload-c", type: "task", task: "upload", label: "Upload C", x: 1660, y: 635, room: "engine" },
      { id: "upload-d", type: "task", task: "upload", label: "Upload D", x: 1480, y: 310, room: "reactor" },
      { id: "download-e", type: "task", task: "download", label: "Download E", x: 610, y: 715, room: "storage" },
      { id: "upload-e", type: "task", task: "upload", label: "Upload E", x: 1505, y: 990, room: "comms" },
      { id: "meeting-button", type: "emergency", label: "Assembly Call", x: 1048, y: 700, room: "meeting" },
      { id: "repair-lights", type: "repair", repair: "lights", label: "Grid Reset", x: 415, y: 1010, room: "electrical" },
      { id: "repair-comms", type: "repair", repair: "comms", label: "Signal Relay", x: 1730, y: 1045, room: "comms" },
      { id: "repair-reactor-a", type: "repair", repair: "reactor", label: "Flux Node A", x: 1485, y: 180, room: "reactor" },
      { id: "repair-reactor-b", type: "repair", repair: "reactor", label: "Flux Node B", x: 1790, y: 340, room: "reactor" },
      { id: "repair-oxygen-a", type: "repair", repair: "oxygen", label: "Atmos Node A", x: 185, y: 290, room: "archive" },
      { id: "repair-oxygen-b", type: "repair", repair: "oxygen", label: "Atmos Node B", x: 1465, y: 1090, room: "comms" },
      { id: "admin", type: "utility", utility: "admin", label: "Census Console", x: 1180, y: 640, room: "meeting" },
      { id: "cameras", type: "utility", utility: "cameras", label: "Optics", x: 910, y: 180, room: "security" },
      { id: "vitals", type: "utility", utility: "vitals", label: "Biometrics", x: 765, y: 1135, room: "med" },
      { id: "doorlog", type: "utility", utility: "doorlog", label: "Transit Log", x: 1540, y: 915, room: "comms" }
    ],
    objects: [
      { id: "station-recharge", type: "recharge", label: "スタミナ充填器", effectLabel: "スタミナ+200", x: 665, y: 655, room: "storage", interactive: true, cooldownMs: 15000 },
      { id: "station-medpod", type: "medPod", label: "応急処置ポッド", effectLabel: "全回復・状態異常解除・オーバーヒール", x: 950, y: 1050, room: "med", interactive: true, cooldownMs: 30000 },
      { id: "station-supply", type: "supply", label: "クレジットキャッシュ", effectLabel: "+3クレジット", effectKind: "credits", effectAmount: CREDIT_ECONOMY.cacheReward, x: 405, y: 145, room: "archive", interactive: true, cooldownMs: 45000 },
      { id: "station-decoy", type: "decoy", label: "デコイビーコン", effectLabel: "スタミナ+100・偽足音", x: 820, y: 300, room: "security", interactive: true, cooldownMs: 20000 },
      { id: "station-speedpad", type: "speedPad", label: "加速パッド", effectLabel: "通過中速度+35%", x: 1215, y: 240, room: "corridor", radius: 92 },
      { id: "station-hush", type: "hushField", label: "消音フィールド", effectLabel: "範囲内の足音を遮断", x: 1770, y: 1040, room: "comms", radius: 118 }
    ],
    vents: [
      { id: "vent-archive", x: 430, y: 310, links: ["vent-security", "vent-electrical"] },
      { id: "vent-security", x: 760, y: 310, links: ["vent-archive", "vent-reactor"] },
      { id: "vent-reactor", x: 1780, y: 200, links: ["vent-security", "vent-engine"] },
      { id: "vent-electrical", x: 475, y: 1125, links: ["vent-archive", "vent-med"] },
      { id: "vent-med", x: 985, y: 1190, links: ["vent-electrical", "vent-comms"] },
      { id: "vent-comms", x: 1790, y: 1120, links: ["vent-med", "vent-engine"] },
      { id: "vent-engine", x: 1795, y: 690, links: ["vent-reactor", "vent-comms"] }
    ],
    cameras: [
      { id: "cam-north", label: "Zenith Walk", x: 1110, y: 240, range: 240 },
      { id: "cam-west", label: "Vault Walk", x: 470, y: 660, range: 230 },
      { id: "cam-east", label: "Core Walk", x: 1490, y: 690, range: 230 },
      { id: "cam-south", label: "Nadir Walk", x: 1030, y: 960, range: 230 }
    ],
    doors: [
      { id: "door-archive", label: "Vault Gate" },
      { id: "door-reactor", label: "Core Gate" },
      { id: "door-electrical", label: "Grid Gate" },
      { id: "door-comms", label: "Signal Gate" }
    ]
  },
  outpost: {
    id: "outpost",
    label: "ルミナ総合研究・休養棟",
    width: 1900,
    height: 1240,
    playerRadius: 16,
    speed: 225,
    ghostSpeed: 280,
    reportRange: 84,
    taskRange: 140,
    ventRange: 76,
    spawns: [
      { x: 925, y: 605 },
      { x: 985, y: 605 },
      { x: 925, y: 670 },
      { x: 985, y: 670 },
      { x: 870, y: 635 },
      { x: 1040, y: 635 },
      { x: 955, y: 555 },
      { x: 955, y: 715 }
    ],
    rooms: [
      { id: "hub", label: "研究統合ロビー", x: 730, y: 470, w: 450, h: 335 },
      { id: "labs", label: "分析・合成研究室", x: 80, y: 80, w: 470, h: 320 },
      { id: "drill", label: "量子物性研究室", x: 1320, y: 90, w: 480, h: 330 },
      { id: "power", label: "生体工学研究室", x: 95, y: 785, w: 500, h: 350 },
      { id: "greenhouse", label: "リラクゼーションラウンジ", x: 1280, y: 790, w: 520, h: 330 }
    ],
    corridors: [
      { id: "o1", x: 550, y: 205, w: 180, h: 100 },
      { id: "o2", x: 1180, y: 210, w: 140, h: 100 },
      { id: "o3", x: 910, y: 300, w: 105, h: 170 },
      { id: "o4", x: 595, y: 590, w: 135, h: 110 },
      { id: "o5", x: 1180, y: 600, w: 175, h: 110 },
      { id: "o6", x: 905, y: 805, w: 110, h: 125 },
      { id: "o7", x: 410, y: 670, w: 115, h: 115 },
      { id: "o8", x: 1390, y: 680, w: 120, h: 110 },
      { id: "o9", x: 730, y: 300, w: 180, h: 100 },
      { id: "o10", x: 1015, y: 300, w: 165, h: 100 },
      { id: "o11", x: 525, y: 670, w: 70, h: 50 },
      { id: "o12", x: 1355, y: 680, w: 35, h: 50 },
      { id: "junction-o1-o9", x: 680, y: 255, w: 100, h: 95 },
      { id: "junction-o10-o2", x: 1130, y: 260, w: 100, h: 90 },
      { id: "junction-o7-o4", x: 500, y: 650, w: 120, h: 70 },
      { id: "junction-o5-o8", x: 1330, y: 650, w: 85, h: 80 }
    ],
    stations: [
      { id: "download-o-a", type: "task", task: "download", label: "Download A", x: 210, y: 230, room: "labs" },
      { id: "upload-o-a", type: "task", task: "upload", label: "Upload A", x: 1600, y: 965, room: "greenhouse" },
      { id: "download-o-b", type: "task", task: "download", label: "Download B", x: 375, y: 935, room: "power" },
      { id: "upload-o-b", type: "task", task: "upload", label: "Upload B", x: 835, y: 600, room: "hub" },
      { id: "download-o-c", type: "task", task: "download", label: "Download C", x: 375, y: 320, room: "labs" },
      { id: "download-o-d", type: "task", task: "download", label: "Download D", x: 1560, y: 220, room: "drill" },
      { id: "upload-o-c", type: "task", task: "upload", label: "Upload C", x: 1475, y: 350, room: "drill" },
      { id: "upload-o-d", type: "task", task: "upload", label: "Upload D", x: 1040, y: 720, room: "hub" },
      { id: "download-o-e", type: "task", task: "download", label: "Download E", x: 1450, y: 1030, room: "greenhouse" },
      { id: "upload-o-e", type: "task", task: "upload", label: "Upload E", x: 215, y: 980, room: "power" },
      { id: "meeting-button", type: "emergency", label: "Assembly Call", x: 955, y: 640, room: "hub" },
      { id: "repair-lights", type: "repair", repair: "lights", label: "Grid Reset", x: 455, y: 1040, room: "power" },
      { id: "repair-comms", type: "repair", repair: "comms", label: "Signal Relay", x: 1100, y: 545, room: "hub" },
      { id: "repair-reactor-a", type: "repair", repair: "reactor", label: "Bore Node A", x: 1450, y: 190, room: "drill" },
      { id: "repair-reactor-b", type: "repair", repair: "reactor", label: "Bore Node B", x: 1690, y: 345, room: "drill" },
      { id: "repair-oxygen-a", type: "repair", repair: "oxygen", label: "Atmos Node A", x: 1455, y: 905, room: "greenhouse" },
      { id: "repair-oxygen-b", type: "repair", repair: "oxygen", label: "Atmos Node B", x: 305, y: 185, room: "labs" },
      { id: "admin", type: "utility", utility: "admin", label: "Census Console", x: 1080, y: 625, room: "hub" },
      { id: "cameras", type: "utility", utility: "cameras", label: "Optics", x: 210, y: 335, room: "labs" },
      { id: "vitals", type: "utility", utility: "vitals", label: "Biometrics", x: 470, y: 220, room: "labs" },
      { id: "doorlog", type: "utility", utility: "doorlog", label: "Transit Log", x: 1530, y: 1010, room: "greenhouse" }
    ],
    objects: [
      { id: "outpost-recharge", type: "recharge", label: "スタミナ充填器", effectLabel: "スタミナ+200", x: 1085, y: 535, room: "hub", interactive: true, cooldownMs: 15000 },
      { id: "outpost-medpod", type: "medPod", label: "応急処置ポッド", effectLabel: "全回復・状態異常解除・オーバーヒール", x: 360, y: 270, room: "labs", interactive: true, cooldownMs: 30000 },
      { id: "outpost-supply", type: "supply", label: "クレジットキャッシュ", effectLabel: "+3クレジット", effectKind: "credits", effectAmount: CREDIT_ECONOMY.cacheReward, x: 1680, y: 180, room: "drill", interactive: true, cooldownMs: 45000 },
      { id: "outpost-decoy", type: "decoy", label: "デコイビーコン", effectLabel: "スタミナ+100・偽足音", x: 235, y: 850, room: "power", interactive: true, cooldownMs: 20000 },
      { id: "outpost-speedpad", type: "speedPad", label: "加速パッド", effectLabel: "通過中速度+35%", x: 1260, y: 650, room: "corridor", radius: 92 },
      { id: "outpost-hush", type: "hushField", label: "消音フィールド", effectLabel: "範囲内の足音を遮断", x: 1620, y: 900, room: "greenhouse", radius: 118 },
      { id: "outpost-relaxation-pod-a", type: "relaxationBed", label: "呼吸同期リラクゼーションポッド", effectLabel: "加速 1.35・12秒", effectKind: "relaxation", effectAmount: 1.35, effectDurationMs: 12000, x: 1400, y: 900, room: "greenhouse", interactive: true, cooldownMs: 30000 },
      { id: "outpost-relaxation-pod-b", type: "relaxationBed", label: "温熱リラクゼーションポッド", effectLabel: "加速 1.35・12秒", effectKind: "relaxation", effectAmount: 1.35, effectDurationMs: 12000, x: 1680, y: 1020, room: "greenhouse", interactive: true, cooldownMs: 30000 },
      { id: "outpost-credit-cache", type: "creditCache", label: "研究助成クレジット端末", effectLabel: "+3クレジット", effectKind: "credits", effectAmount: CREDIT_ECONOMY.cacheReward, x: 1515, y: 195, room: "drill", interactive: true, cooldownMs: 45000 }
    ],
    vents: [
      { id: "vent-labs", x: 475, y: 345, links: ["vent-hub", "vent-power"] },
      { id: "vent-hub", x: 1110, y: 740, links: ["vent-labs", "vent-drill", "vent-garden"] },
      { id: "vent-drill", x: 1725, y: 210, links: ["vent-hub"] },
      { id: "vent-power", x: 525, y: 1080, links: ["vent-labs", "vent-garden"] },
      { id: "vent-garden", x: 1690, y: 1060, links: ["vent-hub", "vent-power"] }
    ],
    cameras: [
      { id: "cam-labs", label: "Synthesis Walk", x: 555, y: 255, range: 230 },
      { id: "cam-hub", label: "Concourse", x: 955, y: 470, range: 230 },
      { id: "cam-east", label: "Dome Walk", x: 1275, y: 655, range: 220 }
    ],
    doors: [
      { id: "door-labs", label: "Synthesis Gate" },
      { id: "door-drill", label: "Bore Gate" },
      { id: "door-power", label: "Thermal Gate" },
      { id: "door-garden", label: "Dome Gate" }
    ]
  }
};

// The first map owns authored world coordinates. The second map keeps its code
// skeleton and receives room-specific laboratory textures in the client.
MAPS.station = JSON.parse(JSON.stringify(ADVANCED_STATION_MAP));
MAPS.outpost = JSON.parse(JSON.stringify(LABORATORY_MAP));

for (const map of Object.values(MAPS)) {
  if (!map.authoredGeometry) {
    applyMapGeometryCorrections(map);
    expandMap(map, MAP_SCALE);
  }
  finalizeMapEnvironment(map);
}

function expandMap(map, scale) {
  if (map.expandedScale === scale) return;
  map.width = Math.round(map.width * scale);
  map.height = Math.round(map.height * scale);
  scalePoints(map.spawns, scale);
  scaleRects(map.rooms, scale);
  scaleRects(map.corridors, scale);
  scalePoints(map.stations, scale);
  scalePoints(map.objects, scale);
  scalePoints(map.vents, scale);
  scalePoints(map.cameras, scale);
  scaleRects(map.doors, scale);
  for (const camera of map.cameras) {
    camera.range = Math.round(camera.range * scale);
  }
  map.expandedScale = scale;
}

function scalePoints(items, scale) {
  for (const item of items || []) {
    if (typeof item.x === "number") item.x = Math.round(item.x * scale);
    if (typeof item.y === "number") item.y = Math.round(item.y * scale);
  }
}

function scaleRects(items, scale) {
  for (const item of items || []) {
    if (typeof item.x === "number") item.x = Math.round(item.x * scale);
    if (typeof item.y === "number") item.y = Math.round(item.y * scale);
    if (typeof item.w === "number") item.w = Math.round(item.w * scale);
    if (typeof item.h === "number") item.h = Math.round(item.h * scale);
  }
}

function applyMapGeometryCorrections(map) {
  const corrections = MAP_ENVIRONMENT_CONTRACT.geometryCorrections?.[map.id]?.corridors || {};
  for (const corridor of map.corridors || []) {
    Object.assign(corridor, corrections[corridor.id] || {});
  }
}

function sharedBoundary(room, corridor) {
  const epsilon = 1;
  const overlapY = Math.min(room.y + room.h, corridor.y + corridor.h) - Math.max(room.y, corridor.y);
  const overlapX = Math.min(room.x + room.w, corridor.x + corridor.w) - Math.max(room.x, corridor.x);
  if (Math.abs(room.x + room.w - corridor.x) <= epsilon && overlapY > 0) {
    return { orientation: "vertical", roomSide: "E", corridorSide: "W", boundary: corridor.x,
      seamStart: Math.max(room.y, corridor.y), seamEnd: Math.min(room.y + room.h, corridor.y + corridor.h) };
  }
  if (Math.abs(room.x - (corridor.x + corridor.w)) <= epsilon && overlapY > 0) {
    return { orientation: "vertical", roomSide: "W", corridorSide: "E", boundary: room.x,
      seamStart: Math.max(room.y, corridor.y), seamEnd: Math.min(room.y + room.h, corridor.y + corridor.h) };
  }
  if (Math.abs(room.y + room.h - corridor.y) <= epsilon && overlapX > 0) {
    return { orientation: "horizontal", roomSide: "S", corridorSide: "N", boundary: corridor.y,
      seamStart: Math.max(room.x, corridor.x), seamEnd: Math.min(room.x + room.w, corridor.x + corridor.w) };
  }
  if (Math.abs(room.y - (corridor.y + corridor.h)) <= epsilon && overlapX > 0) {
    return { orientation: "horizontal", roomSide: "N", corridorSide: "S", boundary: room.y,
      seamStart: Math.max(room.x, corridor.x), seamEnd: Math.min(room.x + room.w, corridor.x + corridor.w) };
  }
  return null;
}

function positiveIntersection(a, b) {
  return Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) > 0 &&
    Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) > 0;
}

function adjacencySides(area, areas) {
  const sides = new Set();
  for (const other of areas) {
    if (other === area) continue;
    const relation = sharedBoundary(area, other);
    if (relation) sides.add(relation.roomSide);
    const reverse = sharedBoundary(other, area);
    if (reverse) sides.add(reverse.corridorSide);
  }
  return ["N", "E", "S", "W"].filter((side) => sides.has(side));
}

function corridorTopology(openings) {
  if (openings.length >= 4) return "cross";
  if (openings.length === 3) return "junction";
  if (openings.length === 2) {
    return (openings.includes("N") && openings.includes("S")) || (openings.includes("E") && openings.includes("W"))
      ? "straight"
      : "corner";
  }
  return openings.length === 1 ? "terminal" : "isolated";
}

function deriveMapPortals(map) {
  const scale = Number(map.expandedScale) || 1;
  const defaultSpan = Number(MAP_ENVIRONMENT_CONTRACT.rules?.defaultPortalOpeningSpan || 84) * scale;
  const thickness = Number(MAP_ENVIRONMENT_CONTRACT.rules?.portalThickness || 28) * scale;
  const doorContracts = new Map((MAP_ENVIRONMENT_CONTRACT.doors?.[map.id] || []).map((door) => [
    `${door.roomId}|${door.corridorId}`,
    door
  ]));
  const visualPortalContracts = new Map((MAP_ENVIRONMENT_CONTRACT.portals?.[map.id] || []).map((portal) => [
    `${portal.roomId}|${portal.corridorId}`,
    portal
  ]));
  const portals = [];
  for (const room of map.rooms || []) {
    for (const corridor of map.corridors || []) {
      const boundary = sharedBoundary(room, corridor);
      if (!boundary) continue;
      const doorContract = doorContracts.get(`${room.id}|${corridor.id}`) || null;
      const visualPortalContract = visualPortalContracts.get(`${room.id}|${corridor.id}`) || null;
      const seamSpan = boundary.seamEnd - boundary.seamStart;
      const requestedSpan = Number(doorContract?.openingSpan || defaultSpan / scale) * scale;
      const openingSpan = Math.max(16 * scale, Math.min(requestedSpan, seamSpan - 12 * scale));
      const center = (boundary.seamStart + boundary.seamEnd) / 2;
      const portal = {
        id: `portal-${room.id}-${corridor.id}`,
        roomId: room.id,
        corridorId: corridor.id,
        roomSide: boundary.roomSide,
        corridorSide: boundary.corridorSide,
        orientation: boundary.orientation,
        boundary: boundary.boundary,
        seamStart: boundary.seamStart,
        seamEnd: boundary.seamEnd,
        doorId: doorContract?.id || visualPortalContract?.doorId || ""
      };
      if (visualPortalContract?.worldOpeningRect) {
        Object.assign(portal, {
          x: Math.round(visualPortalContract.worldOpeningRect.x),
          y: Math.round(visualPortalContract.worldOpeningRect.y),
          w: Math.round(visualPortalContract.worldOpeningRect.w),
          h: Math.round(visualPortalContract.worldOpeningRect.h)
        });
      } else if (boundary.orientation === "vertical") {
        Object.assign(portal, {
          x: Math.round(boundary.boundary - thickness / 2),
          y: Math.round(center - openingSpan / 2),
          w: Math.round(thickness),
          h: Math.round(openingSpan)
        });
      } else {
        Object.assign(portal, {
          x: Math.round(center - openingSpan / 2),
          y: Math.round(boundary.boundary - thickness / 2),
          w: Math.round(openingSpan),
          h: Math.round(thickness)
        });
      }
      portals.push(portal);
    }
  }
  return portals;
}

function applyRoomAnchorContract(map) {
  const roomContracts = MAP_ENVIRONMENT_CONTRACT.rooms?.[map.id] || {};
  const objectTypes = MAP_ENVIRONMENT_CONTRACT.objectTypes || {};
  const objectFootprints = MAP_ENVIRONMENT_CONTRACT.objectFootprints || {};
  const clusterDistance = Number(MAP_ENVIRONMENT_CONTRACT.rules?.interiorClusterDistanceUv || 0.07);
  const existing = new Map([...(map.stations || []), ...(map.objects || [])].map((entry) => [entry.id, entry]));
  for (const room of map.rooms || []) {
    const anchors = roomContracts[room.id] || [];
    const reserved = [];
    for (const anchor of anchors) {
      const entry = existing.get(anchor.id);
      if (!entry) continue;
      const definition = objectTypes[anchor.type];
      entry.x = Number.isFinite(Number(anchor.worldX)) ? Math.round(anchor.worldX) : Math.round(room.x + anchor.u * room.w);
      entry.y = Number.isFinite(Number(anchor.worldY)) ? Math.round(anchor.worldY) : Math.round(room.y + anchor.v * room.h);
      entry.room = room.id;
      entry.assetAnchor = true;
      entry.anchorU = anchor.u;
      entry.anchorV = anchor.v;
      entry.assetWorldX = entry.x;
      entry.assetWorldY = entry.y;
      const footprint = anchor.worldFootprint || objectFootprints[anchor.type] || { width: 80, height: 72 };
      entry.visualWidth = Math.max(1, Math.round(Number(footprint.width) || 80));
      entry.visualHeight = Math.max(1, Math.round(Number(footprint.height) || 72));
      if (definition) {
        entry.type = anchor.type;
        entry.label = definition.label;
        entry.effectLabel = definition.effectLabel;
        entry.effectKind = definition.effectKind;
        entry.effectAmount = Number(definition.amount) || 0;
        entry.cooldownMs = Number(definition.cooldownMs) || 30000;
      }
      if ((map.objects || []).includes(entry)) entry.integrated = true;
      reserved.push(anchor);
    }
    const accepted = [...reserved];
    for (const anchor of anchors) {
      if (existing.has(anchor.id)) continue;
      const definition = objectTypes[anchor.type];
      if (!definition) continue;
      const inferredDetail = /-\d+$/.test(anchor.id);
      const duplicatesVisibleAnchor = inferredDetail && accepted.some((other) => (
        Math.hypot(anchor.u - other.u, anchor.v - other.v) < clusterDistance
      ));
      if (duplicatesVisibleAnchor) continue;
      const object = {
        id: anchor.id,
        type: anchor.type,
        label: definition.label,
        effectLabel: definition.effectLabel,
        effectKind: definition.effectKind,
        effectAmount: Number(definition.amount) || 0,
        x: Number.isFinite(Number(anchor.worldX)) ? Math.round(anchor.worldX) : Math.round(room.x + anchor.u * room.w),
        y: Number.isFinite(Number(anchor.worldY)) ? Math.round(anchor.worldY) : Math.round(room.y + anchor.v * room.h),
        room: room.id,
        interactive: true,
        integrated: true,
        assetAnchor: true,
        anchorU: anchor.u,
        anchorV: anchor.v,
        assetWorldX: Number.isFinite(Number(anchor.worldX)) ? Math.round(anchor.worldX) : Math.round(room.x + anchor.u * room.w),
        assetWorldY: Number.isFinite(Number(anchor.worldY)) ? Math.round(anchor.worldY) : Math.round(room.y + anchor.v * room.h),
        visualWidth: Math.max(1, Math.round(Number((anchor.worldFootprint || objectFootprints[anchor.type])?.width) || 80)),
        visualHeight: Math.max(1, Math.round(Number((anchor.worldFootprint || objectFootprints[anchor.type])?.height) || 72)),
        cooldownMs: Number(definition.cooldownMs) || 30000,
        useRange: Math.round(72 * (Number(map.expandedScale) || 1))
      };
      map.objects.push(object);
      existing.set(object.id, object);
      accepted.push(anchor);
    }
  }
}

function normalizeMapObjectBenefits(map) {
  for (const object of map.objects || []) {
    if (object.effectKind === "footBath") continue;
    if (object.effectKind === "cooldownReduction") {
      if (/workbench|bench/i.test(`${object.type} ${object.id}`)) {
        object.effectKind = "stamina";
        object.effectAmount = 120;
        object.effectLabel = "スタミナ +120";
      } else if (/console|commandDesk|reactorGauge|wallSconce/i.test(`${object.type} ${object.id}`)) {
        object.effectKind = "luckBoost";
        object.effectAmount = 0.15;
        object.effectDurationMs = 20_000;
        object.effectLabel = "幸運／直観 +15%・20秒";
      } else {
        object.effectKind = "mana";
        object.effectAmount = 1;
        object.effectLabel = "マナ +1";
      }
    } else if (object.effectKind === "statusRecovery") {
      if (/plant|mist|herb/i.test(`${object.type} ${object.id}`)) {
        object.effectKind = "luckBoost";
        object.effectAmount = 0.12;
        object.effectDurationMs = 20_000;
        object.effectLabel = "幸運／直観 +12%・20秒";
      } else {
        object.effectKind = "stamina";
        object.effectAmount = 120;
        object.effectLabel = "スタミナ +120";
      }
    } else if (object.effectKind === "herbalRecovery") {
      object.effectKind = "heal";
      object.effectAmount = 1;
      object.effectLabel = "HP +1";
    } else if (object.effectKind === "relaxation") {
      object.effectKind = "acceleration";
      object.effectLabel = `加速 ${Math.max(1.01, Number(object.effectAmount) || 1.35)}・${Math.round(Math.max(1000, Number(object.effectDurationMs) || 12000) / 1000)}秒`;
    } else if (object.effectKind === "mineralWater") {
      object.effectKind = "stamina";
      object.effectLabel = `スタミナ +${Math.max(1, Number(object.effectAmount) || 100)}`;
    }
    if (object.effectKind === "fullRecovery") {
      object.effectLabel = "HP全回復・オーバーヒール";
    }
  }
}

function validateMapEnvironment(map) {
  const owned = [...(map.rooms || []), ...(map.corridors || [])];
  const corridorIds = new Set((map.corridors || []).map((corridor) => corridor.id));
  for (let index = 0; index < owned.length; index += 1) {
    for (let other = index + 1; other < owned.length; other += 1) {
      if (positiveIntersection(owned[index], owned[other])) {
        const structuralJunction = corridorIds.has(owned[index].id) && corridorIds.has(owned[other].id) &&
          (owned[index].id.startsWith("junction-") || owned[other].id.startsWith("junction-"));
        if (structuralJunction) continue;
        throw new Error(`${map.id}: overlapping map ownership ${owned[index].id}/${owned[other].id}`);
      }
    }
  }
  const portalByDoor = new Map((map.portals || []).filter((portal) => portal.doorId).map((portal) => [portal.doorId, portal]));
  for (const door of map.doors || []) {
    const portal = portalByDoor.get(door.id);
    if (!portal) throw new Error(`${map.id}: missing canonical portal for ${door.id}`);
    for (const key of ["x", "y", "w", "h"]) {
      if (door[key] !== portal[key]) throw new Error(`${map.id}: ${door.id} differs from ${portal.id} at ${key}`);
    }
  }
}

function finalizeMapEnvironment(map) {
  normalizeMapObjectBenefits(map);
  if (map.authoredGeometry) {
    map.portals = (map.doors || []).map((door) => ({
      id: `portal-${door.id}`,
      doorId: door.id,
      orientation: door.orientation,
      x: door.x,
      y: door.y,
      w: door.w,
      h: door.h
    }));
    map.walkable = [...map.rooms, ...map.corridors];
    map.environmentContractVersion = map.schema;
    return;
  }
  applyRoomAnchorContract(map);
  normalizeMapObjectBenefits(map);
  const allAreas = [...map.rooms, ...map.corridors];
  for (const corridor of map.corridors) {
    const openings = adjacencySides(corridor, allAreas);
    corridor.openings = openings;
    corridor.topology = corridorTopology(openings);
    corridor.renderSegments = [{ x: corridor.x, y: corridor.y, w: corridor.w, h: corridor.h }];
  }
  map.portals = deriveMapPortals(map);
  const portalByDoor = new Map(map.portals.filter((portal) => portal.doorId).map((portal) => [portal.doorId, portal]));
  map.doors = map.doors.map((door) => {
    const portal = portalByDoor.get(door.id);
    return portal ? { ...door, x: portal.x, y: portal.y, w: portal.w, h: portal.h, portalId: portal.id } : door;
  });
  map.walkable = [...map.rooms, ...map.corridors];
  map.environmentContractVersion = MAP_ENVIRONMENT_CONTRACT.schema;
  validateMapEnvironment(map);
}

const rooms = new Map();
const MATCHMAKING_WAIT_MS = 5000;

const RANKS = Object.freeze([
  { id: "bronze", label: "ブロンズ", min: 0 },
  { id: "silver", label: "シルバー", min: 3 },
  { id: "gold", label: "ゴールド", min: 8 },
  { id: "diamond", label: "ダイヤ", min: 16 }
]);

function loadPlayerProfiles() {
  try {
    const parsed = JSON.parse(fs.readFileSync(PLAYER_PROFILE_FILE, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

let playerProfiles = loadPlayerProfiles();
let profileRemoteSaveTimer = null;
let profileHydrationStatus = {
  state: PROFILE_REMOTE_URL ? "pending" : "disabled",
  authenticated: Boolean(ANALYTICS_REMOTE_TOKEN),
  checkedAt: 0
};

function savePlayerProfiles(syncRemote = true) {
  fs.mkdirSync(MODERATION_DIR, { recursive: true });
  const temporaryFile = `${PLAYER_PROFILE_FILE}.${process.pid}.${crypto.randomBytes(6).toString("hex")}.tmp`;
  fs.writeFileSync(temporaryFile, JSON.stringify(playerProfiles, null, 2), "utf8");
  fs.renameSync(temporaryFile, PLAYER_PROFILE_FILE);
  if (syncRemote && ANALYTICS_REMOTE_TOKEN && PROFILE_REMOTE_WRITE_URL) {
    clearTimeout(profileRemoteSaveTimer);
    profileRemoteSaveTimer = setTimeout(() => void persistPlayerProfilesRemote(), 1_200);
  }
}

function normalizedRequestIp(req) {
  const forwardedFor = String(req?.headers?.["x-forwarded-for"] || "").split(",")[0].trim();
  const standardForwarded = String(req?.headers?.forwarded || "")
    .split(",")[0]
    .split(";")
    .map((part) => part.trim())
    .find((part) => /^for=/i.test(part));
  let candidate = String(
    req?.headers?.["cf-connecting-ip"] ||
    req?.headers?.["x-real-ip"] ||
    forwardedFor ||
    standardForwarded?.replace(/^for=/i, "") ||
    req?.socket?.remoteAddress ||
    ""
  ).trim().replace(/^"|"$/g, "");
  const bracketed = candidate.match(/^\[([^\]]+)\](?::\d+)?$/);
  if (bracketed) candidate = bracketed[1];
  else {
    const ipv4WithPort = candidate.match(/^(\d{1,3}(?:\.\d{1,3}){3})(?::\d+)?$/);
    if (ipv4WithPort) candidate = ipv4WithPort[1];
  }
  candidate = candidate.replace(/%.+$/, "").toLowerCase();
  const mappedIpv4 = candidate.match(/^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i);
  if (mappedIpv4 && net.isIP(mappedIpv4[1]) === 4) candidate = mappedIpv4[1];
  const version = net.isIP(candidate);
  if (!version) return "";
  if (version === 6) {
    try {
      candidate = new URL(`http://[${candidate}]`).hostname.replace(/^\[|\]$/g, "");
    } catch {
      return "";
    }
  }
  return candidate.slice(0, 128);
}

function playerProfileId(req) {
  const normalizedIp = normalizedRequestIp(req);
  return normalizedIp
    ? crypto.createHash("sha256").update(`ip-profile:${normalizedIp}`).digest("hex").slice(0, 24)
    : "";
}

function legacyPlayerProfileId(rawClientId) {
  return rawClientId ? checkpointClientId(rawClientId) : "";
}

function rankForPoints(points) {
  return [...RANKS].reverse().find((rank) => Number(points) >= rank.min) || RANKS[0];
}

function canonicalProfileId(profileId) {
  const id = String(profileId || "");
  return DEVELOPER_PROFILE_IDS.has(id) ? DEVELOPER_CANONICAL_PROFILE_ID : id;
}

function profileFor(player) {
  if (!player?.profileId) return null;
  const canonicalId = canonicalProfileId(player.profileId);
  return playerProfiles[canonicalId] || playerProfiles[player.profileId] || null;
}

function profileKillRate(profile) {
  return Math.round(Math.max(0, Number(profile?.killPoints) || 0) * 100) / 100;
}

function normalizedRoundKillPoints(role, kills, attackerTarget) {
  const totalKills = Math.max(0, Number(kills) || 0);
  if (role !== "attacker") return totalKills;
  return totalKills / Math.max(1, Number(attackerTarget) || 1);
}

function isDeveloperProfileId(profileId) {
  const id = String(profileId || "");
  return Boolean(id && (DEVELOPER_PROFILE_IDS.has(id) || playerProfiles[id]?.developer === true));
}

function migrateLegacyProfile(profileId, legacyProfileId) {
  const targetId = canonicalProfileId(profileId);
  if (!targetId) return null;
  if (playerProfiles[targetId]) return playerProfiles[targetId];
  const sourceId = playerProfiles[profileId] ? profileId : legacyProfileId;
  if (!sourceId || sourceId === targetId) return null;
  const legacy = playerProfiles[sourceId];
  if (!legacy?.name) return null;
  playerProfiles[targetId] = {
    ...legacy,
    name: isDeveloperProfileId(profileId) ? RESERVED_DEVELOPER_NAME : legacy.name,
    developer: isDeveloperProfileId(profileId),
    identityVersion: 2,
    updatedAt: now()
  };
  if (sourceId !== targetId) delete playerProfiles[sourceId];
  savePlayerProfiles();
  return playerProfiles[targetId];
}

function reservePlayerName(rawName, profileId, legacyProfileId = "") {
  const requested = cleanName(rawName);
  const targetId = canonicalProfileId(profileId);
  const existing = targetId ? playerProfiles[targetId] || migrateLegacyProfile(profileId, legacyProfileId) : null;
  if (existing?.name) {
    if (isDeveloperProfileId(profileId) && existing.name !== RESERVED_DEVELOPER_NAME) {
      existing.name = RESERVED_DEVELOPER_NAME;
      existing.developer = true;
      existing.updatedAt = now();
      savePlayerProfiles();
    }
    if (existing.name === RESERVED_DEVELOPER_NAME && !isDeveloperProfileId(profileId)) {
      throw new ApiError(403, "このユーザー名は使用できません。");
    }
    if (Number(existing.identityVersion) < 2) {
      existing.identityVersion = 2;
      existing.updatedAt = now();
      savePlayerProfiles();
    }
    return existing.name;
  }
  if (requested === RESERVED_DEVELOPER_NAME && !isDeveloperProfileId(profileId)) {
    throw new ApiError(403, "このユーザー名は使用できません。別の名前を入力してください。");
  }
  const owner = Object.entries(playerProfiles).find(([, profile]) => profile?.name === requested);
  if (owner && canonicalProfileId(owner[0]) !== targetId) {
    throw new ApiError(409, "このユーザー名は既に使用されています。");
  }
  if (targetId) {
    playerProfiles[targetId] = {
      name: requested,
      points: 0,
      games: 0,
      kills: 0,
      killPoints: 0,
      killRate: 0,
      deaths: 0,
      rank: "bronze",
      identityVersion: 2,
      developer: isDeveloperProfileId(profileId),
      messages: [],
      updatedAt: now()
    };
    savePlayerProfiles();
  }
  return requested;
}

async function writeRemoteJson(writeUrl, payload, message) {
  if (!ANALYTICS_REMOTE_TOKEN || !writeUrl || typeof fetch !== "function") return { ok: false, status: 0 };
  const headers = {
    accept: "application/vnd.github+json",
    authorization: `Bearer ${ANALYTICS_REMOTE_TOKEN}`,
    "content-type": "application/json",
    "user-agent": "defenders-vs-attackers-persistence"
  };
  const metadataResponse = await fetch(writeUrl, { headers, signal: AbortSignal.timeout(8_000) });
  const metadata = metadataResponse.ok ? await metadataResponse.json() : {};
  const branchMatch = writeUrl.match(/[?&]ref=([^&]+)/);
  const contentUrl = writeUrl.replace(/\?ref=[^&]+$/, "");
  const body = {
    message,
    content: Buffer.from(JSON.stringify(payload, null, 2), "utf8").toString("base64"),
    ...(metadata.sha ? { sha: metadata.sha } : {}),
    ...(branchMatch ? { branch: decodeURIComponent(branchMatch[1]) } : {})
  };
  const response = await fetch(contentUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000)
  });
  return { ok: response.ok, status: response.status };
}

async function persistPlayerProfilesRemote() {
  try {
    const result = await writeRemoteJson(PROFILE_REMOTE_WRITE_URL, playerProfiles, "Update persistent player profiles");
    profileHydrationStatus = {
      state: result.ok ? "ready" : "failed",
      authenticated: Boolean(ANALYTICS_REMOTE_TOKEN),
      status: result.status,
      checkedAt: now()
    };
    return result.ok;
  } catch (error) {
    profileHydrationStatus = {
      state: "failed",
      authenticated: Boolean(ANALYTICS_REMOTE_TOKEN),
      reason: error?.name === "AbortError" ? "timeout" : "network",
      checkedAt: now()
    };
    return false;
  }
}

async function hydratePlayerProfiles() {
  if (!PROFILE_REMOTE_URL || typeof fetch !== "function") {
    profileHydrationStatus = { state: "disabled", authenticated: false, checkedAt: now() };
    return false;
  }
  try {
    const headers = { accept: "application/json" };
    if (ANALYTICS_REMOTE_TOKEN) headers.authorization = `Bearer ${ANALYTICS_REMOTE_TOKEN}`;
    const response = await fetch(`${PROFILE_REMOTE_URL}?v=${Date.now()}`, {
      headers,
      signal: AbortSignal.timeout(5_000)
    });
    if (!response.ok) {
      profileHydrationStatus = { state: "failed", authenticated: Boolean(ANALYTICS_REMOTE_TOKEN), status: response.status, checkedAt: now() };
      return false;
    }
    const remoteProfiles = await response.json();
    if (!remoteProfiles || typeof remoteProfiles !== "object" || Array.isArray(remoteProfiles)) return false;
    for (const [profileId, remoteProfile] of Object.entries(remoteProfiles)) {
      const localProfile = playerProfiles[profileId];
      if (!localProfile || Number(remoteProfile?.updatedAt) > Number(localProfile?.updatedAt)) playerProfiles[profileId] = remoteProfile;
    }
    savePlayerProfiles(false);
    profileHydrationStatus = { state: "ready", authenticated: Boolean(ANALYTICS_REMOTE_TOKEN), status: response.status, checkedAt: now() };
    return true;
  } catch (error) {
    profileHydrationStatus = {
      state: "failed",
      authenticated: Boolean(ANALYTICS_REMOTE_TOKEN),
      reason: error?.name === "AbortError" ? "timeout" : "network",
      checkedAt: now()
    };
    return false;
  }
}

function updatePlayerProfiles(room) {
  if (room.rankUpdated) return;
  const players = [...room.players.values()];
  const attackers = players.filter((player) => player.role === "attacker");
  const attackerTarget = Math.max(
    1,
    Number(room.killRateAttackerTarget) || Math.ceil(
      players.filter((player) => player.role === "defender").length / Math.max(1, attackers.length)
    )
  );
  const contributionById = new Map(
    contributionRankingEntries(room).map((entry) => [entry.id, entry])
  );
  for (const player of players) {
    // Bot rooms are casual for ordinary users, but the reserved developer
    // profile remains rank/KD-visible for debugging and balance checks.
    if (room.casual && !isDeveloperProfileId(player.profileId)) continue;
    const profile = profileFor(player);
    if (!profile) continue;
    const kills = Number(player.totalKills) || 0;
    const contribution = contributionById.get(player.id);
    profile.games = (Number(profile.games) || 0) + 1;
    profile.kills = (Number(profile.kills) || 0) + kills;
    profile.killPoints = (Number(profile.killPoints) || 0) + normalizedRoundKillPoints(player.role, kills, attackerTarget);
    profile.killRate = profileKillRate(profile);
    profile.deaths = (Number(profile.deaths) || 0) + (player.alive ? 0 : 1);
    const current = rankForPoints(profile.points);
    // Match outcome never grants a direct profile movement.  Its single victory
    // credit is part of the authoritative contribution ranking, and placement
    // alone decides the resulting +1/-1 movement.
    if (contribution?.rankMovement > 0) profile.points = Math.min(24, (Number(profile.points) || 0) + 1);
    else if (current.id !== "bronze") profile.points = Math.max(0, (Number(profile.points) || 0) - 1);
    profile.rank = rankForPoints(profile.points).id;
    profile.updatedAt = now();
  }
  room.rankUpdated = true;
  savePlayerProfiles();
}

function loadModerationRecords() {
  try {
    const parsed = JSON.parse(fs.readFileSync(MODERATION_FILE, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

let moderationRecords = loadModerationRecords();
const localCheckpointArchive = (() => {
  try {
    const parsed = JSON.parse(fs.readFileSync(CHECKPOINT_ARCHIVE_FILE, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
})();
let checkpointCounts = localCheckpointArchive.counts || (() => {
  try {
    const parsed = JSON.parse(fs.readFileSync(CHECKPOINT_FILE, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
})();
let checkpointSessions = localCheckpointArchive.sessions || (() => {
  try {
    const parsed = JSON.parse(fs.readFileSync(CHECKPOINT_SESSIONS_FILE, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
})();
let checkpointExcludedIds = localCheckpointArchive.excludedIds && typeof localCheckpointArchive.excludedIds === "object"
  ? localCheckpointArchive.excludedIds
  : {};
let checkpointHydrationStatus = {
  state: ANALYTICS_REMOTE_URL ? "pending" : "disabled",
  authenticated: Boolean(ANALYTICS_REMOTE_TOKEN),
  checkedAt: 0
};

function checkpointClientId(rawClientId) {
  return crypto.createHash("sha256").update(String(rawClientId || "anonymous").slice(0, 128)).digest("hex").slice(0, 24);
}

function checkpointArchiveSnapshot() {
  return {
    version: 3,
    updatedAt: now(),
    counts: checkpointCounts,
    sessions: checkpointSessions,
    excludedIds: checkpointExcludedIds
  };
}

let checkpointRemoteSaveTimer = null;

function saveCheckpointRecords(syncRemote = true) {
  fs.mkdirSync(MODERATION_DIR, { recursive: true });
  fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify(checkpointCounts, null, 2), "utf8");
  fs.writeFileSync(CHECKPOINT_SESSIONS_FILE, JSON.stringify(checkpointSessions, null, 2), "utf8");
  fs.writeFileSync(CHECKPOINT_ARCHIVE_FILE, JSON.stringify(checkpointArchiveSnapshot(), null, 2), "utf8");
  if (syncRemote && ANALYTICS_REMOTE_TOKEN && ANALYTICS_REMOTE_WRITE_URL) {
    clearTimeout(checkpointRemoteSaveTimer);
    checkpointRemoteSaveTimer = setTimeout(() => void persistCheckpointArchiveRemote(), 1_200);
  }
}

function mergeCheckpointArchive(archive) {
  if (!archive || typeof archive !== "object") return false;
  const remoteCounts = archive.counts && typeof archive.counts === "object" ? archive.counts : {};
  const remoteSessions = archive.sessions && typeof archive.sessions === "object" ? archive.sessions : {};
  const remoteExcluded = archive.excludedIds && typeof archive.excludedIds === "object" ? archive.excludedIds : {};
  checkpointCounts = Object.fromEntries([...new Set([...Object.keys(remoteCounts), ...Object.keys(checkpointCounts)])]
    .map((name) => [name, Math.max(Number(remoteCounts[name]) || 0, Number(checkpointCounts[name]) || 0)]));
  checkpointSessions = { ...remoteSessions, ...checkpointSessions };
  checkpointExcludedIds = { ...remoteExcluded, ...checkpointExcludedIds };
  for (const excludedId of Object.keys(checkpointExcludedIds)) delete checkpointSessions[excludedId];
  saveCheckpointRecords(false);
  return true;
}

async function persistCheckpointArchiveRemote() {
  try {
    const result = await writeRemoteJson(ANALYTICS_REMOTE_WRITE_URL, checkpointArchiveSnapshot(), "Update named checkpoint analytics");
    checkpointHydrationStatus = {
      state: result.ok ? "ready" : "failed",
      authenticated: Boolean(ANALYTICS_REMOTE_TOKEN),
      status: result.status,
      checkedAt: now()
    };
    return result.ok;
  } catch (error) {
    checkpointHydrationStatus = {
      state: "failed",
      authenticated: Boolean(ANALYTICS_REMOTE_TOKEN),
      reason: error?.name === "AbortError" ? "timeout" : "network",
      checkedAt: now()
    };
    return false;
  }
}

async function hydrateCheckpointArchive() {
  if (!ANALYTICS_REMOTE_URL || typeof fetch !== "function") {
    checkpointHydrationStatus = { state: "disabled", authenticated: false, checkedAt: now() };
    return false;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  try {
    const headers = { accept: "application/json" };
    if (ANALYTICS_REMOTE_TOKEN) headers.authorization = `Bearer ${ANALYTICS_REMOTE_TOKEN}`;
    const response = await fetch(`${ANALYTICS_REMOTE_URL}?v=${Date.now()}`, {
      headers,
      signal: controller.signal
    });
    if (!response.ok) {
      checkpointHydrationStatus = {
        state: "failed",
        authenticated: Boolean(ANALYTICS_REMOTE_TOKEN),
        status: response.status,
        checkedAt: now()
      };
      return false;
    }
    const merged = mergeCheckpointArchive(await response.json());
    checkpointHydrationStatus = {
      state: merged ? "ready" : "failed",
      authenticated: Boolean(ANALYTICS_REMOTE_TOKEN),
      status: response.status,
      checkedAt: now()
    };
    return merged;
  } catch (error) {
    checkpointHydrationStatus = {
      state: "failed",
      authenticated: Boolean(ANALYTICS_REMOTE_TOKEN),
      reason: error?.name === "AbortError" ? "timeout" : "network",
      checkedAt: now()
    };
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

function excludeCheckpointProfile(profileId) {
  checkpointExcludedIds[profileId] = now();
  delete checkpointSessions[profileId];
  saveCheckpointRecords();
  return profileId;
}

// Accumulate only active intervals so resumed sessions do not count background time.
function addCheckpointDuration(session, timestamp) {
  if (!session.last || Number(session.leftAt) > 0) return 0;
  const lastSeenAt = Number(session.lastSeenAt) || timestamp;
  const activeUntil = Math.min(timestamp, lastSeenAt + CHECKPOINT_ACTIVE_TIMEOUT_MS);
  const elapsedMs = Math.max(0, activeUntil - (Number(session.lastAt) || activeUntil));
  session.durationsMs = session.durationsMs && typeof session.durationsMs === "object"
    ? session.durationsMs
    : {};
  session.durationsMs[session.last] = Math.max(0, Number(session.durationsMs[session.last]) || 0) + elapsedMs;
  session.totalActiveMs = Math.max(0, Number(session.totalActiveMs) || 0) + elapsedMs;
  session.lastAt = timestamp;
  return elapsedMs;
}

function checkpointSessionSnapshot(session, timestamp) {
  const durationsMs = session.durationsMs && typeof session.durationsMs === "object"
    ? { ...session.durationsMs }
    : {};
  let totalActiveMs = Math.max(0, Number(session.totalActiveMs) || 0);
  if (!totalActiveMs && Object.keys(durationsMs).length) {
    totalActiveMs = Object.values(durationsMs).reduce((sum, value) => sum + Math.max(0, Number(value) || 0), 0);
  }
  if (!Object.keys(durationsMs).length && Number(session.lastDurationMs) > 0 && session.last) {
    durationsMs[session.last] = Math.max(0, Number(session.lastDurationMs) || 0);
    totalActiveMs = Math.max(totalActiveMs, durationsMs[session.last]);
  }
  if (session.last && !(Number(session.leftAt) > 0)) {
    const lastSeenAt = Number(session.lastSeenAt) || timestamp;
    const activeUntil = Math.min(timestamp, lastSeenAt + CHECKPOINT_ACTIVE_TIMEOUT_MS);
    const currentElapsedMs = Math.max(0, activeUntil - (Number(session.lastAt) || activeUntil));
    durationsMs[session.last] = Math.max(0, Number(durationsMs[session.last]) || 0) + currentElapsedMs;
    totalActiveMs += currentElapsedMs;
  }
  return { durationsMs, totalActiveMs };
}

function recordCheckpoint(rawName, profileId, rawEvent = "visit", rawUserName = "", rawEventId = "", rawOccurredAt = 0) {
  const name = String(rawName || "").replace(/[^a-z0-9_-]/gi, "").slice(0, 48);
  const requestedEvent = String(rawEvent || "visit");
  const event = ["leave", "resume", "heartbeat"].includes(requestedEvent) ? requestedEvent : "visit";
  const clientId = String(profileId || "");
  const userName = String(rawUserName || "").replace(/\s+/g, " ").trim().slice(0, 16);
  if (!clientId) return 0;
  if (userName === "プレイヤー") {
    if (!checkpointExcludedIds[clientId] || checkpointSessions[clientId]) excludeCheckpointProfile(clientId);
    return 0;
  }
  if (checkpointExcludedIds[clientId]) return 0;
  const receivedAt = now();
  const requestedAt = Number(rawOccurredAt);
  const timestamp = Number.isFinite(requestedAt) && requestedAt >= receivedAt - 7 * 24 * 60 * 60 * 1000 && requestedAt <= receivedAt + 5 * 60 * 1000
    ? requestedAt
    : receivedAt;
  const eventId = String(rawEventId || "").replace(/[^a-z0-9_-]/gi, "").slice(0, 96);
  const session = checkpointSessions[clientId] || {
    userName: userName || "未設定",
    firstAt: timestamp,
    visited: [],
    last: "",
    lastAt: timestamp,
    durationsMs: {},
    totalActiveMs: 0,
    lastSeenAt: timestamp,
    leaveCount: 0,
    eventIds: []
  };
  session.eventIds = Array.isArray(session.eventIds) ? session.eventIds.slice(-255) : [];
  if (eventId && session.eventIds.includes(eventId)) return event === "visit" ? Number(checkpointCounts[name]) || 0 : Number(session.leaveCount) || 0;
  if (eventId) session.eventIds.push(eventId);
  if (userName) session.userName = userName;
  session.updatedAt = timestamp;

  if (event === "heartbeat") {
    if (!session.last) return 0;
    addCheckpointDuration(session, timestamp);
    session.lastSeenAt = timestamp;
    session.lastAt = timestamp;
    checkpointSessions[clientId] = session;
    saveCheckpointRecords();
    return session.leaveCount;
  }

  if (event === "leave") {
    if (!session.last) return 0;
    const elapsedMs = addCheckpointDuration(session, timestamp);
    session.lastSeenAt = timestamp;
    session.leftAt = timestamp;
    session.lastDurationMs = elapsedMs;
    session.leaveCount = Math.max(0, Number(session.leaveCount) || 0) + 1;
    checkpointSessions[clientId] = session;
    saveCheckpointRecords();
    return session.leaveCount;
  }

  if (event === "resume") {
    if (!session.last) return 0;
    session.leftAt = 0;
    session.lastAt = timestamp;
    session.lastSeenAt = timestamp;
    checkpointSessions[clientId] = session;
    saveCheckpointRecords();
    return session.leaveCount;
  }

  if (!name) throw new ApiError(400, "チェックポイント名が不正です。");
  addCheckpointDuration(session, timestamp);
  checkpointCounts[name] = Math.max(0, Number(checkpointCounts[name]) || 0) + 1;
  if (!session.visited.includes(name)) session.visited.push(name);
  session.leftAt = 0;
  session.last = name;
  session.lastAt = timestamp;
  session.lastSeenAt = timestamp;
  checkpointSessions[clientId] = session;
  saveCheckpointRecords();
  return checkpointCounts[name];
}

function checkpointReport(excludedProfileId = "") {
  const timestamp = now();
  const requestExcludedId = String(excludedProfileId || "");
  const dropoffs = {};
  const confirmedDropoffs = {};
  const dropoffDurationTotals = {};
  const checkpointDurationTotalsMs = {};
  const checkpointUserCounts = {};
  const players = [];
  let totalPlayMs = 0;
  let longestPlayMs = 0;
  for (const [clientId, session] of Object.entries(checkpointSessions)) {
    if (clientId === requestExcludedId || checkpointExcludedIds[clientId]) continue;
    const last = String(session.last || "unknown");
    const snapshot = checkpointSessionSnapshot(session, timestamp);
    totalPlayMs += snapshot.totalActiveMs;
    longestPlayMs = Math.max(longestPlayMs, snapshot.totalActiveMs);
    for (const [name, durationMs] of Object.entries(snapshot.durationsMs)) {
      const safeDurationMs = Math.max(0, Number(durationMs) || 0);
      checkpointDurationTotalsMs[name] = (checkpointDurationTotalsMs[name] || 0) + safeDurationMs;
      checkpointUserCounts[name] = (checkpointUserCounts[name] || 0) + 1;
    }
    dropoffs[last] = (dropoffs[last] || 0) + 1;
    if (Number(session.leftAt) > 0) {
      confirmedDropoffs[last] = (confirmedDropoffs[last] || 0) + 1;
      dropoffDurationTotals[last] = (dropoffDurationTotals[last] || 0) + Math.max(0, Number(session.lastDurationMs) || 0);
    }
    players.push({
      id: clientId.slice(0, 8),
      name: String(session.userName || `旧記録 #${clientId.slice(0, 8)}`),
      active: !(Number(session.leftAt) > 0) &&
        timestamp - (Number(session.lastSeenAt) || Number(session.lastAt) || 0) <= CHECKPOINT_ACTIVE_TIMEOUT_MS,
      currentCheckpoint: last,
      totalSeconds: Math.round(snapshot.totalActiveMs / 1000),
      checkpointSeconds: Object.fromEntries(Object.entries(snapshot.durationsMs)
        .map(([name, durationMs]) => [name, Math.round(Math.max(0, Number(durationMs) || 0) / 1000)]))
    });
  }
  const averageSecondsAtDropoff = Object.fromEntries(Object.entries(confirmedDropoffs).map(([name, count]) => [
    name,
    Math.round((dropoffDurationTotals[name] || 0) / Math.max(1, count) / 1000)
  ]));
  const checkpointDurations = Object.fromEntries(Object.entries(checkpointDurationTotalsMs)
    .sort((a, b) => b[1] - a[1])
    .map(([name, durationMs]) => [name, {
      totalSeconds: Math.round(durationMs / 1000),
      averageSeconds: Math.round(durationMs / Math.max(1, checkpointUserCounts[name] || 0) / 1000),
      users: checkpointUserCounts[name] || 0
    }]));
  players.sort((a, b) => b.totalSeconds - a.totalSeconds);
  const uniqueUsers = players.length;
  return {
    totals: checkpointCounts,
    uniqueUsers,
    totalPlaySeconds: Math.round(totalPlayMs / 1000),
    averagePlaySeconds: Math.round(totalPlayMs / Math.max(1, uniqueUsers) / 1000),
    longestPlaySeconds: Math.round(longestPlayMs / 1000),
    checkpointDurations,
    players,
    dropoffs: Object.fromEntries(Object.entries(dropoffs).sort((a, b) => b[1] - a[1])),
    confirmedDropoffs: Object.fromEntries(Object.entries(confirmedDropoffs).sort((a, b) => b[1] - a[1])),
    averageSecondsAtDropoff
  };
}

function saveModerationRecords() {
  fs.mkdirSync(MODERATION_DIR, { recursive: true });
  fs.writeFileSync(MODERATION_FILE, JSON.stringify(moderationRecords, null, 2), "utf8");
}

function moderationKey(req, clientId) {
  const address = req.socket?.remoteAddress || "unknown";
  const device = String(clientId || "missing").slice(0, 96);
  return crypto.createHash("sha256").update(`${address}|${device}`).digest("hex");
}

function moderationRecord(key) {
  return moderationRecords[key] || { strikes: 0, banned: false, updatedAt: 0 };
}

function registerModerationStrike(key) {
  const record = moderationRecord(key);
  record.strikes += 1;
  record.banned = record.strikes >= 5;
  record.updatedAt = now();
  moderationRecords[key] = record;
  saveModerationRecords();
  return record;
}

function isBlockedComment(value) {
  const text = String(value || "").normalize("NFKC").toLowerCase().replace(/\s+/g, "");
  if (!text) return false;
  const blocked = [
    /(?:セックス|性交|強姦|レイプ|輪姦|わいせつ|卑猥|露出狂|児童ポルノ)/,
    /(?:sex(?:ual)?|rape|porn|nudes?|molest|pedophil)/,
    /(?:首を切|四肢を切|内臓を|臓器を|血まみれ|惨殺|拷問|死体を損壊)/,
    /(?:decapitat|dismember|disembowel|gore|tortur|mutilat)/
  ];
  return blocked.some((pattern) => pattern.test(text));
}

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function now() {
  return Date.now();
}

function uid(prefix = "") {
  return prefix + crypto.randomBytes(6).toString("hex");
}

function roomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let attempt = 0; attempt < 100; attempt += 1) {
    let code = "";
    for (let i = 0; i < 4; i += 1) code += alphabet[Math.floor(Math.random() * alphabet.length)];
    if (!rooms.has(code)) return code;
  }
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

function cleanName(value) {
  const name = String(value || "").replace(/\s+/g, " ").trim().slice(0, 16);
  return name || "プレイヤー";
}

function cleanRoomId(value) {
  return String(value || "").replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 8);
}

function cleanSkinId(value) {
  const skinId = String(value || "");
  return PLAYER_SKINS.has(skinId) ? skinId : "hood";
}

function clampNumber(value, min, max, fallback) {
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(min, Math.min(max, num));
}

function createRoom(id) {
  const room = {
    id,
    phase: "lobby",
    round: 0,
    createdAt: now(),
    updatedAt: now(),
    hostId: null,
    settings: { ...DEFAULT_SETTINGS },
    players: new Map(),
    bodies: [],
    hitEffects: [],
    magicEffects: [],
    chat: [],
    events: [],
    sounds: [],
    meeting: null,
    battleStartedAt: 0,
    preparationEndsAt: 0,
    operatorSelectEndsAt: 0,
    operatorTurnOrder: [],
    operatorTurnIndex: 0,
    winner: null,
    finishReason: "",
    ideaWinnerId: "",
    ideaWinnerIds: [],
    pendingIdeaVictoryAt: 0,
    sabotage: null,
    activeEmps: [],
    gravityZones: [],
    alchemyObjects: [],
    hazardFields: [],
    thrownItems: [],
    groundItems: [],
    resolvePoint: null,
    lastTickAt: now(),
    doorState: {},
    destroyedCameras: {},
    utilityViews: new Map(),
    doorLog: [],
    matchmaking: null,
    soloMission: null,
    casual: false,
    rankUpdated: false
  };
  rooms.set(id, room);
  return room;
}

function getRoom(id) {
  return rooms.get(cleanRoomId(id));
}

function normalizeMapId(value) {
  const mapId = String(value || "").trim();
  return Object.hasOwn(MAPS, mapId) ? mapId : DEFAULT_SETTINGS.mapId;
}

function getMap(room) {
  return MAPS[room.settings.mapId] || MAPS.station;
}

function createResolvePoint(room) {
  const map = getMap(room);
  const obstacles = [
    ...(map.stations || []),
    ...(map.objects || []),
    ...room.players.values()
  ];
  const regions = (map.rooms || []).filter((region) => region.w > 120 && region.h > 120);
  let best = null;
  for (let attempt = 0; attempt < 320; attempt += 1) {
    const region = regions[Math.floor(Math.random() * regions.length)];
    if (!region) break;
    const margin = Math.min(64, Math.max(34, Math.min(region.w, region.h) * 0.16));
    const x = region.x + margin + Math.random() * Math.max(1, region.w - margin * 2);
    const y = region.y + margin + Math.random() * Math.max(1, region.h - margin * 2);
    if (!isWalkable(room, x, y, map.playerRadius)) continue;
    const spawnClearance = map.spawns.length
      ? Math.min(...map.spawns.map((spawn) => distance({ x, y }, spawn)))
      : Infinity;
    if (spawnClearance < 420) continue;
    const clearance = obstacles.length
      ? Math.min(...obstacles.map((obstacle) => distance({ x, y }, obstacle)))
      : Infinity;
    if (!best || clearance > best.clearance) best = { x, y, room: region.id, clearance };
    if (clearance >= RESOLVE_POINT_CLEARANCE) break;
  }
  if (!best) {
    const fallbackRegion = regions.find((region) => region.id !== "atrium") || regions[0];
    const x = fallbackRegion ? fallbackRegion.x + fallbackRegion.w / 2 : map.width * 0.15;
    const y = fallbackRegion ? fallbackRegion.y + fallbackRegion.h / 2 : map.height * 0.15;
    best = { x, y, room: fallbackRegion?.id || "corridor", clearance: 0 };
  }
  const reward = Math.random() < 0.5 ? "grit" : "reason";
  return {
    id: uid("resolve_"),
    type: "resolvePoint",
    label: "意志の焦点",
    effectLabel: reward === "grit" ? "踏ん張り+1" : "押し込み+1",
    effectKind: "resolve",
    reward,
    x: Math.round(best.x),
    y: Math.round(best.y),
    room: best.room,
    interactive: true,
    useRange: RESOLVE_POINT_USE_RANGE,
    radius: 54
  };
}

function touch(room) {
  room.updatedAt = now();
}

function pushEvent(room, text) {
  room.events.push({ id: uid("e_"), at: now(), text });
  room.events = room.events.slice(-36);
}

function setImmediateFeedback(player, label, detail) {
  if (!player) return;
  player.lastImmediateFeedback = {
    label: String(label || "結果"),
    detail: String(detail || ""),
    at: now()
  };
}

function pushSound(room, type, source, options = {}) {
  room.sounds.push({
    id: uid("sound_"),
    type,
    x: Math.round(source.x),
    y: Math.round(source.y),
    ownerId: String(options.ownerId || source.id || ""),
    maxDistance: Number(options.maxDistance || 1000),
    volume: Number(options.volume || 1),
    sourceKind: String(options.sourceKind || "player"),
    variant: String(options.variant || ""),
    at: now()
  });
  room.sounds = room.sounds.slice(-96);
}

function createGunnerAmmo() {
  return Object.fromEntries(GUNNER_WEAPON_ORDER.map((id) => [id, GUNNER_WEAPONS[id].maxAmmo]));
}

function gunnerWeaponFor(player) {
  return GUNNER_WEAPONS[player?.gunnerWeapon] || GUNNER_WEAPONS[DEFAULT_GUNNER_WEAPON];
}

function gunnerWeaponAvailable(player, weaponId) {
  if ((player?.unavailableGunnerWeapons || []).includes(weaponId)) return false;
  return hasOperatorAccess(player, "gunner") || (player?.purchasedWeapons || []).includes(weaponId);
}

function hasFirearmAccess(player) {
  return GUNNER_WEAPON_ORDER.some((weaponId) => gunnerWeaponAvailable(player, weaponId));
}

function gunnerWeaponState(player) {
  return GUNNER_WEAPON_ORDER.map((id) => {
    const weapon = GUNNER_WEAPONS[id];
    return {
      ...weapon,
      ammo: Math.max(0, Number(player?.gunnerAmmo?.[id]) || 0),
      available: gunnerWeaponAvailable(player, id)
    };
  });
}

function pushHitEffect(room, target, hitZone, lethal = false) {
  room.hitEffects.push({
    id: uid("hit_"),
    playerId: target.id,
    x: Math.round(target.x),
    y: Math.round(target.y),
    hitZone: hitZone === "head" ? "head" : "body",
    lethal: Boolean(lethal),
    at: now()
  });
  room.hitEffects = room.hitEffects.slice(-32);
}

function pushMagicEffect(room, type, source, options = {}) {
  room.magicEffects.push({
    id: uid("magic_"),
    type,
    x: Math.round(source.x),
    y: Math.round(source.y),
    radius: Number(options.radius || 0),
    targetX: Number.isFinite(options.targetX) ? Math.round(options.targetX) : null,
    targetY: Number.isFinite(options.targetY) ? Math.round(options.targetY) : null,
    playerId: String(options.playerId || source.id || ""),
    targetId: String(options.targetId || ""),
    viewerId: String(options.viewerId || ""),
    variant: String(options.variant || ""),
    mode: String(options.mode || ""),
    effectKind: String(options.effectKind || ""),
    markerCount: Math.max(1, Math.floor(Number(options.markerCount) || 1)),
    durationMs: Math.max(0, Number(options.durationMs) || 0),
    at: now()
  });
  room.magicEffects = room.magicEffects.slice(-48);
}

function pushGainAte(room, player, effectKind, options = {}) {
  if (!player || !effectKind) return;
  pushMagicEffect(room, `gain-${effectKind}`, player, {
    radius: Number(options.radius) || 82,
    playerId: player.id,
    effectKind,
    variant: String(options.variant || ""),
    markerCount: Math.max(1, Math.floor(Number(options.markerCount) || 1)),
    durationMs: Math.max(900, Number(options.durationMs) || 1500)
  });
}

function grantCredits(room, player, rawAmount, source = "") {
  const amount = Math.max(0, Math.floor(Number(rawAmount) || 0));
  if (!amount) return 0;
  player.credits = (Number(player.credits) || 0) + amount;
  pushGainAte(room, player, "credits", {
    variant: source || `credits:${amount}`,
    markerCount: amount
  });
  return amount;
}

// Gold is an instant result rather than physical inventory. Every producer
// must finish through this one function so Quantum Control and Root Hacker
// cannot drift to different payouts or leave an ingot behind.
function acquireGoldAsCredits(room, player, source = "gold-acquisition") {
  return grantCredits(room, player, GOLD_INSTANT_CREDITS, source);
}

function pushMapObjectGainAtes(room, player, effectKind) {
  const categories = {
    stamina: ["stamina"], credits: ["credits"], mana: ["mana"],
    acceleration: ["acceleration"], luckBoost: ["luckBoost"], overheal: ["overheal"],
    footBath: ["heal", "statusRecovery", "cooldownReduction"],
    relaxation: ["acceleration"],
    herbalRecovery: ["heal"],
    healthyMeal: ["heal", "stamina", "mana"],
    mineralWater: ["stamina"],
    fullRecovery: ["heal", "overheal"],
    decoy: ["stamina"], heal: ["heal"]
  }[effectKind] || [];
  categories.forEach((category, index) => pushGainAte(room, player, category, {
    variant: `object:${effectKind}:${index}`,
    durationMs: 1450 + index * 120
  }));
}

function pushDoorLog(room, text) {
  room.doorLog.push({ id: uid("d_"), at: now(), text });
  room.doorLog = room.doorLog.slice(-24);
}

function pushChat(room, player, message) {
  const text = String(message || "").trim().slice(0, 180);
  if (!text) return;
  room.chat.push({
    id: uid("c_"),
    at: now(),
    playerId: player.id,
    name: player.name,
    killRate: profileKillRate(profileFor(player)),
    message: text,
    muted: Boolean(player.chatMuted)
  });
  room.chat = room.chat.slice(-60);
  const profile = profileFor(player);
  if (profile) {
    profile.messages = [...(Array.isArray(profile.messages) ? profile.messages : []), {
      at: now(),
      message: text,
      roomId: room.id
    }].slice(-500);
    profile.updatedAt = now();
    savePlayerProfiles();
  }
}

function cleanChatMessage(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, 180);
}

function addPlayer(room, name, isBot = false, skinId = "hood", profileId = "") {
  const map = getMap(room);
  const index = room.players.size;
  const spawn = map.spawns[index % map.spawns.length];
  const player = {
    id: uid(isBot ? "bot_" : "p_"),
    name: cleanName(name),
    isBot,
    profileId: isBot ? "" : String(profileId || ""),
    midJoinAvailable: false,
    host: false,
    color: COLORS[index % COLORS.length],
    skinId: isBot ? "operator" : cleanSkinId(skinId),
    role: "unassigned",
    special: null,
    operatorId: "",
    operatorReady: false,
    alive: true,
    ejected: false,
    chatMuted: false,
    x: spawn.x,
    y: spawn.y,
    vx: 0,
    vy: 0,
    aimX: 0,
    aimY: 1,
    taskList: [],
    taskAutoReadyAt: 0,
    taskPresenceTaskId: "",
    taskPresenceSince: 0,
    killsThisRound: 0,
    totalKills: 0,
    luminousUsed: false,
    luminousActive: false,
    luminousContribution: 0,
    abilityContribution: 0,
    taskContribution: 0,
    lastLuminousResult: "",
    lastLuminousResultAt: 0,
    killReadyAt: 0,
    attackTargetId: "",
    attackResolveAt: 0,
    aimTargetId: "",
    aimStartedAt: 0,
    aimReadyAt: 0,
    aimExpiresAt: 0,
    aimSourceX: 0,
    aimSourceY: 0,
    aimTargetX: 0,
    aimTargetY: 0,
    lastAttackResult: "",
    lastAttackResultAt: 0,
    gunReadyAt: 0,
    gunnerWeapon: DEFAULT_GUNNER_WEAPON,
    gunnerAmmo: createGunnerAmmo(),
    gunFiring: false,
    gunFiringWeapon: "",
    gunFiringSince: 0,
    gunnerBurstRoundsRemaining: 0,
    gunnerBurstEnhanceLevel: 0,
    gunnerBurstGbo: false,
    gunnerBurstGboWeapon: "",
    enhanceChargeStartedAt: 0,
    enhanceChargeKind: "",
    enhanceChargeItemId: "",
    enhanceChargeId: "",
    enhanceChargeReleasedAt: 0,
    enhanceChargeAcceptedHoldMs: 0,
    gunnerLastShotAt: 0,
    gunnerReloadUntil: 0,
    gunnerReloadWeapon: "",
    unavailableGunnerWeapons: [],
    gunnerSpecialAmmoType: "",
    gunnerSpecialAmmoWeapon: "",
    gunnerSpecialAmmoRounds: 0,
    gunnerSpecialAmmoInventory: { weak: 0, shock: 0 },
    gunnerSpecialAmmoReadyAt: 0,
    gunnerSpecialAmmoBag: [],
    hsgUntil: 0,
    hsgReadyAt: 0,
    hsgPreparedMode: "",
    hsgPreparedEnhanceLevel: 0,
    killCamera: null,
    gunnerSnipingActive: false,
    gunnerAimTargetId: "",
    timedAccelerationEffects: [],
    heavyWeapons: [],
    sabotageReadyAt: 0,
    dodgeReadyAt: 0,
    dodgeActiveUntil: 0,
    slashActiveUntil: 0,
    slashPerfectUntil: 0,
    slashPerfectReadyAt: 0,
    slashGuardInputReleased: true,
    slashDetachedGuardUntil: 0,
    teleportReadyAt: 0,
    floraReadyAt: 0,
    limitBreakActive: false,
    limitBreakEndsAt: 0,
    limitBreakManaCarry: 0,
    limitBreakStacks: 0,
    fighterEnergyCharge: 0,
    fighterEnergyPeak: 0,
    fighterEnergyChargeReadyAt: 0,
    empReadyAt: 0,
    itemDisabledUntil: 0,
    slowedUntil: 0,
    taserSlowedUntil: 0,
    shockSlowedUntil: 0,
    gravityStormSlowUntil: 0,
    gravityStormSlowMultiplier: 1,
    lastGravityStormDamage: 0,
    sleepingUntil: 0,
    resting: false,
    unconsciousUntil: 0,
    gravityPinnedUntil: 0,
    abilityDisabledUntil: 0,
    overhealSpeedUntil: 0,
    floraMode: "heal",
    lastMysteryResult: "",
    lastMysteryResultAt: 0,
    movementMode: "idle",
    movementAccEnabled: true,
    airborneUntil: 0,
    jumpPreparingAt: 0,
    jumpPrepareDx: 0,
    jumpPrepareDy: 1,
    jumpMotion: null,
    falling: false,
    levitationEngaged: false,
    levitationManaCarry: 0,
    sharedLevitationActive: false,
    clairvoyanceActive: false,
    clairvoyanceManaCarry: 0,
    bodyHits: 0,
    overheal: 0,
    credits: 0,
    lastPassiveCreditAt: now(),
    mana: STARTING_MANA,
    manaStateEnteredAt: now(),
    meditatingUntil: 0,
    renkiTargetMana: null,
    rationalFreeAbilityReadyAt: 0,
    gritCharges: 0,
    reasonCharges: 0,
    iaiCharges: 0,
    ideaProgressStartedAt: 0,
    ideaProgressMs: 0,
    ideaProgressUpdatedAt: 0,
    ideaStage: 0,
    ideaFirstAspect: "",
    desireBias: "",
    desireBiasBag: [],
    lastDesireBias: "",
    desireIdeaForfeited: false,
    truthCharges: 0,
    beautyCharges: 0,
    goodActive: false,
    ascensionStartedAt: 0,
    ascensionUntil: 0,
    objectCooldowns: {},
    objectContactUsedIds: [],
    objectLuckBonus: 0,
    objectLuckUntil: 0,
    donationLuckBonus: 0,
    stamina: MAX_STORED_STAMINA,
    staminaUpdatedAt: now(),
    staminaManaOverflow: 0,
    autoManaToStaminaFeedbackAt: 0,
    speedMultiplier: 1,
    dodgeDurationBonusMs: 0,
    warpCharges: 0,
    fireJutsuCharges: 0,
    substitutionCharges: 0,
    itemInventory: {},
    poisonStatus: null,
    burnStatus: null,
    statusImmunityFeedbackAt: 0,
    quantumMode: "nuclear-transmutation",
    gravityMode: "accelerate",
    gravityTargetId: "",
    gravityTimeMode: "",
    gravityTimeTargetId: "",
    gravityTimeEndsAt: 0,
    timeKeeperEndsAt: 0,
    timeStoppedUntil: 0,
    gravityStormReadyAt: 0,
    alchemyReviveUsed: false,
    vibeCodingReadyAt: 0,
    vibeCodingCooldownMs: 0,
    manaGpuDrainCarry: 0,
    manaGpuCooldownCreditMs: 0,
    inventions: [],
    computerActive: false,
    particleCannonUntil: 0,
    particleCannonNextAt: 0,
    particleCannonPerformanceMultiplier: 1,
    hackerRootActive: false,
    hackerRootHealthSnapshot: null,
    exiled: false,
    routePartnerIds: [],
    routeSharedSince: 0,
    routeDamageReadyAt: 0,
    smartphoneUntil: 0,
    smartphoneAction: "",
    smartphoneSuspectId: "",
    smartphoneEvidenceKind: "",
    smartphoneSuspectId: "",
    luck: 0,
    drone: {
      active: false,
      x: spawn.x,
      y: spawn.y,
      vx: 0,
      vy: 0,
      readyAt: 0,
      altitude: DRONE_ALTITUDE_MAX,
      destroyed: false,
      movementMode: "idle"
    },
    emergenciesLeft: room.settings.emergencyLimit,
    inVent: false,
    ventId: "",
    nextBotActionAt: now() + 1200 + Math.floor(Math.random() * 1200),
    botTarget: null,
    botTargetUntil: 0,
    botTaskTargetId: "",
    botTaskPresenceSince: 0,
    botTaskPresenceLastTickAt: 0,
    botTaskPathFailures: 0,
    botTaskBlockedUntilById: {},
    botDeceptionPhase: "",
    botDeceptionUntil: 0,
    botDeceptionTargetId: "",
    botDeceptionStationId: "",
    botDeceptionPresenceSince: 0,
    botDeceptionCycle: 0,
    navPath: [],
    navTargetX: 0,
    navTargetY: 0,
    navCalculatedAt: 0,
    nextBotSabotageAt: now() + 12_000 + Math.floor(Math.random() * 6000),
    nextBotVentAt: 0,
    nextBotDefenseDecisionAt: now() + 1800 + Math.floor(Math.random() * 1800),
    botDefensePlannedAt: 0,
    botDefenseKind: "",
    botDefenseTargetId: "",
    botRetaliationTargetId: "",
    botRetaliationUntil: 0,
    botWitnessTargetId: "",
    botWitnessUntil: 0,
    botWitnessEvidenceKind: "",
    botVisibleThrowObservations: [],
    botKillDecision: null,
    nextBotClairvoyanceAt: now() + 4000 + Math.floor(Math.random() * 6000),
    botClairvoyanceUntil: 0,
    botClairvoyanceObservedUntil: 0,
    botClairvoyanceTargetId: "",
    botClairvoyanceTargetX: 0,
    botClairvoyanceTargetY: 0,
    botRetaliationTargetId: "",
    botRetaliationUntil: 0,
    botWitnessTargetId: "",
    botWitnessUntil: 0,
    heardSoundAt: 0,
    heardWaypointUntil: 0,
    heardWaypointX: 0,
    heardWaypointY: 0,
    lastSeenAt: now(),
    movementSession: "",
    movementSessionStartedAt: 0,
    lastMovementSeq: -1,
    lastMovementClock: 0,
    lastMovementReceivedAt: 0,
    lastMovementDx: 0,
    lastMovementDy: 0,
    lastMovementDash: false,
    lastMovementSlow: false,
    lastMoveAt: now()
  };
  if (isBot) room.casual = true;

  if (!room.hostId && !isBot) {
    room.hostId = player.id;
    player.host = true;
  }

  room.players.set(player.id, player);
  pushEvent(room, `${player.name} が入室しました。`);
  touch(room);
  return player;
}

function addDefaultOnlineBots(room) {
  if (room.soloMission || room.phase !== "lobby") return;
  const currentBotCount = [...room.players.values()].filter((player) => player.isBot).length;
  for (let index = currentBotCount + 1; index <= DEFAULT_ONLINE_BOT_COUNT; index += 1) {
    addPlayer(room, `Bot ${index}`, true);
  }
}

function waitingMatchmakingRoom(identityKey, mapId) {
  const timestamp = now();
  const requestedMapId = normalizeMapId(mapId);
  return [...rooms.values()]
    .filter((room) => {
      if (room.phase !== "lobby" || room.soloMission || room.matchmaking?.status !== "waiting") return false;
      if (Number(room.matchmaking.expiresAt) <= timestamp) return false;
      if (normalizeMapId(room.settings?.mapId) !== requestedMapId) return false;
      const humans = [...room.players.values()].filter((player) => !player.isBot);
      return humans.length === 1 && humans[0].moderationKey !== identityKey;
    })
    .sort((left, right) => Number(left.matchmaking.createdAt) - Number(right.matchmaking.createdAt))[0] || null;
}

function createMatchedPlayer(room, name, skinId, profileId, identityKey) {
  const player = addPlayer(room, name, false, skinId, profileId);
  player.moderationKey = identityKey;
  return player;
}

function leaveRoom(room, player) {
  const playerId = player.id;
  const playerName = player.name;
  const wasHost = room.hostId === playerId;
  const orderIndex = room.operatorTurnOrder.indexOf(playerId);
  const canOpenMidJoinSlot = ["selecting", "playing", "meeting"].includes(room.phase) &&
    player.alive && !player.ejected && !player.isBot;

  if (canOpenMidJoinSlot) {
    const timestamp = now();
    player.name = "途中参加待ち";
    player.isBot = true;
    player.midJoinAvailable = true;
    player.host = false;
    player.moderationKey = "";
    player.vx = 0;
    player.vy = 0;
    player.movementMode = "idle";
    player.airborneUntil = 0;
    player.falling = false;
    player.levitationEngaged = false;
    player.levitationManaCarry = 0;
    player.sharedLevitationActive = false;
    player.clairvoyanceActive = false;
    player.clairvoyanceManaCarry = 0;
    player.inVent = false;
    player.ventId = "";
    player.drone.active = false;
    player.nextBotActionAt = timestamp + 300;
    player.nextBotClairvoyanceAt = timestamp + 4000 + Math.floor(Math.random() * 6000);
    player.botClairvoyanceUntil = 0;
    player.botClairvoyanceObservedUntil = 0;
    player.botClairvoyanceTargetId = "";
    player.botClairvoyanceTargetX = player.x;
    player.botClairvoyanceTargetY = player.y;
    player.lastSeenAt = timestamp;
    clearAttackState(player);
    room.utilityViews.delete(playerId);
    if (room.meeting) delete room.meeting.votes[playerId];

    const humans = [...room.players.values()].filter((entry) => !entry.isBot);
    if (wasHost || !room.players.has(room.hostId) || room.players.get(room.hostId)?.isBot) {
      room.hostId = humans[0]?.id || null;
    }
    room.players.forEach((entry) => {
      entry.host = entry.id === room.hostId;
    });

    pushEvent(room, `${playerName} が退出しました。途中参加枠を開放しました。`);
    if (room.phase === "selecting") advanceOperatorTurn(room);
    if (room.phase === "meeting") maybeEndMeeting(room);
    touch(room);
    return { roomDeleted: false, newHostId: room.hostId || "", midJoinOpen: true };
  }

  room.players.delete(playerId);
  room.utilityViews.delete(playerId);
  room.bodies = room.bodies.filter((body) => body.playerId !== playerId);

  if (orderIndex >= 0) {
    room.operatorTurnOrder.splice(orderIndex, 1);
    if (orderIndex < room.operatorTurnIndex) room.operatorTurnIndex -= 1;
  }

  if (room.meeting) {
    delete room.meeting.votes[playerId];
    for (const [voterId, targetId] of Object.entries(room.meeting.votes)) {
      if (targetId === playerId) room.meeting.votes[voterId] = "skip";
    }
  }

  const humans = [...room.players.values()].filter((entry) => !entry.isBot);
  const hasMidJoinSlot = [...room.players.values()].some((entry) => entry.midJoinAvailable);
  if (humans.length === 0 && !hasMidJoinSlot) {
    rooms.delete(room.id);
    return { roomDeleted: true, newHostId: "" };
  }

  if (wasHost || !room.players.has(room.hostId)) room.hostId = humans[0]?.id || null;
  room.players.forEach((entry) => {
    entry.host = entry.id === room.hostId;
  });

  pushEvent(room, `${playerName} が退出しました。`);
  if (room.phase === "selecting") advanceOperatorTurn(room);
  if (room.phase === "meeting") maybeEndMeeting(room);
  checkWin(room);
  touch(room);
  return { roomDeleted: false, newHostId: room.hostId || "", midJoinOpen: false };
}

function availableMidJoinSlot(room) {
  return [...room.players.values()].find((entry) => (
    entry.midJoinAvailable && entry.alive && !entry.ejected
  )) || null;
}

function claimMidJoinSlot(room, player, name, skinId = "hood") {
  player.name = cleanName(name);
  player.isBot = false;
  player.skinId = cleanSkinId(skinId);
  player.midJoinAvailable = false;
  player.host = false;
  player.vx = 0;
  player.vy = 0;
  player.movementMode = "idle";
  player.nextBotActionAt = now() + 1200;
  player.lastSeenAt = now();
  if (room.meeting) delete room.meeting.votes[player.id];

  const currentHost = room.players.get(room.hostId);
  if (!currentHost || currentHost.isBot) room.hostId = player.id;
  room.players.forEach((entry) => {
    entry.host = entry.id === room.hostId;
  });
  pushEvent(room, `${player.name} が途中参加しました。`);
  touch(room);
  return player;
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function assignTasks(map, count) {
  const downloads = map.stations.filter((station) => station.type === "task" && station.task === "download");
  const uploads = map.stations.filter((station) => station.type === "task" && station.task === "upload");
  const total = Math.max(6, Math.min(Math.floor(count), 30));
  const pools = {
    download: shuffle(downloads),
    upload: shuffle(uploads)
  };
  const typeCounts = { download: 0, upload: 0 };
  const tasks = [];

  for (let index = 0; index < total; index += 1) {
    const preferredType = index % 2 === 0 ? "download" : "upload";
    const type = pools[preferredType].length ? preferredType : preferredType === "download" ? "upload" : "download";
    const pool = pools[type];
    if (!pool.length) break;
    const typeIndex = typeCounts[type];
    const station = pool[typeIndex % pool.length];
    typeCounts[type] += 1;
    tasks.push({
      id: uid("task_"),
      type,
      label: `${TASK_LABELS[type] || station.label} ${typeCounts[type]}`,
      stationId: station.id,
      done: false
    });
  }

  return tasks;
}

function startGame(room) {
  const players = [...room.players.values()];
  if (players.length < 2) {
    throw new ApiError(400, "2人以上で開始できます。Bot追加でも開始できます。");
  }

  const map = getMap(room);
  const timestamp = now();
  const attackerCount = Math.max(1, Math.min(players.length - 1, Math.floor(room.settings.attackerCount)));
  room.killRateAttackerTarget = Math.max(1, Math.ceil((players.length - attackerCount) / attackerCount));
  const ordered = shuffle(players);
  const host = room.players.get(room.hostId);
  let attackerPlayers = ordered.slice(0, attackerCount);
  if (room.settings.hostTeam === "attacker" && host) {
    attackerPlayers = [host, ...ordered.filter((player) => player.id !== host.id)].slice(0, attackerCount);
  } else if (room.settings.hostTeam === "defender" && host) {
    attackerPlayers = ordered.filter((player) => player.id !== host.id).slice(0, attackerCount);
  }
  const attackers = new Set(attackerPlayers.map((player) => player.id));

  players.forEach((player, index) => {
    const spawn = map.spawns[index % map.spawns.length];
    player.role = attackers.has(player.id) ? "attacker" : "defender";
    player.midJoinAvailable = false;
    player.special = null;
    player.operatorId = "";
    player.operatorReady = false;
    player.alive = true;
    player.ejected = false;
    player.botMatchEliminatedById = "";
    player.chatMuted = false;
    player.x = spawn.x;
    player.y = spawn.y;
    player.vx = 0;
    player.vy = 0;
    player.aimX = 0;
    player.aimY = 1;
    player.taskList = [];
    player.taskAutoReadyAt = 0;
    player.taskPresenceTaskId = "";
    player.taskPresenceSince = 0;
    player.killsThisRound = 0;
    player.totalKills = 0;
    player.luminousUsed = false;
    player.luminousActive = false;
    player.luminousContribution = 0;
    player.abilityContribution = 0;
    player.taskContribution = 0;
    player.lastLuminousResult = "";
    player.lastLuminousResultAt = 0;
    player.killReadyAt = 0;
    clearAttackState(player);
    player.lastAttackResult = "";
    player.lastAttackResultAt = 0;
    player.gunReadyAt = 0;
    player.gunnerWeapon = DEFAULT_GUNNER_WEAPON;
    player.gunnerAmmo = createGunnerAmmo();
    player.gunFiring = false;
    player.gunFiringWeapon = "";
    player.gunFiringSince = 0;
    player.gunnerBurstRoundsRemaining = 0;
    player.gunnerBurstEnhanceLevel = 0;
    player.gunnerBurstGbo = false;
    player.gunnerBurstGboWeapon = "";
    player.gunnerLastShotAt = 0;
    player.gunnerReloadUntil = 0;
    player.gunnerReloadWeapon = "";
    player.unavailableGunnerWeapons = [];
    player.gunnerSpecialAmmoType = "";
    player.gunnerSpecialAmmoWeapon = "";
    player.gunnerSpecialAmmoRounds = 0;
    player.gunnerSpecialAmmoInventory = { weak: 0, shock: 0 };
    player.gunnerSpecialAmmoReadyAt = 0;
    player.gunnerSpecialAmmoBag = [];
    player.hsgUntil = 0;
    player.hsgReadyAt = 0;
    player.hsgPreparedMode = "";
    player.hsgPreparedEnhanceLevel = 0;
    player.killCamera = null;
    player.gunnerSnipingActive = false;
    player.gunnerAimTargetId = "";
    player.timedAccelerationEffects = [];
    player.heavyWeapons = [];
    player.sabotageReadyAt = 0;
    player.dodgeReadyAt = 0;
    player.dodgeActiveUntil = 0;
    player.slashActiveUntil = 0;
    player.slashPerfectUntil = 0;
    player.slashPerfectReadyAt = 0;
    player.slashDetachedGuardUntil = 0;
    player.slashGuardInputReleased = true;
    player.teleportReadyAt = 0;
    player.floraReadyAt = 0;
    player.limitBreakActive = false;
    player.limitBreakEndsAt = 0;
    player.limitBreakManaCarry = 0;
    player.limitBreakStacks = 0;
    player.fighterEnergyCharge = 0;
    player.fighterEnergyPeak = 0;
    player.fighterEnergyChargeReadyAt = 0;
    player.empReadyAt = 0;
    player.itemDisabledUntil = 0;
    player.slowedUntil = 0;
    player.taserSlowedUntil = 0;
    player.shockSlowedUntil = 0;
    player.gravityStormSlowUntil = 0;
    player.gravityStormSlowMultiplier = 1;
    player.lastGravityStormDamage = 0;
    player.sleepingUntil = 0;
    player.resting = false;
    player.unconsciousUntil = 0;
    player.gravityPinnedUntil = 0;
    player.abilityDisabledUntil = 0;
    player.overhealSpeedUntil = 0;
    player.floraMode = "heal";
    player.lastMysteryResult = "";
    player.lastMysteryResultAt = 0;
    player.movementMode = "idle";
    player.movementAccEnabled = true;
    player.airborneUntil = 0;
    player.falling = false;
    player.levitationEngaged = false;
    player.levitationManaCarry = 0;
    player.sharedLevitationActive = false;
    player.clairvoyanceActive = false;
    player.clairvoyanceManaCarry = 0;
    player.bodyHits = 0;
    player.overheal = 0;
    player.credits = 0;
    player.lastPassiveCreditAt = timestamp;
    player.mana = STARTING_MANA;
    player.manaStateEnteredAt = timestamp;
    player.meditatingUntil = 0;
    player.renkiTargetMana = null;
    player.rationalFreeAbilityReadyAt = 0;
    player.gritCharges = 0;
    player.reasonCharges = 0;
    player.iaiCharges = 0;
    player.ideaProgressStartedAt = 0;
    player.ideaProgressMs = 0;
    player.ideaProgressUpdatedAt = 0;
    player.ideaStage = 0;
    player.ideaFirstAspect = "";
    player.desireBias = "";
    player.desireIdeaForfeited = false;
    player.truthCharges = 0;
    player.beautyCharges = 0;
    player.goodActive = false;
    player.ascensionStartedAt = 0;
    player.ascensionUntil = 0;
    player.gravityMode = "accelerate";
    player.gravityTargetId = "";
    player.gravityTimeMode = "";
    player.gravityTimeTargetId = "";
    player.gravityTimeEndsAt = 0;
    player.timeKeeperEndsAt = 0;
    player.timeStoppedUntil = 0;
    player.gravityStormReadyAt = 0;
    player.alchemyReviveUsed = false;
    player.vibeCodingReadyAt = 0;
    player.vibeCodingCooldownMs = 0;
    player.manaGpuDrainCarry = 0;
    player.manaGpuCooldownCreditMs = 0;
    player.inventions = [];
    player.computerActive = false;
    player.particleCannonUntil = 0;
    player.particleCannonNextAt = 0;
    player.particleCannonPerformanceMultiplier = 1;
    player.hackerRootActive = false;
    player.hackerRootHealthSnapshot = null;
    player.exiled = false;
    player.routePartnerIds = [];
    player.routeSharedSince = 0;
    player.routeDamageReadyAt = 0;
    player.smartphoneUntil = 0;
    player.smartphoneAction = "";
    player.smartphoneSuspectId = "";
    player.smartphoneEvidenceKind = "";
    player.smartphoneSuspectId = "";
    player.luck = 1;
    player.objectCooldowns = {};
    player.objectContactUsedIds = [];
    player.objectLuckBonus = 0;
    player.objectLuckUntil = 0;
    player.donationLuckBonus = 0;
    player.stamina = MAX_STORED_STAMINA;
    player.staminaUpdatedAt = timestamp;
    player.staminaManaOverflow = 0;
    player.autoManaToStaminaFeedbackAt = 0;
    player.speedMultiplier = 1;
    player.dodgeDurationBonusMs = 0;
    player.warpCharges = 0;
    player.fireJutsuCharges = 0;
    player.substitutionCharges = 0;
    player.itemInventory = {};
    player.poisonStatus = null;
    player.burnStatus = null;
    player.statusImmunityFeedbackAt = 0;
    player.quantumMode = "nuclear-transmutation";
    player.drone = {
      active: false,
      x: spawn.x,
      y: spawn.y,
      vx: 0,
      vy: 0,
      readyAt: 0,
      altitude: DRONE_ALTITUDE_MAX,
      destroyed: false,
      movementMode: "idle"
    };
    player.emergenciesLeft = room.settings.emergencyLimit;
    player.inVent = false;
    player.ventId = "";
    player.nextBotActionAt = timestamp + 1000 + Math.floor(Math.random() * 2000);
    player.botTaskTargetId = "";
    player.botTaskPresenceSince = 0;
    player.botTaskPresenceLastTickAt = 0;
    player.botTaskPathFailures = 0;
    player.botTaskBlockedUntilById = {};
    player.botDeceptionPhase = "";
    player.botDeceptionUntil = 0;
    player.botDeceptionTargetId = "";
    player.botDeceptionStationId = "";
    player.botDeceptionPresenceSince = 0;
    player.botDeceptionCycle = 0;
    player.botTarget = null;
    player.botTargetUntil = 0;
    player.navPath = [];
    player.navTargetX = 0;
    player.navTargetY = 0;
    player.navCalculatedAt = 0;
    player.nextBotSabotageAt = timestamp + 10_000 + Math.floor(Math.random() * 8000);
    player.nextBotVentAt = 0;
    player.nextBotDefenseDecisionAt = timestamp + 1800 + Math.floor(Math.random() * 1800);
    player.botDefensePlannedAt = 0;
    player.botDefenseKind = "";
    player.botDefenseTargetId = "";
    player.botRetaliationTargetId = "";
    player.botRetaliationUntil = 0;
    player.botWitnessTargetId = "";
    player.botWitnessUntil = 0;
    player.botWitnessEvidenceKind = "";
    player.botVisibleThrowObservations = [];
    player.botKillDecision = null;
    player.nextBotClairvoyanceAt = timestamp + 4000 + Math.floor(Math.random() * 6000);
    player.botClairvoyanceUntil = 0;
    player.botClairvoyanceObservedUntil = 0;
    player.botClairvoyanceTargetId = "";
    player.botClairvoyanceTargetX = player.x;
    player.botClairvoyanceTargetY = player.y;
    player.botRetaliationTargetId = "";
    player.botRetaliationUntil = 0;
    player.botWitnessTargetId = "";
    player.botWitnessUntil = 0;
    player.botWitnessEvidenceKind = "";
    player.botVisibleThrowObservations = [];
    player.heardSoundAt = 0;
    player.heardWaypointUntil = 0;
    player.heardWaypointX = 0;
    player.heardWaypointY = 0;
    player.lastMoveAt = timestamp;
  });

  room.phase = "selecting";
  room.round = 0;
  room.bodies = [];
  room.hitEffects = [];
  room.magicEffects = [];
  room.hazardFields = [];
  room.thrownItems = [];
  room.groundItems = [];
  room.chat = [];
  room.events = [];
  room.sounds = [];
  room.meeting = null;
  room.battleStartedAt = 0;
  room.preparationEndsAt = 0;
  room.operatorSelectEndsAt = 0;
  room.operatorTurnOrder = [
    room.hostId,
    ...players.filter((player) => player.id !== room.hostId && !player.isBot).map((player) => player.id),
    ...players.filter((player) => player.id !== room.hostId && player.isBot).map((player) => player.id)
  ].filter(Boolean);
  room.operatorTurnIndex = 0;
  room.winner = null;
  room.rankUpdated = false;
  room.finishReason = "";
  setIdeaWinnerIds(room, []);
  room.pendingIdeaVictoryAt = 0;
  room.sabotage = null;
  room.activeEmps = [];
  room.doorState = {};
  room.destroyedCameras = {};
  room.utilityViews.clear();
  room.doorLog = [];

  pushEvent(room, "オペレーター選択開始。選択後にバトルフェーズへ進みます。");
  advanceOperatorTurn(room);
  touch(room);
}

function allOperators() {
  // A role is a match-side assignment, not an operator catalog. Keep one
  // canonical card per special so Witch (and future shared operators) cannot
  // appear twice in the selection menu while remaining selectable by either
  // side.
  const unique = new Map();
  for (const operator of [...OPERATORS.defender, ...OPERATORS.attacker]) {
    if (!unique.has(operator.special)) unique.set(operator.special, operator);
  }
  return [...unique.values()];
}

function operatorFor(_role, operatorId, operatorSpecial = "") {
  const requestedId = String(operatorId || "");
  const requestedSpecial = String(operatorSpecial || "");
  return allOperators().find((operator) => (
    operator.id === requestedId ||
    (requestedSpecial && operator.special === requestedSpecial)
  )) || null;
}

function operatorTakenCount(room, operatorId, exceptPlayerId = "") {
  return [...room.players.values()].filter((player) => player.id !== exceptPlayerId && player.operatorId === operatorId).length;
}

function canSelectOperator(room, player, operator) {
  if (!operator) return false;
  return operatorTakenCount(room, operator.id, player.id) < operator.limit;
}

function selectOperator(room, player, operatorId, operatorSpecial = "") {
  if (room.phase !== "selecting") throw new ApiError(400, "いまはオペレーター選択中ではありません。");
  const turnPlayer = currentOperatorPlayer(room);
  if (!turnPlayer || turnPlayer.id !== player.id) {
    throw new ApiError(409, "まだあなたの選択順ではありません。");
  }
  const operator = operatorFor(player.role, operatorId, operatorSpecial);
  if (!canSelectOperator(room, player, operator)) {
    throw new ApiError(400, "そのオペレーターは選択できません。");
  }
  player.operatorId = operator.id;
  player.operatorReady = true;
  player.special = operator.special;
  pushEvent(room, `${player.name} が ${operator.name} を選択しました。`);
  room.operatorTurnIndex += 1;
  advanceOperatorTurn(room);
  touch(room);
}

function autoPickOperator(room, player) {
  const choices = allOperators().filter((operator) => !(
    operator.special === "alchemist" &&
    botSharesTeamWithHuman(room, player)
  ));
  const specialChoices = choices.filter((operator) => operator.special && canSelectOperator(room, player, operator));
  const preferred = specialChoices[Math.floor(Math.random() * specialChoices.length)];
  const fallback = choices.find((operator) => canSelectOperator(room, player, operator));
  const operator = preferred || fallback;
  if (!operator) return;
  player.operatorId = operator.id;
  player.operatorReady = true;
  player.special = operator.special;
}

function allOperatorsReady(room) {
  return [...room.players.values()].every((player) => player.operatorReady && player.operatorId);
}

function currentOperatorPlayer(room) {
  while (room.operatorTurnIndex < room.operatorTurnOrder.length) {
    const player = room.players.get(room.operatorTurnOrder[room.operatorTurnIndex]);
    if (player && !player.operatorReady) return player;
    room.operatorTurnIndex += 1;
  }
  return null;
}

function advanceOperatorTurn(room) {
  if (room.phase !== "selecting") return;
  let player = currentOperatorPlayer(room);
  while (player?.isBot) {
    autoPickOperator(room, player);
    pushEvent(room, `${player.name} がオペレーターを自動選択しました。`);
    room.operatorTurnIndex += 1;
    player = currentOperatorPlayer(room);
  }
  if (!player) {
    startBattle(room);
    return;
  }
  room.operatorSelectEndsAt = now() + OPERATOR_SELECT_MS;
}

function startBattle(room) {
  if (room.phase !== "selecting") return;
  const map = getMap(room);
  const timestamp = now();
  for (const player of room.players.values()) {
    if (!player.operatorReady) autoPickOperator(room, player);
    player.taskList = player.role === "defender" ? assignTasks(map, room.settings.taskCount) : [];
    player.taskAutoReadyAt = 0;
    player.taskPresenceTaskId = "";
    player.taskPresenceSince = 0;
    player.killsThisRound = 0;
    player.killReadyAt = canUseKill(player) ? timestamp + room.settings.killCooldown * 1000 : 0;
    clearAttackState(player);
    player.lastAttackResult = "";
    player.lastAttackResultAt = 0;
    player.gunReadyAt = 0;
    player.gunnerWeapon = DEFAULT_GUNNER_WEAPON;
    player.gunnerAmmo = createGunnerAmmo();
    player.gunFiring = false;
    player.gunFiringWeapon = "";
    player.gunFiringSince = 0;
    player.gunnerBurstRoundsRemaining = 0;
    player.gunnerBurstEnhanceLevel = 0;
    player.gunnerBurstGbo = false;
    player.gunnerBurstGboWeapon = "";
    player.gunnerLastShotAt = 0;
    player.gunnerReloadUntil = 0;
    player.gunnerReloadWeapon = "";
    player.unavailableGunnerWeapons = [];
    player.sabotageReadyAt = player.role === "attacker" && player.alive && !player.ejected
      ? timestamp + SABOTAGE_COOLDOWN_MS
      : 0;
    player.dodgeReadyAt = 0;
    player.dodgeActiveUntil = 0;
    player.slashActiveUntil = 0;
    player.slashPerfectUntil = 0;
    player.slashPerfectReadyAt = 0;
    player.slashDetachedGuardUntil = 0;
    player.slashGuardInputReleased = true;
    player.teleportReadyAt = 0;
    player.floraReadyAt = 0;
    player.limitBreakActive = false;
    player.limitBreakEndsAt = 0;
    player.limitBreakManaCarry = 0;
    player.limitBreakStacks = 0;
    player.fighterEnergyCharge = 0;
    player.fighterEnergyPeak = 0;
    player.fighterEnergyChargeReadyAt = timestamp + FIGHTER_ENERGY_PASSIVE_INTERVAL_MS;
    player.manaGpuCooldownCreditMs = 0;
    player.manaGpuDrainCarry = 0;
    player.empReadyAt = timestamp + (room.soloMission?.id === "emp" ? 0 : EMP_INITIAL_LOCK_MS);
    player.itemDisabledUntil = 0;
    player.lastPassiveCreditAt = timestamp;
    player.slowedUntil = 0;
    player.taserSlowedUntil = 0;
    player.shockSlowedUntil = 0;
    player.gravityStormSlowUntil = 0;
    player.gravityStormSlowMultiplier = 1;
    player.lastGravityStormDamage = 0;
    player.sleepingUntil = 0;
    player.resting = false;
    player.unconsciousUntil = 0;
    player.gravityPinnedUntil = 0;
    player.abilityDisabledUntil = 0;
    player.overhealSpeedUntil = 0;
    player.hsgUntil = 0;
    player.hsgReadyAt = 0;
    player.hsgPreparedMode = "";
    player.hsgPreparedEnhanceLevel = 0;
    player.killCamera = null;
    player.gunnerSnipingActive = false;
    player.gunnerAimTargetId = "";
    player.timedAccelerationEffects = [];
    player.particleCannonPerformanceMultiplier = 1;
    player.lastMysteryResult = "";
    player.lastMysteryResultAt = 0;
    player.movementMode = "idle";
    player.bodyHits = 0;
    player.overheal = 0;
    player.stamina = MAX_STORED_STAMINA;
    player.staminaManaOverflow = 0;
    player.autoManaToStaminaFeedbackAt = 0;
    player.mana = STARTING_MANA;
    player.manaStateEnteredAt = timestamp;
    player.meditatingUntil = 0;
    player.renkiTargetMana = null;
    player.rationalFreeAbilityReadyAt = 0;
    player.gritCharges = 0;
    player.reasonCharges = 0;
    player.iaiCharges = 0;
    player.ideaProgressStartedAt = 0;
    player.ideaProgressMs = 0;
    player.ideaProgressUpdatedAt = 0;
    player.ideaStage = 0;
    player.ideaFirstAspect = "";
    player.desireBias = "";
    player.desireIdeaForfeited = false;
    player.truthCharges = 0;
    player.beautyCharges = 0;
    player.goodActive = false;
    player.ascensionStartedAt = 0;
    player.ascensionUntil = 0;
    player.staminaUpdatedAt = timestamp;
    player.itemInventory = player.special === "quantum"
      ? createItemInventory(QUANTUM_STARTING_ITEMS)
      : createItemInventory(player.itemInventory);
    if (player.special === "fighter" && itemCount(player, "orichalcum-sword") <= 0) {
      addItem(player, "orichalcum-sword");
    }
    if (player.special === "gunner" && itemCount(player, "hsg") <= 0) {
      addItem(player, "hsg");
    }
    player.poisonStatus = null;
    player.burnStatus = null;
    player.statusImmunityFeedbackAt = 0;
    player.quantumMode = "nuclear-transmutation";
    player.drone.active = false;
    player.drone.x = player.x;
    player.drone.y = player.y;
    player.drone.vx = 0;
    player.drone.vy = 0;
    player.drone.readyAt = 0;
    player.drone.altitude = DRONE_ALTITUDE_MAX;
    player.drone.destroyed = false;
    player.drone.movementMode = "idle";
    player.emergenciesLeft = room.settings.emergencyLimit;
    player.lastMoveAt = timestamp;
  }
  room.phase = "playing";
  room.round = 1;
  room.battleStartedAt = timestamp;
  room.preparationEndsAt = timestamp + PREPARATION_PHASE_MS;
  room.resolvePoint = createResolvePoint(room);
  room.operatorSelectEndsAt = 0;
  room.operatorTurnOrder = [];
  room.operatorTurnIndex = 0;
  pushEvent(room, "バトルフェーズ開始。ディフェンダーはタスク、アタッカーはキルとサボタージュを狙ってください。");
  touch(room);
}

function createSoloMissionRoom(missionId, name, skinId, profileId = "") {
  const mission = SOLO_MISSIONS[missionId];
  if (!mission) throw new ApiError(404, "ソロ訓練が見つかりません。");
  const room = createRoom(`S${roomCode()}`);
  room.soloMission = {
    id: mission.id,
    playerId: "",
    startedAt: 0,
    completed: false,
    taskCount: 0,
    defenseActivatedAt: 0,
    clairvoyanceUsed: false,
    sabotageUsed: false,
    empCancelled: false,
    empAmplified: false,
    empTrainingOutcomes: [],
    hintUnlocked: false,
    cpuPhase: "accelerate-1",
    cpuRenkiCount: 0,
    cpuBotId: "",
    cpuElementIndex: 0
  };
  room.settings = {
    ...room.settings,
    hostTeam: mission.team,
    attackerCount: mission.attackerCount,
    taskCount: mission.taskCount,
    killCooldown: 8,
    votingTime: 60
  };
  const player = addPlayer(room, name, false, skinId, profileId);
  room.hostId = player.id;
  player.host = true;
  room.soloMission.playerId = player.id;
  for (let index = 0; index < mission.botCount; index += 1) {
    addPlayer(room, `訓練Bot ${index + 1}`, true);
  }
  startGame(room);
  selectOperator(room, player, mission.operatorId);
  if (mission.metric === "cpu" || mission.metric === "cpu2") {
    const cpu = [...room.players.values()].find((candidate) => candidate.isBot && candidate.role === "attacker");
    if (cpu) {
      cpu.operatorId = mission.metric === "cpu2" ? "attacker-alchemist" : "defender-teleport";
      cpu.operatorReady = true;
      cpu.special = mission.metric === "cpu2" ? "alchemist" : "teleport";
      cpu.mana = STARTING_MANA;
      cpu.rationalFreeAbilityReadyAt = Infinity;
      room.soloMission.cpuBotId = cpu.id;
    }
  }
  room.soloMission.startedAt = room.battleStartedAt || now();
  if (mission.metric === "task") {
    player.stamina = MAX_STORED_STAMINA;
    player.staminaManaOverflow = 0;
    player.staminaUpdatedAt = now();
  }
  if (mission.metric === "intel") player.sabotageReadyAt = 0;
  for (const bot of room.players.values()) {
    if (bot.isBot) bot.nextBotActionAt = now() + 30_000;
  }
  if (mission.metric === "cpu" || mission.metric === "cpu2") {
    const cpu = room.players.get(room.soloMission.cpuBotId);
    if (cpu) cpu.nextBotActionAt = now();
  }
  if (mission.id === "emp") {
    for (const bot of room.players.values()) {
      if (!bot.isBot) continue;
      bot.nextBotActionAt = now();
      bot.empReadyAt = 0;
    }
  }
  pushEvent(room, `ソロ訓練「${mission.name}」開始: ${mission.objective}`);
  touch(room);
  return { room, player };
}
function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function awardAbilityContribution(player, amount) {
  // Ability use is intentionally excluded from result scoring.
  player.abilityContribution = 0;
}

function actionBlockedUntil(player) {
  const restUntil = player?.resting && Number(player.stamina) < staminaCapacityFor(player) - 0.01
    ? Math.max(Number(player.sleepingUntil) || 0, now() + 250)
    : Number(player.sleepingUntil) || 0;
  return Math.max(
    restUntil,
    Number(player.unconsciousUntil) || 0,
    Number(player.meditatingUntil) || 0,
    Number(player.smartphoneUntil) || 0,
    Number(player.gravityPinnedUntil) || 0,
    Number(player.ascensionUntil) || 0,
    Number(player.timeStoppedUntil) || 0
  );
}

function sensoryBlockedUntil(player) {
  return Number(player.unconsciousUntil) || 0;
}

function ensureConscious(player) {
  const timestamp = now();
  const blockedUntil = actionBlockedUntil(player);
  if (blockedUntil <= timestamp) return;
  const label = (player.ascensionUntil || 0) > timestamp
    ? "昇天演出が終わる"
    : (player.timeStoppedUntil || 0) > timestamp
      ? "時間停止が解ける"
    : (player.meditatingUntil || 0) > timestamp
      ? "精神統一が終わる"
    : (player.sleepingUntil || 0) > timestamp
      ? "休息が終わる"
    : (player.gravityPinnedUntil || 0) > timestamp
      ? "重力拘束が解ける"
      : "意識が戻る";
  throw new ApiError(400, `${label}まで${Math.ceil((blockedUntil - timestamp) / 1000)}秒です。`);
}

function ensureAbilityAvailable(player) {
  ensureConscious(player);
  if ((player.abilityDisabledUntil || 0) > now()) {
    throw new ApiError(400, `能力封印中です（残り${Math.ceil((player.abilityDisabledUntil - now()) / 1000)}秒）。`);
  }
}

function manaStateLabel(mana) {
  const value = Number(mana) || 0;
  if (value <= 0) return "欲望";
  if (value >= RATIONAL_MANA_THRESHOLD) return "理知";
  return "気概";
}

function isRational(player) {
  return Number(player?.mana) >= RATIONAL_MANA_THRESHOLD;
}

function isHackerOperator(player) {
  if (!player) return false;
  if (player.special === "alchemist") return true;
  return operatorFor(player.role, player.operatorId)?.special === "alchemist";
}

function isHackerOperational(player) {
  return Boolean(isHackerOperator(player) && player.alive && !player.ejected);
}

function remainingHealth(player) {
  return Math.max(0, 2 - Math.max(0, Number(player?.bodyHits) || 0)) +
    Math.max(0, Number(player?.overheal) || 0);
}

function fighterEnergyPeak(player) {
  return Math.max(
    0,
    Math.floor(Number(player?.fighterEnergyPeak) || 0),
    Math.floor(Number(player?.fighterEnergyCharge) || 0)
  );
}

function hasFighterInfiniteResources(player) {
  return Boolean(
    player?.alive &&
    !player.ejected &&
    hasOperatorAccess(player, "fighter") &&
    fighterEnergyPeak(player) >= FIGHTER_INFINITE_RESOURCE_THRESHOLD
  );
}

function syncFighterInfiniteResources(player) {
  if (!hasFighterInfiniteResources(player)) return false;
  player.mana = Math.max(RATIONAL_MANA_THRESHOLD, Number(player.mana) || 0);
  player.stamina = staminaCapacityFor(player);
  player.bodyHits = 0;
  return true;
}

function hasLimitBreakDeathVulnerability(player) {
  return Boolean(player?.limitBreakActive && !hasFighterInfiniteResources(player));
}

function hackerRootEligible(player) {
  return Boolean(isHackerOperational(player) && player.hackerRootActive);
}

function discardHackerRootState(player) {
  if (!player) return false;
  const changed = Boolean(player.hackerRootActive || player.hackerRootHealthSnapshot);
  player.hackerRootActive = false;
  player.hackerRootHealthSnapshot = null;
  return changed;
}

function syncHackerRootState(room, player) {
  if (!isHackerOperational(player)) discardHackerRootState(player);
  return hackerRootEligible(player);
}

function deactivateHackerRoot(room, player, { restoreHealth = false, announce = false } = {}) {
  if (!player?.hackerRootActive) return false;
  const snapshot = player.hackerRootHealthSnapshot;
  player.hackerRootActive = false;
  player.hackerRootHealthSnapshot = null;
  if (restoreHealth && player.alive && !player.ejected && snapshot) {
    player.bodyHits = Number(snapshot.bodyHits);
    player.overheal = Number(snapshot.overheal);
  }
  if (announce) {
    pushMagicEffect(room, "hacker-root", player, {
      radius: 128,
      playerId: player.id,
      variant: "release"
    });
    setImmediateFeedback(player, "ROOT解除", `HP ${remainingHealth(player)}`);
    pushEvent(room, `${player.name} がROOTを解除し、発動前のHP ${remainingHealth(player)}へ戻りました。`);
    touch(room);
  }
  return true;
}

function activateHackerRoot(room, player) {
  if (room.phase !== "playing" || !isHackerOperator(player)) {
    throw new ApiError(403, "ハッカーのバトル中だけroot化できます。");
  }
  if (!player.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "現在はroot化できません。");
  }
  ensureAbilityAvailable(player);
  ensureConscious(player);

  const healthBefore = remainingHealth(player);
  const retainedProtections = {
    grit: Math.max(0, Math.floor(Number(player.gritCharges) || 0)),
    substitution: Math.max(0, Math.floor(Number(player.substitutionCharges) || 0))
  };
  player.hackerRootHealthSnapshot = {
    bodyHits: Number(player.bodyHits),
    overheal: Number(player.overheal)
  };
  player.overheal = 0;
  player.bodyHits = 2 - HACKER_ROOT_HEALTH;
  player.hackerRootActive = true;
  const inheritedStartingItems = grantHackerRootStartingItems(player);
  const retainedLabels = [
    retainedProtections.grit ? `踏ん張り${retainedProtections.grit}` : "",
    retainedProtections.substitution ? `変わり身${retainedProtections.substitution}` : ""
  ].filter(Boolean);
  pushHitEffect(room, player, "body", false);
  pushMagicEffect(room, "hacker-root", player, {
    radius: 155,
    playerId: player.id,
    variant: "all-operators"
  });
  setImmediateFeedback(
    player,
    "root化",
    `HP ${HACKER_ROOT_HEALTH}${retainedLabels.length ? ` / ${retainedLabels.join("・")}はROOT中無効（所持維持）` : ""}${inheritedStartingItems.length ? ` / 開始装備:${inheritedStartingItems.join("・")}` : ""}`
  );
  pushEvent(
    room,
    `${player.name} が能力ボタンでroot化し、${Math.max(0, healthBefore - HACKER_ROOT_HEALTH).toFixed(4)}ダメージを受けてHP ${HACKER_ROOT_HEALTH}になりました。${retainedLabels.length ? `${retainedLabels.join("・")}は所持したままROOT中だけ無効です。` : ""}${inheritedStartingItems.length ? ` 各オペレーターの開始装備（${inheritedStartingItems.join("・")}）を継承しました。` : ""}`
  );
  touch(room);
  return { health: remainingHealth(player), retainedProtections, inheritedStartingItems };
}

function toggleHackerRoot(room, player) {
  if (player?.hackerRootActive) {
    if (room.phase !== "playing" || !isHackerOperator(player) || !player.alive || player.ejected) {
      discardHackerRootState(player);
      throw new ApiError(403, "現在はROOTを解除できません。");
    }
    deactivateHackerRoot(room, player, { restoreHealth: true, announce: true });
    return { active: false, health: remainingHealth(player) };
  }
  return { active: true, ...activateHackerRoot(room, player) };
}

function grantHackerRootStartingItems(player) {
  const inherited = [];
  if (itemCount(player, "orichalcum-sword") < 1) {
    addItem(player, "orichalcum-sword");
    inherited.push(ITEM_DEFINITIONS["orichalcum-sword"].label);
  }
  if (itemCount(player, "hsg") < 1) {
    addItem(player, "hsg");
    inherited.push("HSG");
  }
  for (const [itemId, required] of Object.entries(QUANTUM_STARTING_ITEMS)) {
    const missing = Math.max(0, Number(required) - itemCount(player, itemId));
    if (!missing) continue;
    addItem(player, itemId, missing);
    inherited.push(ITEM_DEFINITIONS[itemId].label);
  }
  return inherited;
}

function passivesEnabled(player) {
  return Boolean(player?.alive && !player.ejected && isRational(player));
}

function limitBreakStackCount(player) {
  return player?.limitBreakActive
    ? Math.max(1, Math.floor(Number(player.limitBreakStacks) || 1))
    : 0;
}

function limitBreakMultiplier(player) {
  return Math.pow(LIMIT_BREAK_SPEED_MULTIPLIER, limitBreakStackCount(player));
}

function spendLimitBreakHealth(player) {
  if (hasFighterInfiniteResources(player)) return;
  if (remainingHealth(player) <= 0) {
    throw new ApiError(400, "リミットブレイクには消費できるHPが必要です。");
  }
  if ((Number(player.overheal) || 0) > 0) {
    player.overheal = Math.max(0, Number(player.overheal) - 1);
  } else {
    player.bodyHits = Math.max(0, Number(player.bodyHits) || 0) + 1;
  }
}

function toggleLimitBreak(room, player) {
  if (room.phase !== "playing" || !player?.alive || player.ejected || player.inVent || !hasOperatorAccess(player, "fighter")) {
    throw new ApiError(403, "現在はリミットブレイクを使用できません。");
  }
  ensureAbilityAvailable(player);
  ensureConscious(player);
  if (!isHackerOperator(player) && !hasFighterInfiniteResources(player) && Number(player.mana) <= 0) {
    throw new ApiError(400, "リミットブレイクの維持に必要なマナがありません。");
  }
  const timestamp = now();
  const previousStamina = Math.max(0, Number(player.stamina) || 0);
  const firstActivation = !player.limitBreakActive;
  if (firstActivation) player.limitBreakBaseStamina = previousStamina;
  spendLimitBreakHealth(player);
  if (remainingHealth(player) <= 0) {
    destroyPlayerUnconditionally(room, player, player, "リミットブレイクによる肉体崩壊", {
      noKillCutin: true,
      ignorePreparationBarrier: true
    });
    checkWin(room);
    touch(room);
    return true;
  }
  player.limitBreakActive = true;
  player.limitBreakStacks = limitBreakStackCount(player) + (firstActivation ? 0 : 1);
  player.limitBreakEndsAt = 0;
  if (firstActivation) player.limitBreakManaCarry = 0;
  player.stamina = Math.min(staminaCapacityFor(player), previousStamina * 3);
  player.staminaUpdatedAt = timestamp;
  maintainNaturalRecovery(room, player, timestamp);
  const stacks = limitBreakStackCount(player);
  const multiplier = limitBreakMultiplier(player);
  const infiniteReward = hasFighterInfiniteResources(player);
  const costDetail = infiniteReward ? "HP消費なし / MP・SP・HP・踏ん張り∞" : "HP-1";
  const vulnerabilityDetail = infiniteReward ? "被確殺デメリット解除" : "即死回避無効";
  pushMagicEffect(room, "limit-break", player, { radius: 150, playerId: player.id, variant: `active-stack-${stacks}` });
  setImmediateFeedback(player, "リミットブレイク", `${costDetail} / 永続 / SP・加速×${multiplier} / ${vulnerabilityDetail}`);
  pushEvent(room, `${player.name} がリミットブレイクを${stacks}回重ねました。${costDetail} / SP・加速${multiplier}倍 / ${infiniteReward ? "永続" : "マナが続く限り永続"} / ${vulnerabilityDetail}。`);
  touch(room);
  return true;
}

function stopLimitBreak(room, player, reason = "") {
  if (!player.limitBreakActive) return false;
  const multiplier = limitBreakMultiplier(player);
  player.limitBreakActive = false;
  player.limitBreakEndsAt = 0;
  player.limitBreakManaCarry = 0;
  const transformedStamina = Math.max(0, Number(player.stamina) || 0) / Math.max(1, multiplier);
  player.stamina = Math.min(MAX_STORED_STAMINA, transformedStamina);
  player.limitBreakBaseStamina = 0;
  player.limitBreakStacks = 0;
  if (reason) pushMagicEffect(room, "limit-break", player, { radius: 110, playerId: player.id, variant: "release" });
  if (reason) pushEvent(room, `${player.name} のリミットブレイクが${reason}。`);
  return true;
}

function advanceLimitBreak(room, player, elapsedMs) {
  if (!player.limitBreakActive) return false;
  if (room.phase === "meeting") return false;
  if (room.phase !== "playing" || !player.alive || player.ejected || !hasOperatorAccess(player, "fighter")) {
    return stopLimitBreak(room, player);
  }
  if (hasFighterInfiniteResources(player)) {
    player.limitBreakManaCarry = 0;
    syncFighterInfiniteResources(player);
    return false;
  }
  if (isHackerOperator(player) && hackerRootEligible(player)) return false;
  player.limitBreakManaCarry = Math.max(0, Number(player.limitBreakManaCarry) || 0) +
    LIMIT_BREAK_MANA_DRAIN_PER_SECOND * Math.max(0, Number(elapsedMs) || 0) / 1000;
  const wholeMana = Math.floor(player.limitBreakManaCarry);
  if (wholeMana <= 0) return false;
  player.limitBreakManaCarry -= wholeMana;
  if (Number(player.mana) <= wholeMana) {
    setMana(room, player, 0, "リミットブレイク");
    stopLimitBreak(room, player, "マナ切れで終了しました");
    return true;
  }
  setMana(room, player, Number(player.mana) - wholeMana, "リミットブレイク");
  return true;
}

function advanceFighterEnergyPassive(room, player, timestamp = now()) {
  if (room.phase === "meeting") return false;
  if (room.phase !== "playing" || !player?.alive || player.ejected || player.inVent || !hasOperatorAccess(player, "fighter") || !passivesEnabled(player)) {
    player.fighterEnergyChargeReadyAt = Math.max(Number(player.fighterEnergyChargeReadyAt) || 0, timestamp + FIGHTER_ENERGY_PASSIVE_INTERVAL_MS);
    return false;
  }
  const readyAt = Number(player.fighterEnergyChargeReadyAt) || (timestamp + FIGHTER_ENERGY_PASSIVE_INTERVAL_MS);
  if (timestamp < readyAt) {
    player.fighterEnergyChargeReadyAt = readyAt;
    return false;
  }
  player.fighterEnergyChargeReadyAt = timestamp + FIGHTER_ENERGY_PASSIVE_INTERVAL_MS;
  if (!isHackerOperator(player) && Number(player.mana) < FIGHTER_ENERGY_CHARGE_MANA_COST) return false;
  spendMana(room, player, FIGHTER_ENERGY_CHARGE_MANA_COST, "EC");
  const previousPeak = fighterEnergyPeak(player);
  const next = Math.max(0, Math.floor(Number(player.fighterEnergyCharge) || 0)) + 1;
  const nextPeak = Math.max(previousPeak, next);
  const reachedIaiMilestone = previousPeak < FIGHTER_IAI_REWARD_THRESHOLD && nextPeak >= FIGHTER_IAI_REWARD_THRESHOLD;
  const reachedInfiniteMilestone = previousPeak < FIGHTER_INFINITE_RESOURCE_THRESHOLD && nextPeak >= FIGHTER_INFINITE_RESOURCE_THRESHOLD;
  player.fighterEnergyCharge = next;
  player.fighterEnergyPeak = nextPeak;
  let reward = `EC ${next}`;
  if (reachedIaiMilestone) {
    grantIaiCharge(room, player, false, `ec-${nextPeak}`);
    reward += " / 居合（即席）×1獲得";
  }
  if (reachedInfiniteMilestone) {
    syncFighterInfiniteResources(player);
    pushMagicEffect(room, "fighter-energy-destruction-milestone", player, {
      radius: 138,
      playerId: player.id,
      variant: String(next)
    });
    reward += " / MP・SP・HP・踏ん張り∞ / リミットブレイク被確殺デメリット解除 / 斬る・常時消滅（死体なし） / ジャストガード・全攻撃反射";
  }
  const milestoneMotion = reachedIaiMilestone || reachedInfiniteMilestone;
  pushMagicEffect(room, "fighter-energy-charge", player, {
    radius: 112,
    playerId: player.id,
    variant: `${next}:ec-${next}:${milestoneMotion ? `milestone-motion-${nextPeak}` : "no-character-motion"}`
  });
  setImmediateFeedback(player, "EC", reward);
  pushEvent(room, `${player.name} のECが1増えました${reachedIaiMilestone ? "。EC25回到達報酬の居合は即席として使用回数へ変換されました" : ""}${reachedInfiniteMilestone ? "。MP・SP・HP・踏ん張りが無限になり、リミットブレイクの被確殺デメリットが解除され、斬るが死体を残さない常時消滅、ジャストガードが全攻撃反射へ強化されました" : ""}。`);
  pushSound(room, "invention", player, { ownerId: player.id, sourceKind: "fighter-energy-charge", maxDistance: 900, volume: 0.62 });
  touch(room);
  return true;
}

function fighterSlashShockwaveCost(player) {
  if (!hasOperatorAccess(player, "fighter")) return 0;
  const current = Math.max(0, Math.floor(Number(player?.fighterEnergyCharge) || 0));
  return current >= FIGHTER_GIANT_SHOCKWAVE_EC_COST
    ? FIGHTER_GIANT_SHOCKWAVE_EC_COST
    : 1;
}

function consumeFighterEnergyCharge(player, requestedCost = 1, label = "衝撃波") {
  if (!hasOperatorAccess(player, "fighter")) return 0;
  const current = Math.max(0, Math.floor(Number(player?.fighterEnergyCharge) || 0));
  const cost = Math.max(1, Math.floor(Number(requestedCost) || 1));
  if (!player || current < cost) return 0;
  player.fighterEnergyCharge = current - cost;
  setImmediateFeedback(player, "EC", `${label}発生 / EC${cost}放出 / 残りEC${player.fighterEnergyCharge}`);
  return cost;
}

function luckValueFor(player) {
  const stamina = Number(player?.stamina) || 0;
  let base = 0;
  if (stamina > 250 && isRational(player)) base = player.goodActive ? 0.55 : 0.3;
  else if (stamina <= 0) base = -0.35;
  else if (stamina <= 250) base = -0.12;
  else base = isRational(player) ? 0.2 : 0;
  const objectBonus = Number(player?.objectLuckUntil || 0) > now()
    ? Math.max(0, Number(player?.objectLuckBonus) || 0)
    : 0;
  const donationBonus = clampNumber(
    Number(player?.donationLuckBonus) || 0,
    DONATION_LUCK_MIN_BONUS,
    DONATION_LUCK_MAX_BONUS,
    0
  );
  const confirmationPenalty = player?.desireBias === "confirmation-bias" ? DESIRE_BIAS_LUCK_PENALTY : 0;
  return clampNumber(base + objectBonus + donationBonus - confirmationPenalty, -1, 1, base);
}

function ideaProgressRateFor(player) {
  const luckBenefit = clampNumber(
    (luckValueFor(player) - IDEA_LUCK_BASELINE) / (1 - IDEA_LUCK_BASELINE),
    0,
    1,
    0
  );
  const reductionMs = luckBenefit * IDEA_LUCK_MAX_TIME_REDUCTION_MS;
  return IDEA_ASCENSION_MS / (IDEA_ASCENSION_MS - reductionMs);
}

function resetIdeaProgress(player) {
  player.ideaProgressStartedAt = 0;
  player.ideaProgressMs = 0;
  player.ideaProgressUpdatedAt = 0;
}

function forfeitIdeaAttainment(player) {
  resetIdeaProgress(player);
  player.ideaStage = 0;
  player.ideaFirstAspect = "";
  player.truthCharges = 0;
  player.beautyCharges = 0;
  player.goodActive = false;
  player.ascensionStartedAt = 0;
  player.ascensionUntil = 0;
}

function ideaWinnerIdsFor(room) {
  const ids = Array.isArray(room?.ideaWinnerIds) ? room.ideaWinnerIds : [];
  const legacyId = String(room?.ideaWinnerId || "");
  return [...new Set([...ids.map(String), legacyId].filter(Boolean))];
}

function setIdeaWinnerIds(room, ids = []) {
  if (!room) return [];
  const next = [...new Set((Array.isArray(ids) ? ids : []).map(String).filter(Boolean))];
  room.ideaWinnerIds = next;
  room.ideaWinnerId = next[0] || "";
  return next;
}

function desireBiasDefinition(player) {
  return DESIRE_BIASES.find((bias) => bias.id === player?.desireBias) || null;
}

function nextDesireBias(player) {
  const validIds = new Set(DESIRE_BIASES.map((bias) => bias.id));
  let bag = Array.isArray(player.desireBiasBag)
    ? player.desireBiasBag.filter((id) => validIds.has(id))
    : [];
  if (!bag.length) {
    bag = DESIRE_BIASES.map((bias) => bias.id);
    for (let index = bag.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [bag[index], bag[swapIndex]] = [bag[swapIndex], bag[index]];
    }
    if (bag.length > 1 && bag[0] === player.lastDesireBias) {
      [bag[0], bag[1]] = [bag[1], bag[0]];
    }
  }
  const selected = bag.shift() || DESIRE_BIASES[0].id;
  player.desireBiasBag = bag;
  player.lastDesireBias = selected;
  return selected;
}

function isDesireState(player) {
  return Number(player?.mana) <= 0 || Number(player?.stamina) <= 0;
}

function enterDesireState(room, player, sourceLabel = "", timestamp = now()) {
  const enteredNow = !player.desireBias;
  if (enteredNow) {
    player.desireBias = nextDesireBias(player);
  }
  player.mana = DESIRE_RESOURCE_DEBT;
  player.credits = DESIRE_RESOURCE_DEBT;
  player.stamina = DESIRE_RESOURCE_DEBT;
  player.staminaUpdatedAt = timestamp;
  player.rationalFreeAbilityReadyAt = 0;
  player.desireIdeaForfeited = true;
  forfeitIdeaAttainment(player);
  if (room && ideaWinnerIdsFor(room).includes(player.id)) {
    const remainingWinnerIds = setIdeaWinnerIds(room, ideaWinnerIdsFor(room).filter((id) => id !== player.id));
    if (!remainingWinnerIds.length) room.pendingIdeaVictoryAt = 0;
  }
  if (room && enteredNow) {
    const bias = desireBiasDefinition(player);
    pushEvent(room, `${player.name} は欲望へ移行し、${bias?.label || "認知バイアス"}が心を支配しました。この対戦では真・美・善・善のイデアへの到達を永久に失います。`);
  }
  return player.desireBias;
}

function syncDesireState(room, player, sourceLabel = "") {
  if (isDesireState(player)) {
    if (!player.desireBias) enterDesireState(room, player, sourceLabel);
    return true;
  }
  if (player.desireBias) {
    const previous = desireBiasDefinition(player)?.label || "認知バイアス";
    player.desireBias = "";
    if (room) pushEvent(room, `${player.name} は欲望を脱し、${previous}から回復しました。`);
  }
  return false;
}

function desireBiasGroupActive(room, player) {
  if (player?.desireBias !== "in-group-bias" || !room) return false;
  return [...room.players.values()].some((other) => (
    other.id !== player.id && other.alive && !other.ejected && !other.inVent && distance(player, other) <= DESIRE_BIAS_GROUP_RADIUS
  ));
}

function staminaStateLabel(stamina) {
  const value = Number(stamina) || 0;
  if (value <= 0) return "欲望";
  if (value <= 250) return "気概";
  return "理知";
}

function luckAdjustedRoll(player) {
  return clampNumber(Math.random() - luckValueFor(player) * 0.16, 0, 0.999999, Math.random());
}

function taskStaminaCostFor() {
  return TASK_STAMINA_REQUIREMENT;
}

function setMana(room, player, rawMana, sourceLabel = "") {
  const timestamp = now();
  const previousRaw = Math.round((Number(player.mana) || 0) * 100) / 100;
  const previous = previousRaw <= 0 ? DESIRE_RESOURCE_DEBT : previousRaw;
  const rawRequested = Math.round((Number(rawMana) || 0) * 100) / 100;
  const requested = player.desireBias === "sunk-cost" && previous > 0 && rawRequested < previous
    ? Math.round((previous - (previous - rawRequested) * DESIRE_BIAS_COST_MULTIPLIER) * 100) / 100
    : rawRequested;
  const next = requested <= 0 ? DESIRE_RESOURCE_DEBT : requested;
  if (previous === next) {
    player.mana = next;
    syncDesireState(room, player, sourceLabel);
    player.luck = luckValueFor(player);
    if (room) maintainNaturalRecovery(room, player, timestamp);
    return Number(player.mana);
  }
  const previousState = manaStateLabel(previous);
  const nextState = manaStateLabel(next);
  const enteredRational = previous < RATIONAL_MANA_THRESHOLD && next >= RATIONAL_MANA_THRESHOLD;
  const leftRational = previous >= RATIONAL_MANA_THRESHOLD && next < RATIONAL_MANA_THRESHOLD;
  player.mana = next;
  player.luck = luckValueFor(player);
  if (previousState !== nextState) player.manaStateEnteredAt = timestamp;
  if (enteredRational && !player.desireIdeaForfeited) {
    player.ideaProgressStartedAt = timestamp;
    player.ideaProgressMs = 0;
    player.ideaProgressUpdatedAt = timestamp;
    player.rationalFreeAbilityReadyAt = timestamp + RATIONAL_FREE_ABILITY_INTERVAL_MS;
  } else if (leftRational) {
    resetIdeaProgress(player);
    player.rationalFreeAbilityReadyAt = 0;
  }
  if (next === DESIRE_RESOURCE_DEBT && previous !== DESIRE_RESOURCE_DEBT) {
    enterDesireState(room, player, sourceLabel || "マナ枯渇", timestamp);
  } else if (room && previousState !== nextState) {
    pushEvent(room, `${player.name} のマナ状態が${manaStateLabel(next)}になりました${sourceLabel ? `（${sourceLabel}）` : ""}。`);
  }
  syncDesireState(room, player, sourceLabel);
  if (room && previousState !== nextState && nextState !== "欲望") pushMagicEffect(room, "action-mana", player, {
    radius: 110,
    playerId: player.id,
    variant: manaStateLabel(next)
  });
  if (room) maintainNaturalRecovery(room, player, timestamp);
  return next;
}

function spendMana(room, player, amount, label) {
  const cost = Math.max(0, Number(amount) || 0);
  if (hasFighterInfiniteResources(player)) return false;
  if (isHackerOperator(player)) return false;
  if ((Number(player.mana) || 0) < cost) {
    throw new ApiError(400, `${label}にはマナ ${cost} が必要です。`);
  }
  setMana(room, player, (Number(player.mana) || 0) - cost, label);
}

function spendOperatorMana(room, player, label, amount = ABILITY_MANA_COST) {
  const timestamp = now();
  if (isHackerOperator(player) && hackerRootEligible(player)) return false;
  if (Number(player.mana) >= RATIONAL_MANA_THRESHOLD && (Number(player.rationalFreeAbilityReadyAt) || Infinity) <= timestamp) {
    player.rationalFreeAbilityReadyAt = timestamp + RATIONAL_FREE_ABILITY_INTERVAL_MS;
    pushMagicEffect(room, "action-rational-free", player, { radius: 145, playerId: player.id });
    pushEvent(room, `${player.name} は理知により${label}を無料で発動しました。`);
    return false;
  }
  spendMana(room, player, Math.max(0, Number(amount) || 0), label);
  return true;
}

function canSpendOperatorMana(player, timestamp = now()) {
  if (isHackerOperator(player) && hackerRootEligible(player)) return true;
  const rationalFree = Number(player.mana) >= RATIONAL_MANA_THRESHOLD &&
    (Number(player.rationalFreeAbilityReadyAt) || Infinity) <= timestamp;
  return rationalFree || (Number(player.mana) || 0) >= ABILITY_MANA_COST;
}

function practiceRenki(room, player) {
  if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "現在は練気できません。");
  }
  ensureAbilityAvailable(player);
  const timestamp = now();
  player.renkiTargetMana = Number(player.mana) <= 0
    ? STARTING_MANA
    : Number(player.mana) + MANA_CONVERSION_AMOUNT;
  player.meditatingUntil = timestamp + RENKI_FOCUS_DURATION_MS;
  player.vx = 0;
  player.vy = 0;
  player.movementMode = "meditating";
  player.lastMoveAt = timestamp;
  player.drone.active = false;
  clearAttackState(player);
  pushMagicEffect(room, "action-renki", player, { radius: 120, playerId: player.id });
  pushEvent(room, `${player.name} が練気の精神統一に入りました（${(RENKI_FOCUS_DURATION_MS / 1000).toFixed(1)}秒）。`);
  touch(room);
}

function donateCredits(room, player) {
  if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "現在は募金できません。");
  }
  ensureConscious(player);
  if ((Number(player.credits) || 0) < DONATION_CREDIT_COST) {
    throw new ApiError(400, `募金には${DONATION_CREDIT_COST}Cが必要です。`);
  }
  player.credits -= DONATION_CREDIT_COST;
  const rationalDonation = isRational(player);
  const donationLuckDelta = rationalDonation ? DONATION_LUCK_GAIN : -DONATION_LUCK_GAIN;
  player.donationLuckBonus = clampNumber(
    Math.round(((Number(player.donationLuckBonus) || 0) + donationLuckDelta) * 100) / 100,
    DONATION_LUCK_MIN_BONUS,
    DONATION_LUCK_MAX_BONUS,
    0
  );
  player.luck = luckValueFor(player);
  setImmediateFeedback(
    player,
    "スマホ募金",
    `-${DONATION_CREDIT_COST}C / 幸運・直観 ${donationLuckDelta >= 0 ? "+" : ""}${donationLuckDelta.toFixed(2)}`
  );
  pushMagicEffect(room, "action-smartphone", player, {
    radius: 105,
    variant: rationalDonation ? "donation-rational" : "donation-unjust"
  });
  if (rationalDonation) {
    pushGainAte(room, player, "luckBoost", { variant: "donation-rational", durationMs: 1680 });
  } else {
    pushMagicEffect(room, "action-mana", player, { radius: 125, variant: "欲望" });
  }
  pushSound(room, "object", player, { distance: 900, volume: 0.55 });
  touch(room);
}

function finishRenki(room, player, timestamp) {
  if (room.phase !== "playing") return;
  if (player.renkiTargetMana == null || !player.meditatingUntil || player.meditatingUntil > timestamp) return;
  const targetMana = player.renkiTargetMana;
  player.renkiTargetMana = null;
  player.meditatingUntil = 0;
  player.movementMode = "idle";
  const previousMana = Number(player.mana) || 0;
  setMana(room, player, targetMana, "練気");
  if (Number(player.mana) > previousMana) pushGainAte(room, player, "mana", { variant: "renki", durationMs: 1680 });
  awardAbilityContribution(player, 0.25);
  pushMagicEffect(room, "action-mana", player, { radius: 135, playerId: player.id, variant: manaStateLabel(player.mana) });
  pushEvent(room, `${player.name} が精神統一を終え、${manaStateLabel(player.mana)}へ移行しました。`);
  touch(room);
}

function grantIdeaAspect(room, player, aspect) {
  if (player.desireIdeaForfeited) return false;
  if (aspect === "truth") {
    grantPushCharge(room, player, false, "idea-truth");
    pushMagicEffect(room, "idea-truth", player, { radius: 135, playerId: player.id });
    pushEvent(room, `${player.name} が真を獲得し、押し込みを得ました。`);
    return true;
  }
  grantStandFirmCharge(room, player, false, "idea-beauty");
  pushMagicEffect(room, "idea-beauty", player, { radius: 145, playerId: player.id });
  pushEvent(room, `${player.name} が美を獲得し、踏ん張りを得ました。`);
  return true;
}

function grantIdeaGood(room, player, timestamp) {
  if (player.desireIdeaForfeited) return false;
  player.goodActive = true;
  grantPushCharge(room, player, false, "idea-good");
  grantStandFirmCharge(room, player, false, "idea-good");
  player.bodyHits = 0;
  player.overheal = Math.max(1, Number(player.overheal) || 0);
  player.slowedUntil = 0;
  player.taserSlowedUntil = 0;
  player.shockSlowedUntil = 0;
  player.gravityStormSlowUntil = 0;
  player.gravityStormSlowMultiplier = 1;
  player.abilityDisabledUntil = 0;
  player.unconsciousUntil = 0;
  player.stamina = MAX_STORED_STAMINA;
  player.staminaUpdatedAt = timestamp;
  maintainNaturalRecovery(room, player, timestamp);
  pushMagicEffect(room, "idea-good", player, { radius: 185, playerId: player.id });
  pushEvent(room, `${player.name} が善を獲得し、押し込み・踏ん張り・回復・加速を統合しました。`);
  return true;
}

function beginIdeaAscension(room, player, timestamp) {
  if (player.desireIdeaForfeited) return false;
  if (room.phase !== "playing" || ideaWinnerIdsFor(room).includes(player.id)) return false;
  player.ideaStage = 4;
  player.ascensionStartedAt = timestamp;
  player.ascensionUntil = timestamp + IDEA_ASCENSION_ANIMATION_MS;
  player.vx = 0;
  player.vy = 0;
  player.inVent = false;
  player.ventId = "";
  player.drone.active = false;
  clearAttackState(player);
  const winnerIds = setIdeaWinnerIds(room, [...ideaWinnerIdsFor(room), player.id]);
  room.pendingIdeaVictoryAt = Math.max(Number(room.pendingIdeaVictoryAt) || 0, player.ascensionUntil);
  pushMagicEffect(room, "idea-ascension", player, { radius: 260, playerId: player.id });
  pushEvent(room, `${player.name} が善のイデアへ到達しました。光る翼とともに昇天を開始します（現在の到達者${winnerIds.length}人）。`);
  touch(room);
  return true;
}

function advanceIdeaProgress(room, player, timestamp) {
  if (!player.alive || player.ejected) {
    resetIdeaProgress(player);
    return;
  }
  if (room.phase !== "playing" || player.ideaStage >= 4) return;
  if (player.desireIdeaForfeited || isDesireState(player) || player.desireBias) {
    forfeitIdeaAttainment(player);
    return;
  }
  if (Number(player.mana) < RATIONAL_MANA_THRESHOLD) {
    resetIdeaProgress(player);
    return;
  }
  if (!player.ideaProgressStartedAt) {
    player.ideaProgressStartedAt = timestamp;
    player.ideaProgressMs = 0;
    player.ideaProgressUpdatedAt = timestamp;
  }
  const previousUpdate = Number(player.ideaProgressUpdatedAt) || timestamp;
  const deltaMs = Math.max(0, timestamp - previousUpdate);
  const progressRate = ideaProgressRateFor(player);
  player.ideaProgressMs = Math.max(0, Number(player.ideaProgressMs) || 0) + deltaMs * progressRate;
  player.ideaProgressUpdatedAt = timestamp;
  player.ideaProgressStartedAt = timestamp - player.ideaProgressMs;
  const elapsed = player.ideaProgressMs;
  if (player.ideaStage < 1 && elapsed >= IDEA_FIRST_ASPECT_MS) {
    player.ideaFirstAspect = Math.random() < 0.5 ? "truth" : "beauty";
    grantIdeaAspect(room, player, player.ideaFirstAspect);
    player.ideaStage = 1;
  }
  if (player.ideaStage < 2 && elapsed >= IDEA_SECOND_ASPECT_MS) {
    grantIdeaAspect(room, player, player.ideaFirstAspect === "truth" ? "beauty" : "truth");
    player.ideaStage = 2;
  }
  if (player.ideaStage < 3 && elapsed >= IDEA_GOOD_MS) {
    grantIdeaGood(room, player, timestamp);
    player.ideaStage = 3;
  }
  if (player.ideaStage < 4 && elapsed >= IDEA_ASCENSION_MS) beginIdeaAscension(room, player, timestamp);
}

function rectContains(rect, x, y, radius = 0) {
  if (Array.isArray(rect.polygon) && rect.polygon.length >= 3) {
    const insetRadius = Math.max(0, Number(radius) || 0);
    if (!pointInsidePolygon(x, y, rect.polygon)) return false;
    if (!insetRadius) return true;
    for (let index = 0; index < rect.polygon.length; index += 1) {
      const start = rect.polygon[index];
      const end = rect.polygon[(index + 1) % rect.polygon.length];
      if (pointToSegmentDistance(x, y, start[0], start[1], end[0], end[1]) < insetRadius) return false;
    }
    return true;
  }
  return x >= rect.x + radius && x <= rect.x + rect.w - radius && y >= rect.y + radius && y <= rect.y + rect.h - radius;
}

function pointInsidePolygon(x, y, polygon) {
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
    const [currentX, currentY] = polygon[index];
    const [previousX, previousY] = polygon[previous];
    const crosses = (currentY > y) !== (previousY > y) &&
      x < ((previousX - currentX) * (y - currentY)) / (previousY - currentY || 1) + currentX;
    if (crosses) inside = !inside;
  }
  return inside;
}

function pointToSegmentDistance(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;
  const ratio = lengthSquared ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSquared)) : 0;
  return Math.hypot(px - (ax + dx * ratio), py - (ay + dy * ratio));
}

function activeDoors(room) {
  const map = getMap(room);
  const timestamp = now();
  return map.doors.filter((door) => (room.doorState[door.id] || 0) > timestamp);
}

function isWalkable(room, x, y, radius = 0) {
  const map = getMap(room);
  const insideMap = x >= radius && y >= radius && x <= map.width - radius && y <= map.height - radius;
  if (!insideMap) return false;
  const seamMargin = Math.max(radius, WALKABLE_SEAM_MARGIN);
  if (!map.walkable.some((rect) => rectContains(rect, x, y, -seamMargin))) return false;
  return !activeDoors(room).some((door) => rectContains(door, x, y, -6));
}

function isFloorArea(room, x, y, radius = 0) {
  const map = getMap(room);
  const insideMap = x >= radius && y >= radius && x <= map.width - radius && y <= map.height - radius;
  if (!insideMap) return false;
  const seamMargin = Math.max(radius, WALKABLE_SEAM_MARGIN);
  return map.walkable.some((rect) => rectContains(rect, x, y, -seamMargin));
}

function advanceLevitationMana(room, player, elapsedMs) {
  if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent) return;
  const radius = getMap(room).playerRadius || 36;
  const offFloor = !isFloorArea(room, player.x, player.y, radius);
  if (!offFloor) {
    player.levitationEngaged = false;
    player.levitationManaCarry = 0;
    return;
  }
  if (!hasOperatorAccess(player, "gravity")) return;
  if (!player.levitationEngaged) {
    if (!passivesEnabled(player)) return;
    player.levitationEngaged = true;
  }
  player.levitationManaCarry = Math.max(0, Number(player.levitationManaCarry) || 0) +
    Math.max(0, elapsedMs) / 1000 * LEVITATION_MANA_DRAIN_PER_SECOND;
  const drain = Math.floor((player.levitationManaCarry + 1e-9) * 100) / 100;
  if (drain < 0.01) return;
  player.levitationManaCarry = Math.max(0, player.levitationManaCarry - drain);
  setMana(room, player, Number(player.mana) - drain, "リビテーション");
  if (Number(player.mana) <= 0) {
    player.levitationEngaged = false;
    player.levitationManaCarry = 0;
  }
}

function setClairvoyanceActive(room, player, active) {
  const shouldActivate = Boolean(active);
  if (!shouldActivate) {
    player.clairvoyanceActive = false;
    player.clairvoyanceManaCarry = 0;
    touch(room);
    return false;
  }
  if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "今は千里眼を使用できません。");
  }
  ensureConscious(player);
  if (Number(player.mana) <= 0) throw new ApiError(400, "千里眼に必要なMPがありません。");
  player.clairvoyanceActive = true;
  player.clairvoyanceManaCarry = Math.max(0, Number(player.clairvoyanceManaCarry) || 0);
  markSoloMissionAction(room, player, "clairvoyance");
  touch(room);
  return true;
}

function advanceClairvoyanceMana(room, player, elapsedMs) {
  if (!player.clairvoyanceActive) return;
  if (room.phase === "meeting") return;
  if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent) {
    player.clairvoyanceActive = false;
    player.clairvoyanceManaCarry = 0;
    return;
  }
  player.clairvoyanceManaCarry = Math.max(0, Number(player.clairvoyanceManaCarry) || 0) +
    Math.max(0, elapsedMs) / 1000 * CLAIRVOYANCE_MANA_DRAIN_PER_SECOND;
  const drain = Math.floor((player.clairvoyanceManaCarry + 1e-9) * 100) / 100;
  if (drain < 0.01) return;
  player.clairvoyanceManaCarry = Math.max(0, player.clairvoyanceManaCarry - drain);
  setMana(room, player, Number(player.mana) - drain, "千里眼");
  if (Number(player.mana) <= 0) {
    player.clairvoyanceActive = false;
    player.clairvoyanceManaCarry = 0;
    pushEvent(room, `${player.name} の千里眼はMP切れで終了しました。`);
  }
}

function activeLevitationSources(player, timestamp = now()) {
  const sources = [];
  if (Number(player?.hsgUntil) > timestamp) sources.push("hsg");
  if (
    hasOperatorAccess(player, "gravity") &&
    Number(player.mana) > 0 &&
    (passivesEnabled(player) || player.levitationEngaged)
  ) sources.push("gravity");
  return sources;
}

function canLevitate(player, timestamp = now()) {
  return activeLevitationSources(player, timestamp).length > 0;
}

function synchronizeSharedLevitationExpiry(room, player, timestamp = now()) {
  if (!player) return false;
  const active = activeLevitationSources(player, timestamp).length > 0;
  const wasActive = Boolean(player.sharedLevitationActive);
  player.sharedLevitationActive = active;
  if (active || !wasActive) return false;
  if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent) return false;
  const radius = getMap(room).playerRadius || 36;
  if (isFloorArea(room, player.x, player.y, radius)) return false;
  const destroyed = destroyPlayerUnconditionally(room, null, player, "共有浮揚終了後の足場外落下", {
    noKillCutin: true,
    attackKind: "unsupported-fall-after-levitation",
    attackLabel: "共有浮揚終了後の足場外落下"
  });
  if (destroyed) {
    checkWin(room);
    touch(room);
  }
  return destroyed;
}

function moveToward(room, player, target, dtSeconds, sprint = false) {
  const dx = target.x - player.x;
  const dy = target.y - player.y;
  const len = Math.hypot(dx, dy) || 1;
  movePlayer(room, player, dx / len, dy / len, dtSeconds, sprint);
}

function clearWalkLine(room, start, end, radius) {
  const length = distance(start, end);
  const steps = Math.max(1, Math.ceil(length / 24));
  for (let index = 1; index <= steps; index += 1) {
    const ratio = index / steps;
    const x = start.x + (end.x - start.x) * ratio;
    const y = start.y + (end.y - start.y) * ratio;
    if (!isWalkable(room, x, y, radius)) return false;
  }
  return true;
}

function nearestOpenGridCell(matrix, column, row) {
  const height = matrix.length;
  const width = matrix[0]?.length || 0;
  const startX = Math.max(0, Math.min(width - 1, column));
  const startY = Math.max(0, Math.min(height - 1, row));
  for (let radius = 0; radius <= 5; radius += 1) {
    for (let y = startY - radius; y <= startY + radius; y += 1) {
      for (let x = startX - radius; x <= startX + radius; x += 1) {
        if (x < 0 || y < 0 || x >= width || y >= height) continue;
        if (matrix[y][x] === 0) return { x, y };
      }
    }
  }
  return null;
}

function planBotPath(room, bot, target) {
  const map = getMap(room);
  const radius = bot.alive ? map.playerRadius : 8;
  const columns = Math.ceil(map.width / NAV_CELL_SIZE);
  const rows = Math.ceil(map.height / NAV_CELL_SIZE);
  const matrix = Array.from({ length: rows }, (_, row) => (
    Array.from({ length: columns }, (_, column) => {
      const x = Math.min(map.width - radius, (column + 0.5) * NAV_CELL_SIZE);
      const y = Math.min(map.height - radius, (row + 0.5) * NAV_CELL_SIZE);
      return isWalkable(room, x, y, radius) ? 0 : 1;
    })
  ));
  for (const other of room.players.values()) {
    if (other.id === bot.id || other.id === target?.id || !other.alive || other.ejected || other.inVent) continue;
    const column = Math.floor(other.x / NAV_CELL_SIZE);
    const row = Math.floor(other.y / NAV_CELL_SIZE);
    // Blocking a 3x3 area around every player can seal a narrow corridor and
    // leave defender bots without any route. Reserve only the occupied cell;
    // route-conflict handling still keeps bots from following the same line.
    if (matrix[row]?.[column] === 0) matrix[row][column] = 1;
  }
  const start = nearestOpenGridCell(
    matrix,
    Math.floor(bot.x / NAV_CELL_SIZE),
    Math.floor(bot.y / NAV_CELL_SIZE)
  );
  const goal = nearestOpenGridCell(
    matrix,
    Math.floor(target.x / NAV_CELL_SIZE),
    Math.floor(target.y / NAV_CELL_SIZE)
  );
  if (!start || !goal) return [];

  const grid = new PF.Grid(columns, rows, matrix);
  const finder = new PF.AStarFinder({
    allowDiagonal: true,
    dontCrossCorners: true,
    heuristic: PF.Heuristic.octile
  });
  let path = finder.findPath(start.x, start.y, goal.x, goal.y, grid);
  if (!path.length) return [];
  path = PF.Util.compressPath(path);
  const points = path.slice(1).map(([column, row]) => ({
    x: Math.min(map.width - radius, (column + 0.5) * NAV_CELL_SIZE),
    y: Math.min(map.height - radius, (row + 0.5) * NAV_CELL_SIZE)
  }));
  if (isWalkable(room, target.x, target.y, radius)) points.push({ x: target.x, y: target.y });
  return points;
}

function moveBotToward(room, bot, target) {
  if (!target) return false;
  const map = getMap(room);
  const radius = bot.alive ? map.playerRadius : 8;
  const hostileChase = bot.role === "attacker" && target?.role === "defender";
  const sprint = distance(bot, target) > (hostileChase ? 76 : 420) && bot.stamina > 22;
  const timestamp = now();
  const routeConflict = [...room.players.values()].some((other) => {
    if (other.id === bot.id || other.id === target?.id || !other.alive || other.ejected || distance(bot, other) > PAIR_ROUTE_RADIUS * 1.5) return false;
    const botLength = Math.hypot(Number(bot.vx) || 0, Number(bot.vy) || 0);
    const otherLength = Math.hypot(Number(other.vx) || 0, Number(other.vy) || 0);
    if (botLength < 0.1 || otherLength < 0.1) return true;
    return (bot.vx * other.vx + bot.vy * other.vy) / (botLength * otherLength) > 0.55;
  });
  if (routeConflict) bot.navForcePathUntil = Math.max(bot.navForcePathUntil || 0, timestamp + 1200);
  if (timestamp >= (bot.navForcePathUntil || 0) && clearWalkLine(room, bot, target, radius)) {
    bot.navPath = [];
    const beforeX = bot.x;
    const beforeY = bot.y;
    moveToward(room, bot, target, undefined, sprint);
    const moved = Math.hypot(bot.x - beforeX, bot.y - beforeY);
    bot.navStuckTicks = moved < 0.2 ? (bot.navStuckTicks || 0) + 1 : 0;
    if (bot.navStuckTicks >= 3) {
      bot.navForcePathUntil = timestamp + 900;
      bot.navCalculatedAt = 0;
      bot.navStuckTicks = 0;
    }
    return moved >= 0.2;
  }

  const targetMoved = Math.hypot(target.x - bot.navTargetX, target.y - bot.navTargetY) > 100;
  if (!bot.navPath?.length || targetMoved || timestamp - bot.navCalculatedAt >= BOT_PATH_REFRESH_MS) {
    bot.navPath = planBotPath(room, bot, target);
    bot.navTargetX = target.x;
    bot.navTargetY = target.y;
    bot.navCalculatedAt = timestamp;
  }

  while (bot.navPath.length && distance(bot, bot.navPath[0]) < 32) bot.navPath.shift();
  const waypoint = bot.navPath[0];
  if (!waypoint) return false;
  const beforeX = bot.x;
  const beforeY = bot.y;
  moveToward(room, bot, waypoint, undefined, sprint);
  const moved = Math.hypot(bot.x - beforeX, bot.y - beforeY);
  bot.navStuckTicks = moved < 0.2 ? (bot.navStuckTicks || 0) + 1 : 0;
  if (bot.navStuckTicks >= 3) {
    bot.navPath = [];
    bot.navCalculatedAt = 0;
    bot.navStuckTicks = 0;
    return false;
  }
  return moved >= 0.2;
}

function advancePairRouteRule(room, timestamp) {
  if (room.phase !== "playing") return;
  if (preparationBarrierActive(room, timestamp)) return;
  const active = [...room.players.values()].filter((player) => player.alive && !player.ejected && !player.inVent);
  for (const player of active) {
    const speed = Math.hypot(Number(player.vx) || 0, Number(player.vy) || 0);
    const partners = speed < 0.12 ? [] : active.filter((other) => {
      if (other.id === player.id || distance(player, other) > PAIR_ROUTE_RADIUS) return false;
      const otherSpeed = Math.hypot(Number(other.vx) || 0, Number(other.vy) || 0);
      if (otherSpeed < 0.12) return false;
      return (player.vx * other.vx + player.vy * other.vy) / (speed * otherSpeed) >= 0.72;
    });
    const ids = partners.map((partner) => partner.id).sort();
    const previous = (player.routePartnerIds || []).join("|");
    const current = ids.join("|");
    if (!ids.length || previous !== current) {
      player.routePartnerIds = ids;
      player.routeSharedSince = ids.length ? timestamp : 0;
      continue;
    }
    if (player.role === "attacker" || timestamp - (Number(player.routeSharedSince) || timestamp) < PAIR_ROUTE_GRACE_MS) continue;
    if ((Number(player.routeDamageReadyAt) || 0) > timestamp) continue;
    player.routeDamageReadyAt = timestamp + PAIR_ROUTE_DAMAGE_INTERVAL_MS;
    if (player.overheal > 0) {
      player.overheal -= 1;
      pushEvent(room, `${player.name} はペア行動禁止ダメージをオーバーヒールで吸収しました。`);
      continue;
    }
    player.bodyHits = Math.min(2, (Number(player.bodyHits) || 0) + 1);
    pushHitEffect(room, player, "body", player.bodyHits >= 2);
    pushMagicEffect(room, "pair-route-violation", player, { radius: PAIR_ROUTE_RADIUS, playerId: player.id });
    pushEvent(room, `${player.name} が同一経路でのペア行動を続け、ダメージを受けました。`);
    if (player.bodyHits >= 2) destroyPlayerUnconditionally(room, null, player, "ペア行動禁止違反");
  }
  checkWin(room);
}

function staminaCapacityFor(entity) {
  return MAX_STORED_STAMINA * Math.max(1, limitBreakMultiplier(entity));
}

function advanceAutomaticManaToStamina(room, player, elapsedMs, timestamp = now()) {
  if (room.phase !== "playing" || !player?.alive || player.ejected || isDesireState(player)) return false;
  const mana = Number(player.mana) || 0;
  const stamina = Math.max(0, Number(player.stamina) || 0);
  const targetStamina = Math.min(AUTO_MANA_TO_STAMINA_THRESHOLD, staminaCapacityFor(player));
  if (mana <= AUTO_MANA_TO_STAMINA_RESERVE || stamina >= targetStamina) return false;
  const elapsedSeconds = Math.min(0.25, Math.max(0, Number(elapsedMs) || 0) / 1000);
  const availableFromMana = (mana - AUTO_MANA_TO_STAMINA_RESERVE) * STAMINA_TO_MANA_COST;
  const restored = Math.min(
    AUTO_MANA_TO_STAMINA_RATE_PER_SECOND * elapsedSeconds,
    targetStamina - stamina,
    availableFromMana
  );
  if (restored <= 0.0001) return false;
  player.stamina = stamina + restored;
  player.staminaUpdatedAt = timestamp;
  setMana(room, player, mana - restored / STAMINA_TO_MANA_COST, "MP自動SP変換");
  maintainNaturalRecovery(room, player, timestamp);
  if ((Number(player.autoManaToStaminaFeedbackAt) || 0) <= timestamp) {
    player.autoManaToStaminaFeedbackAt = timestamp + 1000;
    pushGainAte(room, player, "stamina", { variant: "auto-mana-to-stamina", durationMs: 1050 });
    setImmediateFeedback(player, "自動資源変換", "余剰MP → SP");
  }
  return true;
}

function replenishStamina(entity, timestamp, allowRegen = true, multiplier = 1, room = null, convertOverflow = true) {
  const last = entity.staminaUpdatedAt || timestamp;
  const elapsed = Math.min(0.5, Math.max(0, (timestamp - last) / 1000));
  if (allowRegen) {
    const desireMultiplier = desireBiasGroupActive(room, entity) ? DESIRE_BIAS_GROUP_MULTIPLIER : 1;
    const recovery = STAMINA_REGEN_PER_SECOND * elapsed * Math.max(1, multiplier) * desireMultiplier;
    const capacity = staminaCapacityFor(entity);
    const current = Math.min(capacity, Math.max(0, Number(entity.stamina) || 0));
    const restored = Math.min(recovery, capacity - current);
    entity.stamina = current + restored;
    const overflow = Math.max(0, recovery - restored);
    if (room && convertOverflow && overflow > 0) {
      entity.staminaManaOverflow = Math.max(0, Number(entity.staminaManaOverflow) || 0) + overflow;
      const conversionUnit = STAMINA_TO_MANA_COST / 10;
      const conversionSteps = Math.floor(entity.staminaManaOverflow / conversionUnit);
      if (conversionSteps > 0) {
        entity.staminaManaOverflow -= conversionSteps * conversionUnit;
        setMana(room, entity, Number(entity.mana) + conversionSteps / 10, "スタミナ自動変換");
        pushGainAte(room, entity, "mana", { variant: "stamina-overflow", durationMs: 1320 });
      }
    }
  }
  entity.staminaUpdatedAt = timestamp;
  if (room) {
    syncDesireState(room, entity, "スタミナ回復");
    maintainNaturalRecovery(room, entity, timestamp);
  }
}

function availableStamina(entity) {
  return Math.max(0, Number(entity.stamina) || 0);
}

function spendStamina(entity, rawAmount, room = null, sourceLabel = "スタミナ消費") {
  if (hasFighterInfiniteResources(entity)) return false;
  const baseAmount = Math.max(0, Number(rawAmount) || 0);
  const amount = entity?.desireBias === "sunk-cost" ? baseAmount * DESIRE_BIAS_COST_MULTIPLIER : baseAmount;
  const previous = Number(entity.stamina) || 0;
  const next = previous - amount;
  if (room && previous > 0 && next <= 0) {
    enterDesireState(room, entity, sourceLabel);
    return;
  }
  entity.stamina = Math.max(0, next);
  if (room) syncDesireState(room, entity, sourceLabel);
}

function activeTimedAccelerationEffects(player, timestamp = now()) {
  return (Array.isArray(player?.timedAccelerationEffects) ? player.timedAccelerationEffects : [])
    .filter((effect) => Number(effect?.endsAt) > timestamp && Number(effect?.multiplier) > 1);
}

function timedAccelerationSummary(player, timestamp = now()) {
  const effects = activeTimedAccelerationEffects(player, timestamp);
  const bySource = {};
  for (const effect of effects) {
    const source = String(effect.source || "acceleration");
    bySource[source] ||= { count: 0, multiplier: 0, endsAt: 0 };
    bySource[source].count += 1;
    bySource[source].multiplier += Number(effect.multiplier);
    bySource[source].endsAt = Math.max(bySource[source].endsAt, Number(effect.endsAt) || 0);
  }
  const multiplier = effects.length ? effects.reduce((sum, effect) => sum + Number(effect.multiplier), 0) : 1;
  return { count: effects.length, multiplier, bySource };
}

function addTimedAcceleration(player, source, multiplier, durationMs, timestamp = now()) {
  player.timedAccelerationEffects = activeTimedAccelerationEffects(player, timestamp);
  const effect = {
    id: uid("acceleration_"),
    source: String(source || "acceleration"),
    multiplier: Math.max(1, Number(multiplier) || 1),
    startedAt: timestamp,
    endsAt: timestamp + Math.max(0, Number(durationMs) || 0)
  };
  player.timedAccelerationEffects.push(effect);
  if (effect.source === "flora") player.overhealSpeedUntil = Math.max(Number(player.overhealSpeedUntil) || 0, effect.endsAt);
  if (effect.source === "hsg") player.hsgUntil = Math.max(Number(player.hsgUntil) || 0, effect.endsAt);
  return timedAccelerationSummary(player, timestamp);
}

function accelerationMultipliersFor(player, timestamp = now()) {
  const values = [];
  const purchased = Math.max(1, Number(player.speedMultiplier) || 1);
  if (purchased > 1) values.push(purchased);
  if (player.luminousActive) values.push(LUMINOUS_SPEED_MULTIPLIER);
  if (player.limitBreakActive) values.push(limitBreakMultiplier(player));
  if (player.goodActive && passivesEnabled(player)) values.push(GOOD_SPEED_MULTIPLIER);
  for (const effect of activeTimedAccelerationEffects(player, timestamp)) values.push(Number(effect.multiplier));
  return values;
}

function additiveAccelerationMultiplier(player, extraMultipliers = [], timestamp = now()) {
  const values = [...accelerationMultipliersFor(player, timestamp), ...extraMultipliers]
    .map(Number)
    .filter((value) => Number.isFinite(value) && value > 1);
  return values.length ? values.reduce((sum, value) => sum + value, 0) : 1;
}

function effectiveSpeedMultiplier(player, extraMultipliers = [], timestamp = now()) {
  return additiveAccelerationMultiplier(player, extraMultipliers, timestamp);
}

function accelerationTimerMultiplier(player, extraMultipliers = [], timestamp = now()) {
  return additiveAccelerationMultiplier(player, extraMultipliers, timestamp);
}

function effectiveAccelerationMultiplier(room, player, timestamp = now()) {
  const passive = activeMapObjectEffects(room, player);
  const gravityScale = gravityTimeScaleFor(room, player, timestamp);
  const accelerations = passive.speedBoost ? [MAP_OBJECT_SPEED_MULTIPLIER] : [];
  const accelerated = accelerationTimerMultiplier(player, accelerations, timestamp);
  const base = gravityScale < 1 ? gravityScale : accelerated;
  return base * (player.desireBias === "cognitive-dissonance" ? DESIRE_BIAS_TIME_MULTIPLIER : 1);
}

function movementAccState(room, player, timestamp = now()) {
  const enabled = player?.movementAccEnabled !== false;
  const acceleration = effectiveAccelerationMultiplier(room, player, timestamp);
  const available = acceleration + 1e-6 >= MOVEMENT_ACC_ACTIVATION_THRESHOLD;
  const active = enabled && available;
  return {
    enabled,
    active,
    available,
    selected: active ? FIXED_MOVEMENT_ACC : NORMAL_MOVEMENT_ACC,
    maximum: FIXED_MOVEMENT_ACC,
    threshold: MOVEMENT_ACC_ACTIVATION_THRESHOLD
  };
}

function setMovementAccEnabled(room, player, rawEnabled) {
  if (!room || !player || !["playing", "meeting"].includes(room.phase) || player.ejected) {
    throw new ApiError(403, "現在は移動ACCを変更できません。");
  }
  player.movementAccEnabled = rawEnabled !== false;
  const state = movementAccState(room, player);
  const label = `ACC ${state.maximum}`;
  setImmediateFeedback(player, "移動ACC", state.active ? `${label} 固定中` : state.enabled ? `${label} 待機` : `${label} OFF`);
  touch(room);
  return state;
}

function persistentStatusAteState(room, player, timestamp = now()) {
  const passive = activeMapObjectEffects(room, player);
  const acceleration = additiveAccelerationMultiplier(
    player,
    passive.speedBoost ? [MAP_OBJECT_SPEED_MULTIPLIER] : [],
    timestamp
  ) > 1.001;
  return {
    acceleration,
    clairvoyance: Boolean(player.clairvoyanceActive),
    levitation: Boolean(player.levitationEngaged || Number(player.hsgUntil) > timestamp),
    hpReduction: hasLimitBreakDeathVulnerability(player),
    resistanceBreak: hasLimitBreakDeathVulnerability(player),
    standFirm: (Number(player.gritCharges) || 0) > 0,
    push: (Number(player.reasonCharges) || 0) > 0,
    iai: (Number(player.iaiCharges) || 0) > 0,
    burning: Boolean(player.burnStatus),
    poison: Boolean(player.poisonStatus)
  };
}

const ACCELERATED_ACTION_UNTIL_FIELDS = Object.freeze([
  "sleepingUntil",
  "unconsciousUntil",
  "meditatingUntil",
  "smartphoneUntil",
  "gravityPinnedUntil",
  "ascensionUntil",
  "itemDisabledUntil",
  "abilityDisabledUntil",
  "taserSlowedUntil",
  "shockSlowedUntil",
  "gunnerReloadUntil",
  "attackResolveAt"
]);

const TIME_KEEPER_FROZEN_DEADLINE_FIELDS = Object.freeze([
  "hsgUntil",
  "dodgeActiveUntil",
  "limitBreakEndsAt",
  "slowedUntil",
  "gravityStormSlowUntil",
  "overhealSpeedUntil",
  "airborneUntil",
  "objectLuckUntil",
  "gravityTimeEndsAt",
  "timeKeeperEndsAt",
  "particleCannonUntil",
  "particleCannonNextAt",
  "gunnerFiringNextAt",
  "gunnerFiringEndsAt",
  "botTargetUntil",
  "botRetaliationUntil",
  "botWitnessUntil",
  "botClairvoyanceUntil",
  "botClairvoyanceObservedUntil",
  "nextBotClairvoyanceAt",
  "botDeceptionUntil",
  "heardWaypointUntil"
]);

const TIME_KEEPER_FROZEN_ANCHOR_FIELDS = Object.freeze([
  "gunnerLastShotAt",
  "lastPassiveCreditAt",
  "staminaUpdatedAt",
  "taskPresenceSince",
  "ideaProgressStartedAt",
  "ideaProgressUpdatedAt",
  "ascensionStartedAt",
  "routeSharedSince",
  "botTaskPresenceSince",
  "botTaskPresenceLastTickAt",
  "botDeceptionPresenceSince"
]);

function timeKeeperStops(player, timestamp = now()) {
  return Number(player?.timeStoppedUntil) > timestamp;
}

function roomTimeKeeperActive(room, timestamp = now()) {
  return [...room.players.values()].some((player) => (
    Number(player.timeKeeperEndsAt) > timestamp
  ));
}

function synchronizeTimeKeeperStops(room, timestamp = now()) {
  const activeCasters = [...room.players.values()].filter((player) => Number(player.timeKeeperEndsAt) > timestamp);
  if (!activeCasters.length) return;
  for (const target of room.players.values()) {
    if (!target.alive || target.ejected) continue;
    if (hasNaturalRecovery(room, target)) {
      target.timeStoppedUntil = 0;
      continue;
    }
    const controllingCaster = activeCasters
      .filter((caster) => caster.id !== target.id)
      .sort((a, b) => Number(b.timeKeeperEndsAt) - Number(a.timeKeeperEndsAt))[0];
    if (!controllingCaster) continue;
    target.timeStoppedUntil = Math.max(Number(target.timeStoppedUntil) || 0, Number(controllingCaster.timeKeeperEndsAt) || timestamp);
  }
}

function freezeRoomTimeKeeperState(room, elapsedMs, timestamp = now()) {
  if (!roomTimeKeeperActive(room, timestamp)) return false;
  const elapsed = Math.max(0, Number(elapsedMs) || 0);
  for (const zone of room.gravityZones || []) {
    if (Number(zone.endsAt) <= timestamp) continue;
    zone.startedAt = (Number(zone.startedAt) || timestamp) + elapsed;
    zone.barrierUntil = (Number(zone.barrierUntil) || timestamp) + elapsed;
    zone.endsAt = Number(zone.endsAt) + elapsed;
    zone.lastPulseAt = (Number(zone.lastPulseAt) || timestamp) + elapsed;
  }
  return true;
}

function freezePlayerTimeKeeperState(player, elapsedMs, timestamp = now()) {
  if (!timeKeeperStops(player, timestamp)) return;
  const elapsed = Math.max(0, Number(elapsedMs) || 0);
  if (!elapsed) return;
  for (const field of TIME_KEEPER_FROZEN_DEADLINE_FIELDS) {
    const deadline = Number(player[field]) || 0;
    if (deadline > timestamp) player[field] = deadline + elapsed;
  }
  for (const field of TIME_KEEPER_FROZEN_ANCHOR_FIELDS) {
    const anchor = Number(player[field]) || 0;
    if (anchor > 0) player[field] = anchor + elapsed;
  }
  for (const effect of player.timedAccelerationEffects || []) {
    if (Number(effect.endsAt) <= timestamp) continue;
    effect.startedAt = (Number(effect.startedAt) || timestamp) + elapsed;
    effect.endsAt = Number(effect.endsAt) + elapsed;
  }
  for (const field of ["poisonStatus", "burnStatus"]) {
    const status = player[field];
    if (!status) continue;
    if (Number(status.nextTickAt) > timestamp) status.nextTickAt = Number(status.nextTickAt) + elapsed;
  }
  for (const observation of player.botVisibleThrowObservations || []) {
    if (Number(observation.observedAt) > 0) observation.observedAt = Number(observation.observedAt) + elapsed;
    if (Number(observation.landsAt) > timestamp) observation.landsAt = Number(observation.landsAt) + elapsed;
    if (Number(observation.poisonLandingObservedAt) > 0) observation.poisonLandingObservedAt = Number(observation.poisonLandingObservedAt) + elapsed;
    if (Number(observation.expiresAt) > timestamp) observation.expiresAt = Number(observation.expiresAt) + elapsed;
    for (const victim of Object.values(observation.visiblePoisonVictims || {})) {
      if (Number(victim.firstSeenAt) > 0) victim.firstSeenAt = Number(victim.firstSeenAt) + elapsed;
      if (Number(victim.lastSeenAt) > 0) victim.lastSeenAt = Number(victim.lastSeenAt) + elapsed;
    }
  }
  if (player.jumpMotion && Number(player.jumpMotion.endsAt) > timestamp) {
    player.jumpMotion.startedAt = (Number(player.jumpMotion.startedAt) || timestamp) + elapsed;
    player.jumpMotion.endsAt = Number(player.jumpMotion.endsAt) + elapsed;
  }
  if (player.drone && Number(player.drone.readyAt) > timestamp) player.drone.readyAt = Number(player.drone.readyAt) + elapsed;
}

function advanceAccelerationTime(room, player, elapsedMs, timestamp = now()) {
  if (room.phase !== "playing" || !player.alive || player.ejected) return;
  const elapsed = Math.max(0, Number(elapsedMs) || 0);
  const multiplier = effectiveAccelerationMultiplier(room, player, timestamp);
  const adjustment = elapsed * (multiplier - 1);
  if (Math.abs(adjustment) < 0.001) return;
  if (adjustment > 0) reducePlayerCooldowns(player, adjustment, timestamp);
  else extendPlayerCooldowns(player, -adjustment, timestamp);
  for (const field of ACCELERATED_ACTION_UNTIL_FIELDS) {
    const deadline = Number(player[field]) || 0;
    if (deadline > timestamp) player[field] = Math.max(timestamp, deadline - adjustment);
  }
}

function activeMapObjectEffects(room, player) {
  const objects = getMap(room).objects || [];
  const speedPad = objects.find((object) => (
    object.type === "speedPad" && distance(player, object) <= Number(object.radius || 90)
  ));
  const hushField = objects.find((object) => (
    object.type === "hushField" && distance(player, object) <= Number(object.radius || 110)
  ));
  return {
    speedBoost: Boolean(speedPad),
    quiet: Boolean(hushField),
    labels: [speedPad?.label, hushField?.label].filter(Boolean)
  };
}

function effectiveMovementMultiplier(room, player, timestamp = now()) {
  if (timeKeeperStops(player, timestamp)) return 0;
  const electricSlowMultiplier = Number(player.taserSlowedUntil) > timestamp || Number(player.shockSlowedUntil) > timestamp
    ? TASER_MOVEMENT_MULTIPLIER
    : 1;
  const gravityStormMultiplier = Number(player.gravityStormSlowUntil) > timestamp
    ? clampNumber(player.gravityStormSlowMultiplier, GRAVITY_STORM_SLOW_MULTIPLIER_MIN, 1, 1)
    : 1;
  const groupMultiplier = desireBiasGroupActive(room, player) ? DESIRE_BIAS_GROUP_MULTIPLIER : 1;
  const activeHsgEffects = activeTimedAccelerationEffects(player, timestamp)
    .filter((effect) => effect.source === "hsg");
  const hsgMultiplier = activeHsgEffects.length
    ? activeHsgEffects.reduce((sum, effect) => sum + (Number(effect.multiplier) || 1), 0)
    : 1;
  return DEFAULT_MOVEMENT_SPEED_MULTIPLIER * movementAccState(room, player, timestamp).selected * hsgMultiplier * electricSlowMultiplier * gravityStormMultiplier * groupMultiplier;
}

function floraAromaSource(room, player) {
  return player.alive && !player.ejected && hasOperatorAccess(player, "flora") && passivesEnabled(player)
    ? player
    : null;
}

function floraAromaMultiplier(room, player) {
  return floraAromaSource(room, player) ? FLORA_AROMA_REGEN_MULTIPLIER : 1;
}

function activateHsgForUnsupportedMovement(room, player, targetX, targetY, timestamp = now()) {
  const radius = getMap(room).playerRadius;
  if (
    itemCount(player, "hsg") < 1 ||
    !player.alive ||
    player.ejected ||
    player.inVent ||
    !passivesEnabled(player) ||
    !itemStorageAvailable(player, timestamp) ||
    Number(player.hsgUntil) > timestamp ||
    Number(player.hsgReadyAt) > timestamp ||
    !hasFloorSupport(room, player.x, player.y, radius) ||
    hasFloorSupport(room, targetX, targetY, radius)
  ) return false;
  const preparedMode = String(player.hsgPreparedMode || "");
  const enhanceLevel = Math.min(ENHANCE_MAX_LEVEL, Math.max(0, Math.floor(Number(player.hsgPreparedEnhanceLevel) || 0)));
  const gbo = preparedMode === "gbo";
  const durationMs = gbo
    ? HSG_BASE_DURATION_MS * GBO_PERFORMANCE_MULTIPLIER
    : HSG_BASE_DURATION_MS + (preparedMode === "enhance" ? enhanceLevel * HSG_ENHANCE_DURATION_MS_PER_LEVEL : 0);
  const accelerationMultiplier = gbo
    ? HSG_BASE_ACC_MULTIPLIER * GBO_PERFORMANCE_MULTIPLIER
    : HSG_BASE_ACC_MULTIPLIER + (preparedMode === "enhance" ? enhanceLevel * HSG_ENHANCE_ACC_PER_LEVEL : 0);
  clearHsgPreparedOverdrive(player);
  addTimedAcceleration(player, "hsg", accelerationMultiplier, durationMs, timestamp);
  player.hsgReadyAt = timestamp + HSG_ACTIVATION_COOLDOWN_MS;
  if (gbo) consumeItem(player, "hsg");
  awardAbilityContribution(player, 0.75);
  if (gbo) pushGboOverdriveEffect(room, player, "hsg", "automatic-activation");
  pushMagicEffect(room, "item-hsg-activate", player, {
    radius: 135,
    playerId: player.id,
    variant: gbo ? "auto-unsupported:gbo" : preparedMode === "enhance" ? `auto-unsupported:enhance-${enhanceLevel}` : "auto-unsupported",
    durationMs,
    accelerationMultiplier
  });
  setImmediateFeedback(player, gbo ? "HSG・GBO自動起動" : "HSG自動起動", `浮揚 ${durationMs / 1000}秒 / ACC ${accelerationMultiplier.toFixed(1)} / CT ${HSG_ACTIVATION_COOLDOWN_MS / 1000}秒${gbo ? " / 使用したHSG 1個を破壊" : ""}`);
  pushEvent(room, `${player.name} のHSGが足場のない場所への移動を検知して${gbo ? "GBOで" : ""}自動起動しました（浮揚 ${durationMs / 1000}秒 / ACC ${accelerationMultiplier.toFixed(1)} / CT ${HSG_ACTIVATION_COOLDOWN_MS / 1000}秒${gbo ? " / 使用したHSG 1個は起動後に破壊" : ""}）。`);
  return true;
}

function movePlayer(room, player, rawDx, rawDy, forcedDt, wantsDash = false, wantsSlow = false) {
  if (room.phase !== "playing" || player.ejected || player.inVent) return;
  const timestamp = now();
  if (actionBlockedUntil(player) > timestamp) {
    player.vx = 0;
    player.vy = 0;
    player.movementMode = player.ascensionUntil > timestamp
      ? "ascension"
      : player.sleepingUntil > timestamp
        ? "sleep"
        : player.gravityPinnedUntil > timestamp
          ? "gravity-pinned"
        : timeKeeperStops(player, timestamp)
          ? "time-stopped"
          : "unconscious";
    return;
  }
  const dt = forcedDt ?? Math.min(0.08, Math.max(0.008, (timestamp - player.lastMoveAt) / 1000));
  player.lastMoveAt = timestamp;
  const controllingDrone = Boolean(player.role === "attacker" && player.alive && player.drone?.active);
  const mover = controllingDrone ? player.drone : player;
  if (controllingDrone) player.drone.altitude = DRONE_ALTITUDE_MAX;

  let dx = clampNumber(rawDx, -1, 1, 0);
  let dy = clampNumber(rawDy, -1, 1, 0);
  const len = Math.hypot(dx, dy);
  if (len > 1) {
    dx /= len;
    dy /= len;
  }
  if (!dx && !dy) {
    mover.vx = 0;
    mover.vy = 0;
    mover.movementMode = "idle";
    if (!controllingDrone) replenishStamina(mover, timestamp, true, 1, room);
    return;
  }
  const canDash = Boolean(wantsDash && (controllingDrone || availableStamina(mover) > 0.5));
  const movementMode = canDash ? "dash" : wantsSlow ? "slow" : "walk";
  mover.vx = dx;
  mover.vy = dy;
  mover.movementMode = movementMode;
  if (!controllingDrone) {
    if (movementMode === "dash") clearGunnerAim(player);
    if (!player.gunnerSnipingActive) {
      player.aimX = dx;
      player.aimY = dy;
    }
  } else {
    player.vx = 0;
    player.vy = 0;
  }

  const map = getMap(room);
  if (canDash && !controllingDrone) {
    spendStamina(mover, DASH_DRAIN_PER_SECOND * dt, room, "ダッシュ");
    mover.lastDashAt = timestamp;
  }
  const boost = canDash ? DASH_MULTIPLIER : wantsSlow ? SLOW_WALK_MULTIPLIER : 1;
  const slowedMultiplier = 1;
  const passiveEffects = !controllingDrone && player.alive
    ? activeMapObjectEffects(room, player)
    : { speedBoost: false, quiet: false };
  const baseSpeed = controllingDrone
    ? map.speed * DRONE_SPEED_MULTIPLIER
    : (player.alive ? map.speed * effectiveMovementMultiplier(room, player) : map.ghostSpeed);
  const speed = baseSpeed * boost * slowedMultiplier;
  const radius = controllingDrone ? 8 : (player.alive ? map.playerRadius : 8);
  const beforeX = mover.x;
  const beforeY = mover.y;
  const nx = mover.x + dx * speed * dt;
  const ny = mover.y + dy * speed * dt;
  if (!controllingDrone && player.alive) activateHsgForUnsupportedMovement(room, player, nx, ny, timestamp);
  if (controllingDrone) {
    mover.x = clampNumber(nx, radius, map.width - radius, mover.x);
    mover.y = clampNumber(ny, radius, map.height - radius, mover.y);
  } else if (!player.alive || player.hsgUntil > timestamp || canLevitate(player)) {
    mover.x = clampNumber(nx, radius, map.width - radius, mover.x);
    mover.y = clampNumber(ny, radius, map.height - radius, mover.y);
  } else if (isWalkable(room, nx, ny, radius)) {
    mover.x = nx;
    mover.y = ny;
  } else if (isWalkable(room, nx, mover.y, radius)) {
    mover.x = nx;
  } else if (isWalkable(room, mover.x, ny, radius)) {
    mover.y = ny;
  }
  if (beforeX === mover.x && beforeY === mover.y) return;
  if (!controllingDrone && player.alive && movementMode !== "dash") {
    const drainRate = movementMode === "slow" ? SLOW_WALK_DRAIN_PER_SECOND : WALK_DRAIN_PER_SECOND;
    spendStamina(mover, drainRate * dt, room, movementMode === "slow" ? "無音歩行" : "歩行");
  }
  const soundInterval = movementMode === "dash" ? 210 : 430;
  const silentAssassinStep = !controllingDrone && player.special === "assassin";
  if ((controllingDrone || player.alive) && !silentAssassinStep && movementMode !== "slow" && !passiveEffects.quiet && timestamp - (mover.lastSoundAt || 0) >= soundInterval) {
    mover.lastSoundAt = timestamp;
    const boostedDrone = controllingDrone && movementMode === "dash";
    pushSound(room, movementMode === "dash" ? "dash" : controllingDrone ? "drone" : "walk", mover, {
      ownerId: player.id,
      sourceKind: controllingDrone ? "drone" : "player",
      maxDistance: boostedDrone ? 2100 : movementMode === "dash" ? 1600 : controllingDrone ? 850 : 650,
      volume: boostedDrone ? 1.2 : movementMode === "dash" ? 1 : controllingDrone ? 0.42 : 0.34
    });
  }
}

function findStation(map, id) {
  return map.stations.find((station) => station.id === id);
}

function nearestStation(room, player, predicate = () => true, range = Infinity) {
  const map = getMap(room);
  let best = null;
  let bestDistance = range;
  for (const station of map.stations) {
    if (!predicate(station)) continue;
    const dist = distance(player, station);
    if (dist <= bestDistance) {
      best = station;
      bestDistance = dist;
    }
  }
  return best ? { station: best, distance: bestDistance } : null;
}

function whichRoom(map, player) {
  const found = map.rooms.find((room) => rectContains(room, player.x, player.y, 0));
  return found?.label || "連絡通路";
}

function taskProgress(room) {
  const defenders = [...room.players.values()].filter((player) => player.role === "defender");
  const allTasks = defenders.flatMap((player) => player.taskList);
  const done = allTasks.filter((task) => task.done).length;
  return { done, total: allTasks.length };
}

function soleHumanBotMatchPlayer(room) {
  const players = [...room.players.values()].filter((player) => !player.midJoinAvailable);
  if (!players.some((player) => player.isBot)) return null;
  const humans = players.filter((player) => !player.isBot);
  return humans.length === 1 ? humans[0] : null;
}

function humanPlayersInBotMatch(room) {
  const players = [...room.players.values()].filter((player) => !player.midJoinAvailable);
  if (!players.some((player) => player.isBot)) return [];
  return players.filter((player) => !player.isBot);
}

function winningHumansInBotMatch(room, winnerRole) {
  return humanPlayersInBotMatch(room).filter((player) => player.role === winnerRole);
}

function recordBotMatchElimination(room, target, source = null) {
  if (!target) return;
  target.botMatchEliminatedById = String(source?.id || "");
  if (target.gunFiring) stopGunnerFire(room, target, { reason: "戦闘不能" });
  discardHackerRootState(target);
  clearEnhanceChargeState(target);
  clearHsgPreparedOverdrive(target);
}

const AMBIGUOUS_KILL_CAMERA_ACTION_LABELS = new Set([
  "",
  "死亡原因不明",
  "攻撃",
  "能力",
  "射撃",
  "物理攻撃",
  "非物理攻撃",
  "破壊",
  "反射された攻撃",
  "居合を帯びた攻撃"
]);

function requireExactKillCameraActionLabel(value, context = "death") {
  const label = String(value || "").trim();
  if (
    AMBIGUOUS_KILL_CAMERA_ACTION_LABELS.has(label) ||
    (label.includes("通常") && label.includes("攻撃"))
  ) {
    throw new Error(`Exact kill-camera action label required for ${context}.`);
  }
  return label;
}

const BOT_WITNESS_EVIDENCE_LABELS = Object.freeze({
  "visible-hostile-kill": "目の前で対象の敵対的なキルを視認",
  "visual-poison-throw-death": "投擲動作・毒物の着地・毒表示中の被害者・死亡瞬間を連続して視認"
});

function botKillDecisionEvidenceLabels(room, bot, target, timestamp = now()) {
  if (!room || !bot?.isBot || !target) return [];
  const labels = [];
  if (String(bot.botWitnessTargetId || "") === target.id && Number(bot.botWitnessUntil) > timestamp) {
    const label = BOT_WITNESS_EVIDENCE_LABELS[String(bot.botWitnessEvidenceKind || "")];
    if (label) labels.push(label);
  }
  if (String(bot.botRetaliationTargetId || "") === target.id && Number(bot.botRetaliationUntil) > timestamp) {
    labels.push("対象から受けた確殺を踏ん張りで耐え、攻撃者を視認");
  }
  if (botCanDirectlyObservePlayer(room, bot, target)) {
    labels.push("通常視界と遮蔽物判定を通して対象を直接視認");
  }
  if (
    String(bot.botClairvoyanceTargetId || "") === target.id &&
    Number(bot.botClairvoyanceObservedUntil) > timestamp
  ) {
    labels.push("千里眼で対象を直接観測し、その観測位置を記憶");
  }
  return [...new Set(labels)];
}

function rememberBotKillDecision(room, bot, target, options = {}, timestamp = now()) {
  if (!room || !bot?.isBot || !target) return null;
  const actionLabel = String(options.actionLabel || "攻撃手段").trim();
  const evidence = [...new Set([
    ...botKillDecisionEvidenceLabels(room, bot, target, timestamp),
    ...(Array.isArray(options.evidence) ? options.evidence.map(String).filter(Boolean) : [])
  ])];
  const reasons = [...new Set(
    (Array.isArray(options.reasons) ? options.reasons : [])
      .map((value) => String(value || "").trim())
      .filter(Boolean)
  )];
  const parts = [];
  if (evidence.length) parts.push(`観測証拠: ${evidence.join("／")}`);
  if (reasons.length) parts.push(`判断: ${reasons.join("、")}`);
  parts.push(`選択: ${actionLabel}`);
  const record = {
    targetId: target.id,
    at: timestamp,
    code: String(options.code || "bot-combat-decision"),
    actionLabel,
    evidence,
    logic: parts.join("。")
  };
  bot.botKillDecision = record;
  return record;
}

function botKillCameraDecision(room, source, target, details = {}, timestamp = now()) {
  if (!source?.isBot || !target) return null;
  const trace = source.botKillDecision;
  if (
    trace &&
    String(trace.targetId || "") === target.id &&
    timestamp - Number(trace.at) >= 0 &&
    timestamp - Number(trace.at) <= BOT_KILL_DECISION_TRACE_TTL_MS
  ) {
    return {
      code: String(trace.code || "bot-combat-decision"),
      logic: String(trace.logic || ""),
      evidence: Array.isArray(trace.evidence) ? trace.evidence.map(String) : []
    };
  }
  const actionKind = String(details.actionKind || "");
  const actionLabel = String(details.actionLabel || "攻撃手段");
  if (actionKind.startsWith("reflected-")) {
    return {
      code: "visible-perfect-guard-reflection",
      logic: `観測証拠: 自分へ向けられた${actionLabel.replace(/^反射された/, "")}を視認。判断: ジャストガードが成立したため攻撃者へ反射。選択: ${actionLabel}`,
      evidence: ["自分へ向けられた攻撃を視認"]
    };
  }
  if (actionKind === "fighter-dodge-counter") {
    return {
      code: "visible-certain-kill-dodge-counter",
      logic: "観測証拠: 自分へ向けられた確殺を視認。判断: 回避が成立したためファイターのキルカウンターを発動。選択: 回避キルカウンター",
      evidence: ["自分へ向けられた確殺を視認"]
    };
  }
  const evidence = botKillDecisionEvidenceLabels(room, source, target, timestamp);
  if (evidence.length) {
    return {
      code: "observable-evidence-at-impact",
      logic: `観測証拠: ${evidence.join("／")}。判断: 致死時点に保持していた観測証拠を表示。選択: ${actionLabel}`,
      evidence
    };
  }
  return {
    code: "decision-trace-unavailable",
    logic: `判断記録なし: ${actionLabel}に対応する人間可知の判断記録が残っていないため、内部情報から理由を補完しません。`,
    evidence: []
  };
}

function recordKillCamera(room, target, source = null, details = {}) {
  if (!room || !target || target.ejected) return null;
  const timestamp = Number(details.timestamp) || now();
  const actionLabel = requireExactKillCameraActionLabel(details.actionLabel, details.actionKind || "death");
  const actionKind = String(details.actionKind || "").trim();
  if (!actionKind) throw new Error(`Exact kill-camera action kind required for ${actionLabel}.`);
  const sourceLabel = String(details.sourceLabel || "");
  const killerName = String(details.killerName || source?.name || "環境・ルール");
  const botDecision = botKillCameraDecision(room, source, target, {
    ...details,
    actionLabel,
    actionKind
  }, timestamp);
  const record = {
    id: uid("killcam_"),
    at: timestamp,
    mapId: String(getMap(room).id || ""),
    areaLabel: whichRoom(getMap(room), target),
    victimId: target.id,
    victimName: target.name,
    victimX: Math.round(Number(target.x) || 0),
    victimY: Math.round(Number(target.y) || 0),
    killerId: String(source?.id || ""),
    killerName,
    killerIsBot: Boolean(source?.isBot),
    killerSkinId: String(source?.skinId || (source?.isBot ? "operator" : "")),
    killerX: Math.round(Number(source?.x ?? target.x) || 0),
    killerY: Math.round(Number(source?.y ?? target.y) || 0),
    actionLabel,
    actionKind,
    sourceLabel,
    reflected: actionKind.includes("reflected") || Boolean(details.reflected),
    result: String(details.result || "死亡"),
    botDecisionCode: String(botDecision?.code || ""),
    botDecisionLogic: String(botDecision?.logic || ""),
    botDecisionEvidence: Array.isArray(botDecision?.evidence) ? botDecision.evidence : []
  };
  target.killCamera = record;
  return record;
}

function botMatchHumanEarnedEliminationVictory(room, winnerRole) {
  const winningHumans = winningHumansInBotMatch(room, winnerRole);
  if (winningHumans.length === 0) return true;
  const winningHumanIds = new Set(winningHumans.map((player) => player.id));
  const opponents = [...room.players.values()].filter((player) => (
    !player.midJoinAvailable && player.role !== winnerRole
  ));
  return opponents.length > 0 && opponents.every((player) => (
    (!player.alive || player.ejected) && winningHumanIds.has(player.botMatchEliminatedById)
  ));
}

function botMatchHumanOwnsCriticalSabotage(room) {
  const humanAttackers = winningHumansInBotMatch(room, "attacker");
  if (humanAttackers.length === 0) return true;
  const sourceId = String(room.sabotage?.sourceId || "");
  return humanAttackers.some((player) => player.id === sourceId);
}

function botMatchHumanOwnsVictory(room, winner, cause = null) {
  const humans = humanPlayersInBotMatch(room);
  if (humans.length === 0) return true;
  const victoryCause = cause || {};

  if (winner === "idea") {
    const sourceIds = Array.isArray(victoryCause.sourceIds)
      ? victoryCause.sourceIds.map(String)
      : ideaWinnerIdsFor(room);
    return victoryCause.type === "idea" && humans.some((player) => sourceIds.includes(player.id));
  }

  const winnerRole = winner === "defenders"
    ? "defender"
    : winner === "attackers"
      ? "attacker"
      : "";
  if (room.soloMission) {
    const trainee = room.players.get(room.soloMission.playerId);
    if (!trainee || !winnerRole || winnerRole !== trainee.role) return true;
    return victoryCause.type === "soloMission" &&
      String(victoryCause.sourceId || "") === trainee.id &&
      Boolean(room.soloMission.completed);
  }
  const winningHumans = winningHumansInBotMatch(room, winnerRole);
  if (!winnerRole || winningHumans.length === 0) return true;

  if (victoryCause.type === "elimination") {
    return botMatchHumanEarnedEliminationVictory(room, winnerRole);
  }
  if (victoryCause.type === "tasks") {
    return winningHumans.every((human) => {
      const tasks = Array.isArray(human.taskList) ? human.taskList : [];
      return human.alive && !human.ejected && tasks.length > 0 && tasks.every((task) => task.done);
    });
  }
  if (victoryCause.type === "criticalSabotage") {
    const sourceId = String(victoryCause.sourceId || "");
    return winnerRole === "attacker" && winningHumans.some((human) => human.id === sourceId);
  }

  return false;
}

function botIsEnemyOfSoleHuman(room, bot) {
  const human = soleHumanBotMatchPlayer(room);
  return !human || bot?.role !== human.role;
}

function botSharesTeamWithHuman(room, bot) {
  if (!bot?.isBot) return false;
  return [...room.players.values()].some((player) => (
    !player.isBot &&
    !player.midJoinAvailable &&
    player.role === bot.role
  ));
}

function botOpposesLivingHuman(room, bot) {
  if (!bot?.isBot || room.soloMission) return false;
  return [...room.players.values()].some((player) => (
    !player.isBot &&
    !player.midJoinAvailable &&
    player.alive &&
    !player.ejected &&
    player.role !== bot.role
  ));
}

function botAllyCannotFinishTarget(room, source, target) {
  const human = soleHumanBotMatchPlayer(room);
  return Boolean(
    human &&
    source?.isBot &&
    source.role === human.role &&
    target?.role !== human.role
  );
}

function taskProgressForWin(room) {
  const humans = humanPlayersInBotMatch(room);
  if (humans.length === 0) return taskProgress(room);
  const defenderHumans = humans.filter((player) => player.role === "defender");
  // Bot defenders may defeat human attackers, but cannot supply a human defender's win.
  if (defenderHumans.length === 0) return taskProgress(room);
  const tasks = defenderHumans.flatMap((player) => Array.isArray(player.taskList) ? player.taskList : []);
  if (defenderHumans.some((player) => !player.alive || player.ejected)) return { done: 0, total: tasks.length };
  return { done: tasks.filter((task) => task.done).length, total: tasks.length };
}

function alivePlayers(room, role) {
  return [...room.players.values()].filter((player) => player.role === role && player.alive && !player.ejected);
}

function finish(room, winner, reason, cause = {}) {
  if (!botMatchHumanOwnsVictory(room, winner, cause)) return false;
  room.phase = "ended";
  room.winner = winner;
  if (room.soloMission?.id === "cpu-gravity" && winner === "attackers") {
    room.soloMission.hintUnlocked = true;
  }
  room.finishReason = reason;
  updatePlayerProfiles(room);
  room.meeting = null;
  room.sabotage = null;
  room.pendingIdeaVictoryAt = 0;
  room.players.forEach((player) => {
    player.inVent = false;
    player.ventId = "";
    player.dodgeActiveUntil = 0;
    player.slashActiveUntil = 0;
    player.slashPerfectUntil = 0;
    player.slashGuardInputReleased = true;
    player.drone.active = false;
    player.clairvoyanceActive = false;
    player.clairvoyanceManaCarry = 0;
    clearAttackState(player);
  });
  const ideaWinnerCount = winner === "idea" ? ideaWinnerIdsFor(room).length : 0;
  const winnerLabel = winner === "defenders"
    ? "ディフェンダー"
    : winner === "attackers"
      ? "アタッカー"
      : `善のイデア到達者${ideaWinnerCount > 1 ? ` ${ideaWinnerCount}人` : ""}`;
  pushEvent(room, `${winnerLabel}勝利: ${reason}`);
  touch(room);
  return true;
}

function forceEnd(room, player) {
  if (room.hostId !== player.id) throw new ApiError(403, "ホストだけが強制終了できます。");
  room.phase = "ended";
  room.winner = "none";
  room.finishReason = `${player.name} が試合を強制終了しました。`;
  room.meeting = null;
  room.sabotage = null;
  setIdeaWinnerIds(room, []);
  room.pendingIdeaVictoryAt = 0;
  room.players.forEach((entry) => {
    entry.inVent = false;
    entry.ventId = "";
    entry.dodgeActiveUntil = 0;
    entry.slashActiveUntil = 0;
    entry.slashPerfectUntil = 0;
    entry.slashGuardInputReleased = true;
    entry.drone.active = false;
    entry.clairvoyanceActive = false;
    entry.clairvoyanceManaCarry = 0;
    clearAttackState(entry);
  });
  pushEvent(room, room.finishReason);
  touch(room);
}

function soloMissionDefinition(room) {
  return room.soloMission ? SOLO_MISSIONS[room.soloMission.id] || null : null;
}

function soloMissionProgress(room, timestamp = now()) {
  const mission = soloMissionDefinition(room);
  const state = room.soloMission;
  if (!mission || !state) return null;
  if (mission.metric === "task") return `${Math.min(1, state.taskCount || 0)} / 1 タスク`;
  if (mission.metric === "kill") {
    const player = room.players.get(state.playerId);
    return `${Math.min(1, Number(player?.totalKills) || 0)} / 1 撃破`;
  }
  if (mission.metric === "defense") {
    if (!state.defenseActivatedAt) return "回避を発動する";
    const seconds = Math.min(mission.surviveMs / 1000, Math.max(0, (timestamp - state.defenseActivatedAt) / 1000));
    return `防御後の生存 ${seconds.toFixed(1)} / ${(mission.surviveMs / 1000).toFixed(0)}秒`;
  }
  if (mission.metric === "intel") {
    return `千里眼投擲 ${state.clairvoyanceUsed ? "完了" : "未完了"} / サボ ${state.sabotageUsed ? "完了" : "未完了"}`;
  }
  if (mission.metric === "emp") {
    const outcomes = new Set(Array.isArray(state.empTrainingOutcomes) ? state.empTrainingOutcomes : []);
    return `打ち消し ${outcomes.has("cancel") ? "完了" : "未完了"} / 増強 ${outcomes.has("amplify") ? "完了" : "未完了"}`;
  }
  if (mission.metric === "cpu") return "グラビティCPUの手順を妨害して生存";
  return mission.objective;
}

function completeSoloMission(room, mission) {
  if (!room.soloMission || room.soloMission.completed || room.phase !== "playing") return false;
  room.soloMission.completed = true;
  const winner = mission.team === "attacker" ? "attackers" : "defenders";
  const finished = finish(room, winner, `ソロ訓練「${mission.name}」を達成しました。`, {
    type: "soloMission",
    sourceId: room.soloMission.playerId
  });
  if (!finished) room.soloMission.completed = false;
  return finished;
}

function evaluateSoloMission(room, timestamp = now()) {
  const mission = soloMissionDefinition(room);
  const state = room.soloMission;
  if (!mission || !state || state.completed || room.phase !== "playing") return false;
  const player = room.players.get(state.playerId);
  if (!player || !player.alive || player.ejected) return false;
  let completed = false;
  if (mission.metric === "task") completed = state.taskCount >= 1;
  else if (mission.metric === "kill") completed = player.totalKills >= 1;
  else if (mission.metric === "defense") {
    completed = Boolean(state.defenseActivatedAt) && timestamp - state.defenseActivatedAt >= mission.surviveMs;
  } else if (mission.metric === "intel") completed = state.clairvoyanceUsed && state.sabotageUsed;
  else if (mission.metric === "emp") {
    const outcomes = new Set(Array.isArray(state.empTrainingOutcomes) ? state.empTrainingOutcomes : []);
    completed = outcomes.has("cancel") && outcomes.has("amplify");
  }
  else if (mission.metric === "cpu" || mission.metric === "cpu2") {
    const cpu = room.players.get(state.cpuBotId);
    completed = Boolean(cpu) && (!cpu.alive || cpu.ejected) && cpu.botMatchEliminatedById === player.id;
  }
  return completed ? completeSoloMission(room, mission) : false;
}

function markSoloMissionAction(room, player, action) {
  const state = room.soloMission;
  if (!state || state.playerId !== player.id || state.completed) return;
  if (action === "task") state.taskCount += 1;
  else if (action === "defense" && !state.defenseActivatedAt) state.defenseActivatedAt = now();
  else if (action === "clairvoyance") state.clairvoyanceUsed = true;
  else if (action === "sabotage") state.sabotageUsed = true;
  evaluateSoloMission(room);
}

function checkWin(room) {
  if (room.phase !== "playing" && room.phase !== "meeting") return;
  if (room.pendingIdeaVictoryAt) return;
  if (evaluateSoloMission(room)) return;
  if (room.soloMission) {
    const trainee = room.players.get(room.soloMission.playerId);
    if (trainee && (!trainee.alive || trainee.ejected)) {
      const winner = trainee.role === "attacker" ? "defenders" : "attackers";
      finish(room, winner, "訓練目標の達成前にプレイヤーが行動不能になりました。", {
        type: "soloMissionFailure",
        sourceId: ""
      });
    }
    return;
  }
  const attackers = alivePlayers(room, "attacker");
  const defenders = alivePlayers(room, "defender");
  const progress = taskProgressForWin(room);

  if (attackers.length === 0) {
    if (botMatchHumanEarnedEliminationVictory(room, "defender")) {
      finish(room, "defenders", "アタッカーを全員追放しました。", { type: "elimination" });
    }
    return;
  }
  if (defenders.length === 0 && room.phase === "playing") {
    if (botMatchHumanEarnedEliminationVictory(room, "attacker")) {
      finish(room, "attackers", "ディフェンダーが全滅しました。", { type: "elimination" });
    }
    return;
  }
  if (progress.total > 0 && progress.done >= progress.total) {
    finish(room, "defenders", "全タスクを完了しました。", { type: "tasks" });
    return;
  }
}

function completeTasksAfterDeath(room, player) {
  if (player.role !== "defender") return 0;
  player.taskPresenceTaskId = "";
  player.taskPresenceSince = 0;
  let completed = 0;
  for (const task of player.taskList) {
    if (task.done) continue;
    task.done = true;
    completed += 1;
  }
  if (completed > 0) pushEvent(room, `${player.name} の死亡後タスク ${completed}件を完了扱いにしました。`);
  return completed;
}

const MEETING_PAUSED_PLAYER_DEADLINE_FIELDS = Object.freeze([
  "gunnerReloadUntil",
  "hsgUntil",
  "dodgeActiveUntil",
  "limitBreakEndsAt",
  "itemDisabledUntil",
  "slowedUntil",
  "taserSlowedUntil",
  "shockSlowedUntil",
  "gravityStormSlowUntil",
  "sleepingUntil",
  "unconsciousUntil",
  "gravityPinnedUntil",
  "abilityDisabledUntil",
  "overhealSpeedUntil",
  "airborneUntil",
  "meditatingUntil",
  "ascensionUntil",
  "objectLuckUntil",
  "gravityTimeEndsAt",
  "timeKeeperEndsAt",
  "timeStoppedUntil",
  "particleCannonUntil",
  "particleCannonNextAt",
  "smartphoneUntil",
  "botTargetUntil",
  "botRetaliationUntil",
  "botWitnessUntil",
  "botClairvoyanceUntil",
  "botClairvoyanceObservedUntil",
  "nextBotClairvoyanceAt",
  "botDeceptionUntil",
  "heardWaypointUntil"
]);

const MEETING_PAUSED_PLAYER_ANCHOR_FIELDS = Object.freeze([
  "gunnerLastShotAt",
  "lastPassiveCreditAt",
  "staminaUpdatedAt",
  "taskPresenceSince",
  "ideaProgressStartedAt",
  "ideaProgressUpdatedAt",
  "ascensionStartedAt",
  "routeSharedSince",
  "botTaskPresenceSince",
  "botTaskPresenceLastTickAt",
  "botDeceptionPresenceSince"
]);

function shiftMeetingDeadline(owner, key, pausedAt, elapsedMs) {
  const value = Number(owner?.[key]) || 0;
  if (value > pausedAt) owner[key] = value + elapsedMs;
}

function shiftMeetingAnchor(owner, key, elapsedMs) {
  const value = Number(owner?.[key]) || 0;
  if (value > 0) owner[key] = value + elapsedMs;
}

function pausePlayerBattleTime(player, pausedAt, elapsedMs) {
  for (const [key] of Object.entries(player)) {
    if (key.endsWith("ReadyAt")) shiftMeetingDeadline(player, key, pausedAt, elapsedMs);
  }
  for (const key of MEETING_PAUSED_PLAYER_DEADLINE_FIELDS) {
    shiftMeetingDeadline(player, key, pausedAt, elapsedMs);
  }
  for (const key of MEETING_PAUSED_PLAYER_ANCHOR_FIELDS) {
    shiftMeetingAnchor(player, key, elapsedMs);
  }
  player.objectCooldowns ||= {};
  for (const key of Object.keys(player.objectCooldowns)) {
    shiftMeetingDeadline(player.objectCooldowns, key, pausedAt, elapsedMs);
  }
  for (const effect of player.timedAccelerationEffects || []) {
    if (Number(effect.endsAt) <= pausedAt) continue;
    shiftMeetingAnchor(effect, "startedAt", elapsedMs);
    effect.endsAt = Number(effect.endsAt) + elapsedMs;
  }
  for (const field of ["poisonStatus", "burnStatus"]) {
    const status = player[field];
    if (!status) continue;
    shiftMeetingDeadline(status, "nextTickAt", pausedAt, elapsedMs);
  }
  for (const observation of player.botVisibleThrowObservations || []) {
    shiftMeetingAnchor(observation, "observedAt", elapsedMs);
    shiftMeetingDeadline(observation, "landsAt", pausedAt, elapsedMs);
    shiftMeetingAnchor(observation, "poisonLandingObservedAt", elapsedMs);
    shiftMeetingDeadline(observation, "expiresAt", pausedAt, elapsedMs);
    for (const victim of Object.values(observation.visiblePoisonVictims || {})) {
      shiftMeetingAnchor(victim, "firstSeenAt", elapsedMs);
      shiftMeetingAnchor(victim, "lastSeenAt", elapsedMs);
    }
  }
  if (player.jumpMotion && Number(player.jumpMotion.endsAt) > pausedAt) {
    shiftMeetingAnchor(player.jumpMotion, "startedAt", elapsedMs);
    player.jumpMotion.endsAt = Number(player.jumpMotion.endsAt) + elapsedMs;
  }
  if (player.drone) shiftMeetingDeadline(player.drone, "readyAt", pausedAt, elapsedMs);
}

function pauseBattleTimeForMeeting(room, timestamp = now()) {
  const meeting = room.meeting;
  if (room.phase !== "meeting" || !meeting) return 0;
  const pausedAt = Number(meeting.battlePauseUpdatedAt) || Number(meeting.startedAt) || timestamp;
  const elapsedMs = Math.max(0, timestamp - pausedAt);
  meeting.battlePauseUpdatedAt = timestamp;
  if (!elapsedMs) return 0;

  shiftMeetingDeadline(room, "preparationEndsAt", pausedAt, elapsedMs);
  shiftMeetingDeadline(room, "pendingIdeaVictoryAt", pausedAt, elapsedMs);
  for (const player of room.players.values()) pausePlayerBattleTime(player, pausedAt, elapsedMs);
  for (const key of Object.keys(room.doorState || {})) {
    shiftMeetingDeadline(room.doorState, key, pausedAt, elapsedMs);
  }
  for (const pulse of room.activeEmps || []) {
    shiftMeetingAnchor(pulse, "at", elapsedMs);
    shiftMeetingDeadline(pulse, "resolvesAt", pausedAt, elapsedMs);
  }
  for (const zone of room.gravityZones || []) {
    shiftMeetingAnchor(zone, "startedAt", elapsedMs);
    shiftMeetingAnchor(zone, "lastPulseAt", elapsedMs);
    shiftMeetingDeadline(zone, "barrierUntil", pausedAt, elapsedMs);
    shiftMeetingDeadline(zone, "endsAt", pausedAt, elapsedMs);
  }
  for (const field of room.hazardFields || []) {
    shiftMeetingAnchor(field, "createdAt", elapsedMs);
    shiftMeetingDeadline(field, "endsAt", pausedAt, elapsedMs);
    shiftMeetingDeadline(field, "nextTickAt", pausedAt, elapsedMs);
  }
  for (const thrown of room.thrownItems || []) {
    shiftMeetingAnchor(thrown, "createdAt", elapsedMs);
    shiftMeetingDeadline(thrown, "landsAt", pausedAt, elapsedMs);
  }
  for (const object of room.alchemyObjects || []) {
    shiftMeetingAnchor(object, "startedAt", elapsedMs);
    shiftMeetingDeadline(object, "endsAt", pausedAt, elapsedMs);
  }
  return elapsedMs;
}

function startMeeting(room, reason, reporterId, options = {}) {
  if (room.phase !== "playing") return;
  const timestamp = now();
  room.phase = "meeting";
  room.meeting = {
    id: uid("m_"),
    reason,
    reporterId,
    startedAt: timestamp,
    discussionEndsAt: timestamp + room.settings.discussionTime * 1000,
    endsAt: timestamp + (room.settings.discussionTime + room.settings.votingTime) * 1000,
    suspectId: String(options.suspectId || ""),
    evidenceKind: String(options.evidenceKind || ""),
    votes: {},
    battlePauseUpdatedAt: timestamp
  };
  for (const player of room.players.values()) {
    player.inVent = false;
    player.ventId = "";
    player.drone.active = false;
    player.vx = 0;
    player.vy = 0;
    if (player.gunFiring) stopGunnerFire(room, player, { reason: "会議開始" });
    player.gunFiring = false;
    player.gunFiringWeapon = "";
    player.gunFiringSince = 0;
    player.gunnerBurstRoundsRemaining = 0;
    player.gunnerBurstEnhanceLevel = 0;
    player.gunnerBurstGbo = false;
    player.gunnerBurstGboWeapon = "";
    player.gunnerSnipingActive = false;
    player.gunnerAimTargetId = "";
    player.slashActiveUntil = 0;
    player.slashPerfectUntil = 0;
    player.slashGuardInputReleased = true;
    player.jumpPreparingAt = 0;
    player.jumpPrepareDx = 0;
    player.jumpPrepareDy = 1;
    clearAttackState(player);
  }
  pushEvent(room, `会議開始: ${reason}`);
  touch(room);
}

function tallyMeeting(room) {
  pauseBattleTimeForMeeting(room, now());
  const meeting = room.meeting;
  if (!meeting) return;
  const alive = [...room.players.values()].filter((player) => player.alive && !player.ejected);
  const counts = new Map();
  for (const vote of Object.values(meeting.votes)) {
    counts.set(vote, (counts.get(vote) || 0) + 1);
  }
  const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  let ejected = null;
  if (entries.length > 0) {
    const [topTarget, topCount] = entries[0];
    const secondCount = entries[1]?.[1] || 0;
    const skipCount = counts.get("skip") || 0;
    if (topTarget !== "skip" && topCount > secondCount && topCount > skipCount) {
      ejected = room.players.get(topTarget) || null;
    }
  }

  if (ejected && ejected.alive && !ejected.ejected) {
    recordBotMatchElimination(room, ejected, null);
    ejected.alive = false;
    ejected.ejected = true;
    ejected.killCamera = null;
    ejected.inVent = false;
    ejected.ventId = "";
    clearAttackState(ejected);
    completeTasksAfterDeath(room, ejected);
    const roleText = room.settings.confirmEjects
      ? `${ejected.name} は ${ejected.role === "attacker" ? "アタッカー" : "ディフェンダー"}でした。`
      : `${ejected.name} は追放されました。`;
    pushEvent(room, roleText);
  } else {
    pushEvent(room, alive.length ? "投票はスキップまたは同票でした。" : "会議は終了しました。");
  }

  room.bodies = [];
  if (room.phase === "ended") return;
  room.phase = "playing";
  room.round += 1;
  room.meeting = null;
  room.sabotage = null;
  const timestamp = now();
  room.battleStartedAt = timestamp;
  for (const player of room.players.values()) {
    player.killsThisRound = 0;
  }
  pushEvent(room, `ラウンド ${room.round} 開始。`);
  checkWin(room);
  touch(room);
}

function maybeEndMeeting(room) {
  if (room.phase !== "meeting" || !room.meeting) return;
  const alive = [...room.players.values()].filter((player) => player.alive && !player.ejected);
  const voted = alive.filter((player) => room.meeting.votes[player.id]).length;
  if (now() >= room.meeting.endsAt || voted >= alive.length) {
    tallyMeeting(room);
  }
}

function clearSabotage(room, text = "サボタージュを修理しました。") {
  if (!room.sabotage) return;
  pushEvent(room, text);
  room.sabotage = null;
  touch(room);
}

function tickRoom(room) {
  const timestamp = now();
  const elapsedMs = Math.min(250, Math.max(0, timestamp - (Number(room.lastTickAt) || timestamp)));
  room.lastTickAt = timestamp;
  if (room.phase === "meeting") {
    pauseBattleTimeForMeeting(room, timestamp);
    for (const player of room.players.values()) {
      syncFighterInfiniteResources(player);
      syncHackerRootState(room, player);
      player.vx = 0;
      player.vy = 0;
    }
    maybeEndMeeting(room);
    return;
  }
  synchronizeTimeKeeperStops(room, timestamp);
  const roomTimeStopped = freezeRoomTimeKeeperState(room, elapsedMs, timestamp);
  if (!roomTimeStopped) advanceGravitySystems(room, timestamp, elapsedMs);
  advanceThrownItems(room, timestamp, elapsedMs);
  if (!roomTimeStopped) advanceHazards(room, timestamp);
  for (const player of room.players.values()) {
    syncFighterInfiniteResources(player);
    syncHackerRootState(room, player);
    advanceAccelerationTime(room, player, elapsedMs, timestamp);
    freezePlayerTimeKeeperState(player, elapsedMs, timestamp);
    if (timeKeeperStops(player, timestamp)) {
      player.vx = 0;
      player.vy = 0;
      player.movementMode = "time-stopped";
      if (player.drone) {
        player.drone.vx = 0;
        player.drone.vy = 0;
        player.drone.movementMode = "time-stopped";
      }
      continue;
    }
    advanceFighterEnergyPassive(room, player, timestamp);
    if (synchronizeSharedLevitationExpiry(room, player, timestamp)) continue;
    advanceLevitationMana(room, player, elapsedMs);
    if (synchronizeSharedLevitationExpiry(room, player, timestamp)) continue;
    advanceClairvoyanceMana(room, player, elapsedMs);
    advanceLimitBreak(room, player, elapsedMs);
    advanceHackerManaGpu(room, player, elapsedMs, timestamp);
    finishRenki(room, player, timestamp);
    advanceParticleCannon(room, player, timestamp);
    resolveSmartphoneAction(room, player, timestamp);
    advanceGunnerReload(room, player, timestamp);
    advanceGunnerSpecialAmmoPassive(room, player, timestamp);
    advanceGunnerAimPassive(room, player, timestamp);
    advanceGunnerFire(room, player, timestamp);
    if (player.attackResolveAt && player.attackResolveAt <= timestamp) clearPendingAttack(player);
    if (player.aimTargetId) {
      const aimTarget = room.players.get(player.aimTargetId);
      if (room.phase !== "playing" || !aimTarget || !aimTarget.alive || aimTarget.ejected) {
        clearAimState(player);
      } else if (aimedTargetMoved(player, aimTarget)) {
        failAimForMovement(room, player, timestamp);
      } else if (player.aimReadyAt && player.aimReadyAt <= timestamp) {
        resolveReadyAim(room, player, timestamp);
      }
    }
    if (player.resting) {
      if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent) {
        player.resting = false;
        player.sleepingUntil = 0;
      } else if (Number(player.stamina) < staminaCapacityFor(player) - 0.01) {
        player.sleepingUntil = Math.max(Number(player.sleepingUntil) || 0, timestamp + 250);
      }
    }
    const idleThreshold = player.isBot ? BOT_TICK_MS + 150 : 120;
    const blockedUntil = actionBlockedUntil(player);
    const movementInputExpired = timestamp - player.lastMoveAt > idleThreshold;
    if (blockedUntil > timestamp || movementInputExpired) {
      player.vx = 0;
      player.vy = 0;
      player.movementMode = player.ascensionUntil > timestamp
        ? "ascension"
        : player.meditatingUntil > timestamp
          ? "meditating"
        : player.sleepingUntil > timestamp
          ? "sleep"
          : player.unconsciousUntil > timestamp
            ? "unconscious"
            : "idle";
      if (movementInputExpired && Math.hypot(Number(player.lastMovementDx) || 0, Number(player.lastMovementDy) || 0) > 0.0001) {
        clearStoredMovementInput(player, timestamp);
      }
    }
    const stopped = Math.hypot(Number(player.vx) || 0, Number(player.vy) || 0) <= 0.01;
    advanceAutomaticManaToStamina(room, player, elapsedMs, timestamp);
    replenishStamina(
      player,
      timestamp,
      stopped,
      (player.resting ? SLEEP_REGEN_MULTIPLIER : 1) * floraAromaMultiplier(room, player),
      room,
      !player.resting
    );
    advanceNaturalRecoveryHealth(room, player, elapsedMs);
    if (player.resting && Number(player.stamina) >= staminaCapacityFor(player) - 0.01) {
      player.stamina = staminaCapacityFor(player);
      player.staminaManaOverflow = 0;
      player.resting = false;
      player.sleepingUntil = 0;
      player.movementMode = "idle";
      pushMagicEffect(room, "action-rest", player, { radius: 105, playerId: player.id, variant: "complete" });
      pushEvent(room, `${player.name} の休息が完了し、スタミナが上限まで回復しました。`);
    }
    advanceIdeaProgress(room, player, timestamp);
    const hackerBot = player.isBot && isHackerOperator(player);
    if (!hackerBot && !autoCompleteHackerTask(room, player, timestamp)) {
      autoCompleteNearbyTask(room, player);
    }
    autoUseNearbyMapObject(room, player, timestamp);
    if (room.phase === "playing" && player.alive && !player.ejected) {
      const creditAnchor = Number(player.lastPassiveCreditAt) || timestamp;
      const creditTicks = Math.floor((timestamp - creditAnchor) / PASSIVE_CREDIT_INTERVAL_MS);
      if (creditTicks > 0) {
        grantCredits(room, player, creditTicks * PASSIVE_CREDIT_REWARD, "passive");
        player.lastPassiveCreditAt = creditAnchor + creditTicks * PASSIVE_CREDIT_INTERVAL_MS;
      }
    } else {
      player.lastPassiveCreditAt = timestamp;
    }
    if (player.drone?.active && timestamp - player.lastMoveAt > idleThreshold) {
      player.drone.vx = 0;
      player.drone.vy = 0;
      player.drone.movementMode = "idle";
    }
  }
  if (runAutomaticHumanBodyReports(room, timestamp)) return;
  if (!roomTimeStopped) {
    advancePairRouteRule(room, timestamp);
    advanceAlchemyObjects(room, timestamp);
    resolvePendingEmps(room, timestamp);
  }
  if (room.sabotage?.type === "lights") {
    room.sabotage = null;
    touch(room);
  }
  if (room.phase === "selecting") {
    const turnPlayer = currentOperatorPlayer(room);
    if (!turnPlayer) {
      startBattle(room);
    } else if (room.operatorSelectEndsAt && now() >= room.operatorSelectEndsAt) {
      autoPickOperator(room, turnPlayer);
      pushEvent(room, `${turnPlayer.name} は時間切れのため自動選択されました。`);
      room.operatorTurnIndex += 1;
      advanceOperatorTurn(room);
    }
  }
  if (room.phase === "playing") {
    if (evaluateSoloMission(room, timestamp)) return;
    if (room.pendingIdeaVictoryAt && timestamp >= room.pendingIdeaVictoryAt) {
      const ideaWinners = ideaWinnerIdsFor(room)
        .map((id) => room.players.get(id))
        .filter(Boolean);
      if (!ideaWinners.length) {
        room.pendingIdeaVictoryAt = 0;
        setIdeaWinnerIds(room, []);
        return;
      }
      const winnerNames = ideaWinners.map((player) => player.name).join("、");
      finish(room, "idea", `${winnerNames} が善のイデアへ到達しました。`, {
        type: "idea",
        sourceId: ideaWinners[0].id,
        sourceIds: ideaWinners.map((player) => player.id)
      });
      return;
    }
    if (room.sabotage?.endsAt && now() >= room.sabotage.endsAt) {
      const type = room.sabotage.type;
      if (type === "reactor" || type === "oxygen") {
        if (botMatchHumanOwnsCriticalSabotage(room)) {
          finish(room, "attackers", `${type === "reactor" ? "Core Breach" : "Atmos Leak"}の修復に失敗しました。`, {
            type: "criticalSabotage",
            sourceId: room.sabotage?.sourceId || ""
          });
        } else {
          room.sabotage = null;
        }
      } else {
        room.sabotage = null;
      }
    }
    for (const [doorId, closedUntil] of Object.entries(room.doorState)) {
      if (closedUntil <= now()) delete room.doorState[doorId];
    }
    checkWin(room);
  }
  maybeEndMeeting(room);
}

function completeTask(room, player, taskId) {
  if (room.phase !== "playing") throw new ApiError(400, "いまはタスクを実行できません。");
  if (player.role !== "defender") throw new ApiError(403, "アタッカーはタスクを完了できません。");
  if (player.ejected) throw new ApiError(403, "追放後はタスクを実行できません。");
  ensureConscious(player);
  if (!isHackerOperator(player) && Math.hypot(Number(player.vx) || 0, Number(player.vy) || 0) > 0.01) {
    throw new ApiError(400, "停止している間だけタスクを実行できます。");
  }
  const timestamp = now();
  const staminaCost = taskStaminaCostFor(player);
  replenishStamina(player, timestamp, true);
  if (availableStamina(player) < staminaCost) {
    throw new ApiError(400, `タスクの自動実行にはスタミナ ${staminaCost} が必要です。`);
  }
  if ((Number(player.taskAutoReadyAt) || 0) > timestamp) {
    throw new ApiError(400, "端末処理中です。");
  }

  const map = getMap(room);
  const range = map.taskRange;
  let task = player.taskList.find((item) => item.id === taskId && !item.done);
  if (!task && taskId === "nearest") {
    task = player.taskList.find((item) => {
      if (item.done) return false;
      const station = findStation(map, item.stationId);
      return station && distance(player, station) <= range;
    });
  }
  if (!task) throw new ApiError(404, "近くに未完了タスクがありません。");

  const station = findStation(map, task.stationId);
  if (!station || distance(player, station) > range) throw new ApiError(400, "タスク端末に近づいてください。");
  if (task.type === "upload") {
    const completedDownloads = player.taskList.filter((item) => item.type === "download" && item.done).length;
    const completedUploads = player.taskList.filter((item) => item.type === "upload" && item.done).length;
    if (completedDownloads <= completedUploads) {
      throw new ApiError(400, "このUploadの前にDownloadを1件完了してください。");
    }
  }
  spendStamina(player, staminaCost, room, "斬る");
  player.staminaUpdatedAt = timestamp;
  task.done = true;
  player.taskContribution += TASK_CONTRIBUTION;
  player.taskPresenceTaskId = "";
  player.taskPresenceSince = 0;
  player.taskAutoReadyAt = timestamp + AUTO_TASK_INTERVAL_MS;
  grantCredits(room, player, TASK_CREDIT_REWARD, "task");
  pushMagicEffect(room, "action-task", player, { radius: 105, playerId: player.id });
  pushEvent(room, `${player.name} が ${task.label} を完了し、${TASK_CREDIT_REWARD}Cを獲得しました。`);
  markSoloMissionAction(room, player, "task");
  checkWin(room);
  touch(room);
}

function autoCompleteNearbyTask(room, player) {
  if (room.phase !== "playing" || player.role !== "defender" || !player.alive || player.ejected || player.inVent) {
    player.taskPresenceTaskId = "";
    player.taskPresenceSince = 0;
    return false;
  }
  if (player.isBot) {
    player.taskPresenceTaskId = "";
    player.taskPresenceSince = 0;
    return false;
  }
  if (
    !isHackerOperator(player) &&
    (
      Math.hypot(Number(player.vx) || 0, Number(player.vy) || 0) > 0.01 ||
      Math.hypot(Number(player.lastMovementDx) || 0, Number(player.lastMovementDy) || 0) > 0.01 ||
      ["walk", "slow", "dash", "jump", "jump-prepare"].includes(String(player.movementMode || ""))
    )
  ) {
    player.taskPresenceTaskId = "";
    player.taskPresenceSince = 0;
    return false;
  }
  const timestamp = now();
  const map = getMap(room);
  const task = player.taskList.find((item) => {
    if (item.done) return false;
    const station = findStation(map, item.stationId);
    if (!station || distance(player, station) > map.taskRange) return false;
    if (item.type !== "upload") return true;
    const downloads = player.taskList.filter((candidate) => candidate.type === "download" && candidate.done).length;
    const uploads = player.taskList.filter((candidate) => candidate.type === "upload" && candidate.done).length;
    return downloads > uploads;
  });
  if (!task) {
    player.taskPresenceTaskId = "";
    player.taskPresenceSince = 0;
    return false;
  }
  if (player.taskPresenceTaskId !== task.id) {
    player.taskPresenceTaskId = task.id;
    player.taskPresenceSince = timestamp;
    return false;
  }
  if (
    availableStamina(player) < taskStaminaCostFor(player) ||
    actionBlockedUntil(player) > timestamp ||
    (Number(player.taskAutoReadyAt) || 0) > timestamp
  ) return false;
  const requiredPresenceMs = AUTO_TASK_PRESENCE_MS / effectiveAccelerationMultiplier(room, player, timestamp);
  if (timestamp - (Number(player.taskPresenceSince) || timestamp) < requiredPresenceMs) return false;
  completeTask(room, player, task.id);
  return true;
}

function autoCompleteHackerTask(room, player, timestamp = now()) {
  if (
    room.phase !== "playing" ||
    player.isBot ||
    player.role !== "defender" ||
    !player.alive ||
    player.ejected ||
    !isHackerOperational(player)
  ) return false;
  if (!(Number(player.hackerTaskReadyAt) > 0)) {
    player.hackerTaskReadyAt = timestamp + HACKER_AUTO_TASK_INTERVAL_MS;
    return false;
  }
  if (timestamp < player.hackerTaskReadyAt) return false;
  const completedDownloads = player.taskList.filter((task) => task.type === "download" && task.done).length;
  const completedUploads = player.taskList.filter((task) => task.type === "upload" && task.done).length;
  const task = player.taskList.find((candidate) => (
    !candidate.done && (candidate.type !== "upload" || completedDownloads > completedUploads)
  ));
  if (!task) {
    player.hackerTaskReadyAt = 0;
    return false;
  }
  task.done = true;
  player.taskContribution += TASK_CONTRIBUTION;
  grantCredits(room, player, TASK_CREDIT_REWARD, "hacker-task");
  player.hackerTaskReadyAt = player.taskList.some((candidate) => !candidate.done)
    ? timestamp + HACKER_AUTO_TASK_INTERVAL_MS
    : 0;
  pushMagicEffect(room, "action-task", player, { radius: 105, playerId: player.id, variant: "hacker-auto" });
  pushEvent(room, `${player.name} のハックが ${task.label} を自動完了し、${TASK_CREDIT_REWARD}Cを獲得しました。`);
  markSoloMissionAction(room, player, "task");
  checkWin(room);
  touch(room);
  return true;
}

function canActivateDodge(player) {
  return player?.role === "defender" || hasOperatorAccess(player, "fighter");
}

function fighterKillCounterAvailable(player) {
  return hasOperatorAccess(player, "fighter") && passivesEnabled(player);
}

function fighterKillCounterTriggerIsCertainKill(hitZone, options = {}) {
  return hitZone === "head" || Boolean(options.destroy);
}

function hasOrichalcumSword(player) {
  return itemCount(player, "orichalcum-sword") > 0;
}

function activateDodge(room, player) {
  if (room.phase !== "playing") throw new ApiError(400, "バトル中のみ回避を発動できます。");
  if (!canActivateDodge(player)) throw new ApiError(403, "このオペレーターは回避を使用できません。");
  if (!player.alive || player.ejected || player.inVent) throw new ApiError(403, "現在は回避できません。");
  ensureAbilityAvailable(player);
  const timestamp = now();
  if (player.dodgeActiveUntil > timestamp) throw new ApiError(400, "回避は発動中です。");
  replenishStamina(player, timestamp, Math.hypot(Number(player.vx) || 0, Number(player.vy) || 0) <= 0.01);
  if (player.stamina < MAX_STAMINA - 0.01) {
    throw new ApiError(400, `回避にはスタミナ ${MAX_STAMINA} が必要です。`);
  }
  spendStamina(player, MAX_STAMINA, room, "回避");
  player.dodgeActiveUntil = timestamp + DODGE_DURATION_MS + player.dodgeDurationBonusMs;
  player.dodgeReadyAt = 0;
  pushMagicEffect(room, "action-dodge", player, { radius: 115, playerId: player.id });
  pushEvent(room, `${player.name} が回避態勢に入りました。`);
  markSoloMissionAction(room, player, "defense");
  touch(room);
}

function beginFighterSlashGuard(player, timestamp = now(), perfectGuardIntent = false, windowMultiplier = 1) {
  const multiplier = Math.max(1, Number(windowMultiplier) || 1);
  player.slashActiveUntil = Math.max(Number(player.slashActiveUntil) || 0, timestamp + FIGHTER_SLASH_GUARD_DURATION_MS * multiplier);
  if (!perfectGuardIntent) return false;
  // The client only marks a deliberate press as intent=true; held repeats are
  // intent=false. Treat every declared press as an edge so a delayed release
  // request cannot let rapid tapping evade the anti-fishing rearm penalty.
  player.slashGuardInputReleased = false;
  if (timestamp < (Number(player.slashPerfectReadyAt) || 0)) {
    // Repeated early presses move the rearm point forward. Holding never sends
    // another intent, while button mashing cannot keep fishing for a perfect
    // guard window without first pausing and reading the incoming attack.
    player.slashPerfectUntil = 0;
    player.slashPerfectReadyAt = timestamp + FIGHTER_SLASH_PERFECT_REARM_MS;
    return false;
  }
  player.slashPerfectUntil = timestamp + FIGHTER_SLASH_PERFECT_GUARD_MS * multiplier;
  player.slashPerfectReadyAt = timestamp + FIGHTER_SLASH_PERFECT_REARM_MS;
  return true;
}

function releaseFighterSlashGuardInput(player) {
  if (!player) return false;
  player.slashGuardInputReleased = true;
  return true;
}

function applyReflectedSlashAttack(room, defender, source, attack = {}, timestamp = now()) {
  if (!source?.alive || source.ejected || source.id === defender?.id) return false;
  try {
    if (typeof attack.reflectEffect === "function") {
      return attack.reflectEffect({ room, defender, source, attack, timestamp }) !== false;
    }
    const reflectedActionLabel = `反射された${requireExactKillCameraActionLabel(attack.label, attack.kind || "reflected-attack")}`;
    if (attack.destroy) {
      destroyPlayerUnconditionally(room, defender, source, reflectedActionLabel, {
        noKillCutin: false,
        attackKind: `reflected-${attack.kind || "destruction"}`,
        attackLabel: reflectedActionLabel,
        ignorePreparationBarrier: true,
        ignoreInfiniteResources: Boolean(attack.ignoreInfiniteResourcesOnReflect),
        ignoreFriendlyFire: true,
        bypassSlashGuard: true
      });
      return true;
    }
    killPlayer(room, defender, source.id, {
      ranged: true,
      hitZone: attack.hitZone === "head" ? "head" : "body",
      damage: clampNumber(attack.damage, 0.01, 2, 1),
      magic: Boolean(attack.magic),
      allowAnyKiller: true,
      ignoreRange: true,
      ignoreCooldown: true,
      preserveCooldown: true,
      ignorePush: true,
      ignoreFriendlyFire: true,
      bypassSlashGuard: true,
      origin: { x: defender.x, y: defender.y },
      targetRole: source.role,
      attackKind: `reflected-${attack.kind || "physical"}`,
      attackLabel: reflectedActionLabel,
      slashGuardPhysical: Boolean(attack.physical)
    });
    return true;
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    return false;
  }
}

function resolveFighterSlashGuard(room, source, target, attack = {}, timestamp = now()) {
  const detachedGboGuard = Number(target?.slashDetachedGuardUntil) > timestamp;
  if (!target?.alive || target.ejected || (!hasOrichalcumSword(target) && !detachedGboGuard)) return "";
  if ((Number(target.slashActiveUntil) || 0) <= timestamp) return "";
  const physical = Boolean(attack.physical);
  const perfect = attack.perfectGuardEligible !== false && (Number(target.slashPerfectUntil) || 0) > timestamp;
  const universalPerfect = perfect && hasFighterInfiniteResources(target);
  if (!physical && !universalPerfect) return "";

  if (perfect) target.slashPerfectUntil = 0;
  const label = String(attack.label || attack.kind || (physical ? "物理攻撃" : "攻撃"));
  const reflectionIntent = Boolean(perfect && (universalPerfect || attack.reflectable !== false));
  const reflectedAtSource = reflectionIntent && applyReflectedSlashAttack(room, target, source, attack, timestamp);
  // At charge 50 the successful edge is semantically a reflection even when
  // the originating entity has already vanished or cannot receive the return
  // effect. The incoming attack is still sent back instead of merely guarded.
  const reflected = Boolean(reflectionIntent && (reflectedAtSource || universalPerfect));
  const outcome = reflected
    ? "slashPerfectReflected"
    : perfect
      ? "slashPerfectGuarded"
      : "slashGuarded";
  pushMagicEffect(room, "fighter-slash-parry", target, {
    radius: universalPerfect ? 205 : perfect ? 180 : 155,
    playerId: target.id,
    targetId: source?.id || "",
    targetX: Number.isFinite(Number(source?.x)) ? Number(source.x) : target.x + (Number(target.aimX) || 1) * 180,
    targetY: Number.isFinite(Number(source?.y)) ? Number(source.y) : target.y + (Number(target.aimY) || 0) * 180,
    variant: universalPerfect ? `perfect-all-reflect:${attack.kind || "attack"}` : perfect ? `perfect-reflect:${attack.kind || "physical"}` : `guard:${attack.kind || "physical"}`
  });
  pushSound(room, "fighterCounter", target, { ownerId: target.id, sourceKind: "fighter", maxDistance: 1400, volume: perfect ? 1 : 0.72 });
  if (reflected) {
    setImmediateFeedback(target, "ジャストガード", `${label}を反射`);
    pushEvent(room, `${target.name} が${label}をジャストガードし、${source?.name || "攻撃元"}へ反射しました。`);
  } else if (universalPerfect) {
    setImmediateFeedback(target, "50回到達ジャストガード", `${label}を反射（攻撃元なし）`);
    pushEvent(room, `${target.name} がEC50回到達後のジャストガードで${label}を弾き返しました。反射可能な攻撃元はありませんでした。`);
  } else {
    setImmediateFeedback(target, perfect ? "ジャストガード" : "斬る・ガード", `${label}を無効化`);
    pushEvent(room, `${target.name} が斬るで${label}をガードしました。`);
  }
  touch(room);
  return outcome;
}

function fighterSlash(room, player, targetId = "", perfectGuardIntent = false, rawPower = 0) {
  if (room.phase !== "playing" || !hasOrichalcumSword(player)) {
    throw new ApiError(403, "オリハルコン・ソードを所持していないため斬るは使用できません。");
  }
  if (!player.alive || player.ejected || player.inVent) throw new ApiError(403, "現在は斬れません。");
  ensureAbilityAvailable(player);
  ensureItemStorageAvailable(player);
  ensureConscious(player);
  const timestamp = now();
  const cost = FIGHTER_SLASH_STAMINA_COST;
  if (Number(player.stamina) < cost) throw new ApiError(400, `斬るにはスタミナ ${cost} が必要です。`);
  spendStamina(player, cost, room, "踏ん張り");
  const power = rawPower && typeof rawPower === "object"
    ? rawPower
    : { mode: Number(rawPower) > 0 ? "enhance" : "normal", enhanceLevel: Number(rawPower) || 0, multiplier: 1 };
  const gbo = power.mode === "gbo";
  const enhanceLevel = gbo ? 0 : Math.min(ENHANCE_MAX_LEVEL, Math.max(0, Math.floor(Number(power.enhanceLevel) || 0)));
  const perfectGuardOpened = beginFighterSlashGuard(player, timestamp, perfectGuardIntent, gbo ? GBO_PERFORMANCE_MULTIPLIER : 1);
  player.slashActiveUntil += enhanceLevel * FIGHTER_ENHANCE_SLASH_GUARD_MS_PER_LEVEL;
  if (gbo) {
    player.slashDetachedGuardUntil = player.slashActiveUntil;
    consumeItem(player, "orichalcum-sword", 1);
    pushGboOverdriveEffect(room, player, "orichalcum-sword", "slash");
  }
  const slashAimX = Number(player.aimX) || 1;
  const slashAimY = Number(player.aimY) || 0;
  const slashRange = gbo
    ? room.settings.killRange * GBO_PERFORMANCE_MULTIPLIER
    : room.settings.killRange + enhanceLevel * FIGHTER_ENHANCE_SLASH_RANGE_PER_LEVEL;
  pushMagicEffect(room, "fighter-slash", player, {
    radius: gbo ? 240 : 160 + enhanceLevel * 18,
    playerId: player.id,
    targetX: player.x + slashAimX * (220 + enhanceLevel * FIGHTER_ENHANCE_SLASH_RANGE_PER_LEVEL),
    targetY: player.y + slashAimY * (220 + enhanceLevel * FIGHTER_ENHANCE_SLASH_RANGE_PER_LEVEL),
    variant: gbo ? "gbo-tenfold" : `enhance-${enhanceLevel}`
  });
  pushSound(room, "fighterSlash", player, { ownerId: player.id, sourceKind: "fighter", maxDistance: 1300, volume: 0.9 });
  const target = attackTargetFor(room, player, targetId);
  const struckIds = new Set();
  if (target && distance(player, target) <= slashRange) {
    struckIds.add(target.id);
    const destructionSlash = hasFighterInfiniteResources(player);
    const destructionGuardOutcome = destructionSlash
      ? resolveFighterSlashGuard(room, player, target, {
          kind: "slash",
          label: "EC50回到達後の消滅斬り",
          physical: true,
          reflectable: true,
          destroy: true,
          ignoreInfiniteResourcesOnReflect: true
        }, timestamp)
      : "";
    const outcome = destructionSlash
      ? destructionGuardOutcome || (destroyPlayerUnconditionally(room, player, target, "EC50回到達後の消滅斬り", {
          noKillCutin: false,
          noBody: true,
          ignorePreparationBarrier: true,
          ignoreInfiniteResources: true,
          bypassSlashGuard: true
        }) ? "destroyed" : "friendlyFirePenalty")
      : killPlayer(room, player, target.id, {
          hitZone: "head",
          lockedAim: true,
          ignoreCooldown: true,
          preserveCooldown: true,
          ignoreDodge: false,
          targetRole: target.role,
          attackKind: "slash",
          attackLabel: "斬る",
          slashGuardPhysical: true
        });
    if (destructionSlash) pushMagicEffect(room, "fighter-energy-destruction-slash", player, {
      radius: 175,
      playerId: player.id,
      targetId: target.id,
      targetX: target.x,
      targetY: target.y,
      variant: outcome
    });
    pushEvent(room, `${player.name} の${gbo ? "GBO斬り" : enhanceLevel ? `ため斬りLv${enhanceLevel}` : "斬る"}が ${target.name} に命中しました（${outcome} / 射程${slashRange}${gbo ? " / オリハルコン・ソード破壊" : ""}）。`);
  } else {
    const universalReflect = hasFighterInfiniteResources(player);
    pushEvent(room, `${player.name} が斬るを構えました。物理攻撃をガードし、${perfectGuardOpened ? `短いジャストガード受付で${universalReflect ? "全攻撃" : "物理攻撃"}を反射できます` : "今回はジャストガード再受付前です"}。`);
  }
  // The sword owns only this physical slash/guard.  EC and every wave are
  // Fighter abilities; a Fighter may use this slash as their trigger.
  const requestedShockwaveCost = hasOperatorAccess(player, "fighter")
    ? fighterSlashShockwaveCost(player)
    : 0;
  const consumedShockwaveCost = player.alive
    ? consumeFighterEnergyCharge(
        player,
        requestedShockwaveCost,
        requestedShockwaveCost === FIGHTER_GIANT_SHOCKWAVE_EC_COST ? "ファイター特大衝撃波" : "ファイター衝撃波"
      )
    : 0;
  if (consumedShockwaveCost > 0) {
    const giantShockwave = consumedShockwaveCost === FIGHTER_GIANT_SHOCKWAVE_EC_COST;
    const shockwaveRange = giantShockwave ? FIGHTER_GIANT_SHOCKWAVE_RANGE : FIGHTER_SHOCKWAVE_RANGE;
    const shockwaveWidth = giantShockwave ? FIGHTER_GIANT_SHOCKWAVE_WIDTH : FIGHTER_SHOCKWAVE_WIDTH;
    const swordOrigin = {
      ...player,
      x: player.x + slashAimX * FIGHTER_SHOCKWAVE_ORIGIN_OFFSET,
      y: player.y + slashAimY * FIGHTER_SHOCKWAVE_ORIGIN_OFFSET
    };
    const targetX = swordOrigin.x + slashAimX * shockwaveRange;
    const targetY = swordOrigin.y + slashAimY * shockwaveRange;
    pushMagicEffect(room, "fighter-shockwave", swordOrigin, {
      radius: shockwaveWidth,
      playerId: player.id,
      targetX,
      targetY,
      durationMs: giantShockwave ? FIGHTER_GIANT_SHOCKWAVE_DURATION_MS : 760,
      variant: `${giantShockwave ? "giant-" : ""}one-body-damage:ec-cost-${consumedShockwaveCost}:remaining-ec-${player.fighterEnergyCharge}`
    });
    const waveTargets = inventionLineTargets(room, swordOrigin, shockwaveRange, shockwaveWidth, false)
      .filter(({ target: waveTarget }) => !struckIds.has(waveTarget.id));
    for (const { target: waveTarget } of waveTargets) {
      if (!player.alive || player.ejected) break;
      try {
        const outcome = killPlayer(room, player, waveTarget.id, {
          ranged: true,
          hitZone: "body",
          damage: 1,
          ignoreRange: true,
          ignoreCooldown: true,
          preserveCooldown: true,
          magic: true,
          attackKind: "fighter-energy-shockwave",
          attackLabel: giantShockwave ? "ファイター特大衝撃波" : "ファイター衝撃波",
          slashGuardPhysical: true,
          slashGuardReflectable: false,
          slashGuardPerfectEligible: false,
          targetRole: waveTarget.role
        });
        pushEvent(room, `${player.name} の${giantShockwave ? "ファイター特大衝撃波" : "ファイター衝撃波"}が ${waveTarget.name} に命中しました（${outcome}）。`);
      } catch (error) {
        if (!(error instanceof ApiError)) throw error;
      }
    }
  }
  checkWin(room);
  touch(room);
}

function startRest(room, player) {
  if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "現在は休息できません。");
  }
  ensureConscious(player);
  const timestamp = now();
  replenishStamina(player, timestamp, Math.hypot(Number(player.vx) || 0, Number(player.vy) || 0) <= 0.01);
  const capacity = staminaCapacityFor(player);
  if (player.stamina >= capacity - 0.01) throw new ApiError(400, "スタミナは既に最大です。");
  const missingStamina = capacity - player.stamina;
  const sleepDurationMs = Math.max(
    100,
    Math.ceil(missingStamina / (STAMINA_REGEN_PER_SECOND * SLEEP_REGEN_MULTIPLIER) * 1000)
  );
  player.resting = true;
  player.sleepingUntil = timestamp + sleepDurationMs;
  player.vx = 0;
  player.vy = 0;
  player.movementMode = "sleep";
  player.lastMoveAt = timestamp;
  player.drone.active = false;
  clearAttackState(player);
  pushMagicEffect(room, "action-rest", player, { radius: 105, playerId: player.id });
  pushEvent(room, `${player.name} が休息に入りました。スタミナが上限へ達するまで行動できません。`);
  touch(room);
}

function resolveExpandedMapTeleportDestination(room, rawX, rawY) {
  const x = Number(rawX);
  const y = Number(rawY);
  const map = getMap(room);
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    throw new ApiError(400, "テレポート先が不正です。");
  }
  if (!isWalkable(room, x, y, map.playerRadius)) {
    throw new ApiError(400, "通行可能な場所を指定してください。");
  }
  return { x, y };
}

function moveByExpandedMapTeleport(target, destination, timestamp = now()) {
  const origin = { x: target.x, y: target.y };
  clearStoredMovementInput(target, timestamp);
  target.x = destination.x;
  target.y = destination.y;
  target.vx = 0;
  target.vy = 0;
  target.lastMoveAt = timestamp;
  target.navPath = [];
  if (Math.hypot(target.x - destination.x, target.y - destination.y) > 0.001) {
    throw new ApiError(500, "テレポート先への移動を確定できませんでした。");
  }
  return origin;
}

function teleportPlayer(room, player, rawX, rawY, targetId = "", mode = "body") {
  if (room.phase !== "playing") throw new ApiError(400, "バトル中のみテレポートできます。");
  if (!hasOperatorAccess(player, "gravity")) {
    throw new ApiError(403, "テレポート役職ではありません。");
  }
  if (!player.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "現在はテレポートできません。");
  }
  ensureAbilityAvailable(player);
  mode = String(mode || "body");
  if (!["body", "near", "heart", "target"].includes(mode)) {
    throw new ApiError(400, "テレポート方式が不正です。");
  }
  const timestamp = now();
  const selectedTarget = targetId ? room.players.get(String(targetId)) : player;
  const target = mode === "body" ? player : selectedTarget;
  if (!target || !target.alive || target.ejected || target.inVent) {
    throw new ApiError(404, "テレポート対象がいません。");
  }
  if (mode === "heart") {
    if (target.id === player.id) throw new ApiError(400, "自分の心臓は対象にできません。");
    spendMana(room, player, HEART_TELEPORT_MANA_COST, "心臓転移");
    // The fist glow belongs to the caster and is private so this remote action
    // never discloses the caster's position to the target or other players.
    pushMagicEffect(room, "action-heart-teleport", player, {
      radius: 64,
      playerId: player.id,
      targetId: target.id,
      targetX: target.x,
      targetY: target.y,
      variant: target.role,
      viewerId: player.id
    });
    setImmediateFeedback(player, "心臓転移", `10MP / ${target.name}`);
    const eliminated = eliminatePlayerWithEmp(room, player, target, timestamp, "心臓転移");
    if (eliminated) pushEvent(room, `${player.name} が ${target.name} の心臓へ遠隔テレポートを適用しました。`);
    player.teleportReadyAt = 0;
    checkWin(room);
    touch(room);
    return;
  }
  if (
    mode === "target" &&
    target.id !== player.id &&
    target.role === player.role &&
    ["defender", "attacker"].includes(player.role)
  ) {
    applyDefenderFriendlyFirePenalty(room, player, target, timestamp, { ignorePreparationBarrier: true });
    pushEvent(room, `${player.name} の対象転移は味方への誤射として反射されました。${target.name} は移動しません。`);
    checkWin(room);
    touch(room);
    return;
  }
  let x = Number(rawX);
  let y = Number(rawY);
  let movingTarget = target;
  if (mode === "near") {
    if (target.id === player.id) throw new ApiError(400, "対象付近転移では自分以外を選択してください。");
    movingTarget = player;
    const map = getMap(room);
    const baseAngle = Math.atan2(player.y - target.y, player.x - target.x) || 0;
    const candidates = [];
    for (const radius of [36, 48, 64, 80, 96, 112, 132, 156, 180]) {
      for (let step = 0; step < 24; step += 1) {
        const angle = baseAngle + step * Math.PI / 12;
        candidates.push({ x: target.x + Math.cos(angle) * radius, y: target.y + Math.sin(angle) * radius });
      }
    }
    const destination = candidates.find((point) => isWalkable(room, point.x, point.y, map.playerRadius)) ||
      (isWalkable(room, target.x, target.y, map.playerRadius) ? { x: target.x, y: target.y } : null);
    if (!destination) throw new ApiError(400, "対象付近に安全な転移地点がありません。");
    x = destination.x;
    y = destination.y;
  }
  const destination = resolveExpandedMapTeleportDestination(room, x, y);

  const teleportLabel = mode === "near" ? "対象付近転移" : mode === "target" ? "対象転移" : "地点転移";
  spendOperatorMana(room, player, teleportLabel);
  const origin = moveByExpandedMapTeleport(movingTarget, destination, timestamp);
  player.teleportReadyAt = 0;
  awardAbilityContribution(player, 0.5);
  pushMagicEffect(room, "action-teleport", origin, { radius: 135, playerId: player.id, targetX: destination.x, targetY: destination.y });
  pushMagicEffect(room, "action-teleport", movingTarget, { radius: 135, playerId: movingTarget.id, variant: "arrival" });
  pushEvent(room, mode === "near"
    ? `${player.name} が ${target.name} の近くへ転移しました。`
    : mode === "target"
      ? `${player.name} が ${movingTarget.name} を指定地点へ対象転移させました。`
      : movingTarget.id === player.id
        ? `${player.name} が転移しました。`
        : `${player.name} が ${movingTarget.name} を転移させました。`);
  touch(room);
}

function gravityTimeScaleFor(room, target, timestamp = now()) {
  if (hasNaturalRecovery(room, target)) return 1;
  if (timeKeeperStops(target, timestamp)) return 0;
  const controllers = [...room.players.values()].filter((player) => (
    hasOperatorAccess(player, "gravity") && player.gravityTimeMode && player.gravityTimeTargetId === target.id &&
    Number(player.gravityTimeEndsAt) > timestamp && player.alive && !player.ejected
  ));
  if (controllers.some((player) => player.gravityTimeMode === "decelerate")) return GRAVITY_TIME_SCALE_SLOW;
  return 1;
}

function useTimeKeeper(room, player) {
  if (room.phase !== "playing" || !hasOperatorAccess(player, "gravity") || !player.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "現在は時の番人を使用できません。");
  }
  ensureAbilityAvailable(player);
  spendOperatorMana(room, player, "時の番人", GRAVITY_TIME_KEEPER_MANA_COST);
  const startedAt = now();
  const endsAt = startedAt + GRAVITY_TIME_KEEPER_DURATION_MS;
  player.timeKeeperEndsAt = Math.max(Number(player.timeKeeperEndsAt) || 0, endsAt);
  let stoppedCount = 0;
  for (const target of room.players.values()) {
    if (target.id === player.id || !target.alive || target.ejected) continue;
    if (rejectAdverseStatusDuringNaturalRecovery(room, target, "時の番人", startedAt)) continue;
    target.timeStoppedUntil = Math.max(Number(target.timeStoppedUntil) || 0, endsAt);
    target.vx = 0;
    target.vy = 0;
    target.movementMode = "time-stopped";
    if (target.drone) {
      target.drone.vx = 0;
      target.drone.vy = 0;
      target.drone.movementMode = "time-stopped";
    }
    stoppedCount += 1;
  }
  pushMagicEffect(room, "gravity-time-keeper", player, {
    radius: 155,
    playerId: player.id,
    durationMs: GRAVITY_TIME_KEEPER_DURATION_MS,
    variant: "total-stop"
  });
  awardAbilityContribution(player, 1);
  pushEvent(room, `${player.name} が時の番人を発動し、術者以外の全てを${GRAVITY_TIME_KEEPER_DURATION_MS / 1000}秒間停止しました（${stoppedCount}人 / マナ${GRAVITY_TIME_KEEPER_MANA_COST}）。`);
  touch(room);
}

function toggleGravityTime(room, player, mode, targetId) {
  if (room.phase !== "playing" || !hasOperatorAccess(player, "gravity") || !player.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "現在は時空加減速を使用できません。");
  }
  ensureAbilityAvailable(player);
  const selectedMode = mode === "decelerate" ? "decelerate" : "accelerate";
  const target = room.players.get(String(targetId || player.id));
  if (!target || !target.alive || target.ejected) throw new ApiError(404, "時空操作対象がいません。");
  if (
    selectedMode === "decelerate" &&
    target.id !== player.id &&
    target.role === player.role &&
    ["defender", "attacker"].includes(player.role)
  ) {
    applyDefenderFriendlyFirePenalty(room, player, target, now(), { ignorePreparationBarrier: true });
    pushEvent(room, `${player.name} のディーセラレートは味方への誤射として反射されました。${target.name} は減速しません。`);
    checkWin(room);
    touch(room);
    return;
  }
  spendOperatorMana(room, player, selectedMode === "accelerate" ? "アクセラレート" : "ディーセラレート");
  const timestamp = now();
  if (selectedMode === "decelerate" && rejectAdverseStatusDuringNaturalRecovery(room, target, "ディーセラレート", timestamp)) {
    pushMagicEffect(room, "gravity-decelerate", target, {
      radius: 150,
      playerId: player.id,
      targetId: target.id,
      durationMs: 900,
      variant: "rational-natural-recovery-immune"
    });
    pushEvent(room, `${player.name} のディーセラレートを ${target.name} が理知の自然回復で無効化しました。`);
    touch(room);
    return;
  }
  player.gravityTimeMode = selectedMode;
  player.gravityTimeTargetId = target.id;
  player.gravityTimeEndsAt = timestamp + GRAVITY_TIME_DURATION_MS;
  if (selectedMode === "accelerate") {
    addTimedAcceleration(target, "gravity-accelerate", GRAVITY_TIME_SCALE_FAST, GRAVITY_TIME_DURATION_MS, timestamp);
  }
  pushMagicEffect(room, `gravity-${selectedMode}`, target, {
    radius: 150,
    playerId: player.id,
    targetId: target.id,
    durationMs: GRAVITY_TIME_DURATION_MS
  });
  pushEvent(room, `${player.name} が ${target.name} へ${selectedMode === "accelerate" ? "アクセラレート" : "ディーセラレート"}を8秒間付与しました。`);
  touch(room);
}

function useGravityStorm(room, player, targetId = "") {
  if (room.phase !== "playing" || !hasOperatorAccess(player, "gravity") || !player.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "現在はグラビティストームを使用できません。");
  }
  ensureAbilityAvailable(player);
  spendOperatorMana(room, player, "グラビティストーム", GRAVITY_STORM_MANA_COST);
  const requestedTargetId = String(targetId || player.id);
  const target = room.players.get(requestedTargetId);
  if (!target || !target.alive || target.ejected || target.inVent) {
    throw new ApiError(404, "グラビティストームの対象がいません。");
  }
  const startedAt = now();
  const endsAt = startedAt + GRAVITY_STORM_DURATION_MS;
  const zone = {
    id: uid("gravity_"), ownerId: player.id,
    targetId: target.id,
    x: clampNumber(target.x, 0, getMap(room).width, target.x),
    y: clampNumber(target.y, 0, getMap(room).height, target.y),
    radius: GRAVITY_STORM_VISUAL_RADIUS,
    barrierRadius: GRAVITY_STORM_BARRIER_RADIUS,
    safeX: player.x,
    safeY: player.y,
    startedAt,
    barrierUntil: endsAt - GRAVITY_STORM_BARRIER_RELEASE_MS,
    endsAt,
    lastPulseAt: 0
  };
  room.gravityZones ||= [];
  room.gravityZones.push(zone);
  pushMagicEffect(room, "gravity-storm", zone, { radius: zone.radius, playerId: player.id, variant: "debris-dent" });
  pushSound(room, "gravityStorm", zone, { ownerId: player.id, sourceKind: "magic", maxDistance: 2600, volume: 1 });
  awardAbilityContribution(player, 1);
  pushEvent(room, `${player.name} が ${target.name} の位置へグラビティストームを展開しました。全域の敵を吸引し、最後の1秒だけ発動者のバリアが消失します。`);
  touch(room);
}

function displaceByGravity(room, target, rawDx, rawDy, amount) {
  const map = getMap(room);
  const length = Math.hypot(rawDx, rawDy) || 1;
  const dx = rawDx / length;
  const dy = rawDy / length;
  const stepSize = 18;
  let remaining = Math.max(0, amount);
  while (remaining > 0) {
    const step = Math.min(stepSize, remaining);
    const nx = clampNumber(target.x + dx * step, map.playerRadius, map.width - map.playerRadius, target.x);
    const ny = clampNumber(target.y + dy * step, map.playerRadius, map.height - map.playerRadius, target.y);
    if (!isWalkable(room, nx, ny, map.playerRadius)) break;
    target.x = nx;
    target.y = ny;
    remaining -= step;
  }
}

function advanceGravitySystems(room, timestamp, elapsedMs) {
  for (const controller of room.players.values()) {
    if (!controller.gravityTimeMode) continue;
    const target = room.players.get(controller.gravityTimeTargetId);
    if (!target?.alive || target.ejected || !controller.alive || controller.ejected || timestamp >= Number(controller.gravityTimeEndsAt || 0)) {
      controller.gravityTimeMode = "";
      controller.gravityTimeTargetId = "";
      controller.gravityTimeEndsAt = 0;
      continue;
    }
  }
  room.gravityZones = (room.gravityZones || []).filter((zone) => zone.endsAt > timestamp);
  for (const zone of room.gravityZones) {
    const owner = room.players.get(zone.ownerId);
    if (owner?.alive && !owner.ejected) {
      zone.safeX = owner.x;
      zone.safeY = owner.y;
    }
    if (timestamp - zone.lastPulseAt < GRAVITY_STORM_PULSE_MS) continue;
    zone.lastPulseAt = timestamp;
    if (!owner) continue;
    const enemyRole = attackTargetRole(owner);
    for (const candidate of room.players.values()) {
      if (candidate.id === zone.ownerId) continue;
      if (!candidate.alive || candidate.ejected || candidate.inVent || candidate.role !== enemyRole) continue;
      const target = candidate;
      if (resolveFighterSlashGuard(room, owner || null, target, {
        kind: "gravity-storm",
        label: "グラビティストーム",
        physical: false,
        reflectable: false
      }, timestamp)) continue;
      if (absorbPreparationBarrier(room, target, timestamp, owner || null)) continue;

      const severity = luckAdjustedRoll(target);
      const luck = luckValueFor(target);
      const remainingMs = Math.max(0, Number(zone.endsAt) - timestamp);
      const finalSecond = remainingMs <= GRAVITY_STORM_BARRIER_RELEASE_MS;
      const damageMin = finalSecond ? GRAVITY_STORM_FINAL_DAMAGE_MIN : GRAVITY_STORM_DAMAGE_MIN;
      const damageMax = finalSecond ? GRAVITY_STORM_FINAL_DAMAGE_MAX : GRAVITY_STORM_DAMAGE_MAX;
      const luckDamageMultiplier = clampNumber(
        1 - Math.max(0, luck) * 0.65 + Math.max(0, -luck) * 0.35,
        0.35,
        1.35,
        1
      );
      const damage = Math.round((damageMin + (damageMax - damageMin) * severity) * luckDamageMultiplier * 100) / 100;
      const slowMultiplier = Math.round((GRAVITY_STORM_SLOW_MULTIPLIER_MAX -
        (GRAVITY_STORM_SLOW_MULTIPLIER_MAX - GRAVITY_STORM_SLOW_MULTIPLIER_MIN) * severity) * 100) / 100;

      const distanceToCore = Math.hypot(zone.x - target.x, zone.y - target.y);
      const pullAmount = GRAVITY_STORM_PULL_MIN +
        (GRAVITY_STORM_PULL_MAX - GRAVITY_STORM_PULL_MIN) * severity +
        Math.min(160, distanceToCore * 0.12);
      displaceByGravity(room, target, zone.x - target.x, zone.y - target.y, pullAmount);

      const infiniteResources = hasFighterInfiniteResources(target);
      if (infiniteResources) syncFighterInfiniteResources(target);
      else target.bodyHits = Math.round((Number(target.bodyHits || 0) + damage) * 100) / 100;
      target.lastGravityStormDamage = damage;
      const statusImmune = rejectAdverseStatusDuringNaturalRecovery(room, target, "グラビティストーム減速・拘束", timestamp);
      if (!statusImmune) {
        const gravitySlowWasActive = Number(target.gravityStormSlowUntil) > timestamp;
        target.gravityStormSlowUntil = Math.max(Number(target.gravityStormSlowUntil) || 0, timestamp + GRAVITY_STORM_SLOW_LINGER_MS);
        target.gravityStormSlowMultiplier = gravitySlowWasActive
          ? Math.min(Number(target.gravityStormSlowMultiplier) || 1, slowMultiplier)
          : slowMultiplier;
      }
      setImmediateFeedback(
        target,
        finalSecond ? "グラビティストーム 最終1秒" : "グラビティストーム",
        `${infiniteResources ? "HP∞でダメージ無効" : `HP-${damage.toFixed(2)}`} / 全域吸引 / ${statusImmune ? "理知の自然回復で減速・拘束無効" : `移動速度${Math.round(slowMultiplier * 100)}%`}`
      );

      const lethalThreshold = 2;
      if (target.bodyHits >= lethalThreshold) {
        const destroyed = destroyPlayerUnconditionally(room, owner || null, target, "グラビティストーム");
        if (!destroyed && target.alive) target.bodyHits = Math.max(0, lethalThreshold - 0.01);
        if (destroyed) checkWin(room);
        continue;
      }

      const modeRoll = Math.random();
      if (modeRoll < 0.22 && !statusImmune) {
        const pinMs = Math.round(GRAVITY_STORM_PIN_MIN_MS + (GRAVITY_STORM_PIN_MAX_MS - GRAVITY_STORM_PIN_MIN_MS) * severity);
        target.gravityPinnedUntil = Math.max(target.gravityPinnedUntil || 0, timestamp + pinMs);
        target.vx = 0;
        target.vy = 0;
        pushMagicEffect(room, "gravity-storm-crush", target, { radius: 165, playerId: zone.ownerId, targetId: target.id, variant: `pull-pin:${pinMs}` });
      } else if (modeRoll < 0.48) {
        const extraPull = pullAmount * (0.28 + severity * 0.22);
        displaceByGravity(room, target, zone.x - target.x, zone.y - target.y, extraPull);
        pushMagicEffect(room, "gravity-storm-heavy", target, { radius: 155, playerId: zone.ownerId, targetId: target.id, variant: `inward:${Math.round(extraPull)}` });
      } else {
        pushMagicEffect(room, "gravity-storm-pull", target, {
          radius: 175,
          playerId: zone.ownerId,
          targetId: target.id,
          variant: `${finalSecond ? "final" : "sustain"}:${Math.round(pullAmount)}`
        });
      }
    }
  }
}

function destroyDrone(player, timestamp) {
  if (!player.drone) return false;
  const wasActive = player.drone.active;
  player.drone.active = false;
  player.drone.vx = 0;
  player.drone.vy = 0;
  player.drone.movementMode = "idle";
  player.drone.readyAt = 0;
  player.drone.destroyed = true;
  return wasActive;
}

function substitutionDestination(room, player, origin) {
  const map = getMap(room);
  const areas = [...map.rooms, ...map.corridors].filter((area) => area.w > 120 && area.h > 120);
  for (let attempt = 0; attempt < 48; attempt += 1) {
    const area = areas[Math.floor(Math.random() * areas.length)];
    if (!area) break;
    const margin = Math.min(70, area.w / 3, area.h / 3);
    const x = area.x + margin + Math.random() * Math.max(1, area.w - margin * 2);
    const y = area.y + margin + Math.random() * Math.max(1, area.h - margin * 2);
    if (distance(origin, { x, y }) >= 520 && isWalkable(room, x, y, map.playerRadius)) return { x, y };
  }
  const fallback = [...map.spawns]
    .filter((point) => isWalkable(room, point.x, point.y, map.playerRadius))
    .sort((a, b) => distance(b, origin) - distance(a, origin))[0];
  return fallback || { x: player.x, y: player.y };
}

function itemStorageAvailable(player, timestamp = now()) {
  return (Number(player?.itemDisabledUntil) || 0) <= timestamp;
}

function ensureItemStorageAvailable(player, timestamp = now()) {
  if (itemStorageAvailable(player, timestamp)) return;
  throw new ApiError(400, `EMPでストレージ遮断中です（残り${Math.ceil((player.itemDisabledUntil - timestamp) / 1000)}秒）。`);
}

function triggerSubstitution(room, player, reason, timestamp = now()) {
  if (hackerRootEligible(player) || hasLimitBreakDeathVulnerability(player) || player.substitutionCharges <= 0 || !passivesEnabled(player) || !itemStorageAvailable(player, timestamp)) return false;
  const origin = { x: player.x, y: player.y, id: player.id };
  const destination = substitutionDestination(room, player, origin);
  player.substitutionCharges -= 1;
  player.inVent = false;
  player.ventId = "";
  player.x = destination.x;
  player.y = destination.y;
  player.vx = 0;
  player.vy = 0;
  player.lastMoveAt = timestamp;
  player.navPath = [];
  pushMagicEffect(room, "substitution", origin, {
    targetX: destination.x,
    targetY: destination.y,
    playerId: player.id
  });
  pushSound(room, "substitution", origin, {
    ownerId: player.id,
    sourceKind: "magic",
    maxDistance: 1800,
    volume: 0.9
  });
  const reasonLabel = reason === "emp" ? "EMP" : "確殺";
  pushEvent(room, `${player.name} が変わり身の術で${reasonLabel}を無効化しました。`);
  touch(room);
  return true;
}

function eliminateLimitBreakerWithEmp(room, source, target, timestamp) {
  if (resolveFighterSlashGuard(room, source, target, {
    kind: "emp",
    label: "EMP確殺",
    physical: false,
    reflectable: false,
    destroy: true,
    reflectEffect: ({ defender, source: reflectedTarget }) => applyReflectedEmpAttack(room, defender, reflectedTarget, "lethal", timestamp)
  }, timestamp)) return false;
  if (hasFighterInfiniteResources(target)) {
    applyEmpDisruption(room, target, timestamp);
    syncFighterInfiniteResources(target);
    pushHitEffect(room, target, "body", false);
    pushEvent(room, `${target.name} はEC50回到達報酬により、リミットブレイク中のEMP確殺を無効化しました。`);
    return false;
  }
  recordBotMatchElimination(room, target, source);
  target.alive = false;
  recordKillCamera(room, target, source, {
    timestamp,
    actionLabel: "EMP確殺（リミットブレイク反応）",
    actionKind: "emp-limit-break-lethal",
    sourceLabel: "EMP"
  });
  target.gunnerSnipingActive = false;
  target.gunnerAimTargetId = "";
  target.bodyHits = 0;
  target.overheal = 0;
  target.limitBreakActive = false;
  target.limitBreakEndsAt = 0;
  target.limitBreakStacks = 0;
  target.inVent = false;
  target.ventId = "";
  target.drone.active = false;
  clearAttackState(target);
  transferKillCredits(room, source, target);
  source.totalKills += 1;
  awardAbilityContribution(source, 1);
  pushHitEffect(room, target, "body", true);
  room.bodies.push({
    id: uid("body_"),
    playerId: target.id,
    killerId: source.id,
    killerName: source.name,
    killerIsBot: source.isBot,
    killerSkinId: source.skinId || (source.isBot ? "operator" : "hood"),
    name: target.name,
    x: target.x,
    y: target.y,
    at: timestamp,
    empDefeat: true
  });
  applyDefenderFriendlyFirePenalty(room, source, target, timestamp);
  pushDoorLog(room, `${whichRoom(getMap(room), target)} でリミットブレイク反応消失`);
  return true;
}

function transferKillCredits(room, killer, target) {
  if (!killer || !target || killer.id === target.id) return 0;
  const amount = Math.max(0, Math.floor(Number(target.credits) || 0));
  if (amount <= 0) return 0;
  target.credits -= amount;
  grantCredits(room, killer, amount, "kill-transfer");
  pushEvent(room, `${killer.name} が ${target.name} の保有クレジット ${amount}Cを獲得しました。`);
  return amount;
}

function transferKillInventory(room, killer, target) {
  if (!killer || !target || killer.id === target.id || killer.role !== "attacker") return [];
  const transferred = [];
  const stackFields = ["warpCharges", "fireJutsuCharges", "substitutionCharges", "gritCharges", "reasonCharges", "iaiCharges", "truthCharges", "beautyCharges"];
  for (const field of stackFields) {
    const amount = Math.max(0, Math.floor(Number(target[field]) || 0));
    if (!amount) continue;
    killer[field] = Math.max(0, Number(killer[field]) || 0) + amount;
    target[field] = 0;
    transferred.push(`${field}:${amount}`);
  }
  for (const [itemId, amountValue] of Object.entries(target.itemInventory || {})) {
    const amount = Math.max(0, Math.floor(Number(amountValue) || 0));
    if (!amount || !ITEM_DEFINITIONS[itemId]) continue;
    addItem(killer, itemId, amount);
    delete target.itemInventory[itemId];
    if (itemId === "hsg") clearHsgPreparedOverdrive(target);
    transferred.push(`${ITEM_DEFINITIONS[itemId].label}:${amount}`);
  }
  if (Array.isArray(target.inventions) && target.inventions.length) {
    killer.inventions = [...new Set([...(killer.inventions || []), ...target.inventions])];
    transferred.push(`発明品:${target.inventions.length}`);
    target.inventions = [];
  }
  if (Array.isArray(target.heavyWeapons) && target.heavyWeapons.length) {
    killer.heavyWeapons = [...(killer.heavyWeapons || []), ...target.heavyWeapons];
    transferred.push(`重火器:${target.heavyWeapons.length}`);
    target.heavyWeapons = [];
  }
  if (Array.isArray(target.purchasedWeapons) && target.purchasedWeapons.length) {
    killer.purchasedWeapons = [...new Set([...(killer.purchasedWeapons || []), ...target.purchasedWeapons])];
    for (const weaponId of target.purchasedWeapons) {
      killer.gunnerAmmo[weaponId] = Math.max(
        Number(killer.gunnerAmmo?.[weaponId]) || 0,
        Number(target.gunnerAmmo?.[weaponId]) || 0
      );
    }
    transferred.push(`銃器:${target.purchasedWeapons.length}`);
    target.purchasedWeapons = [];
  }
  if (transferred.length) pushEvent(room, `${killer.name} が ${target.name} の所持品をすべて獲得しました。`);
  return transferred;
}

// Instant-item acquisition consumes the item into a player-bound effect or
// use count. No converted instant charge remains available for manual transfer.
const TRANSFERABLE_CHARGES = Object.freeze({});

function inventionLabel(invention) {
  const id = String(invention || "");
  return HACKER_INVENTION_LABELS[id] || id || "素敵な発明品";
}

function transferableItemsFor(player) {
  const entries = [];
  for (const [itemId, amount] of Object.entries(player.itemInventory || {})) {
    if (ITEM_DEFINITIONS[itemId] && Number(amount) > 0) {
      entries.push({
        id: itemId,
        label: ITEM_DEFINITIONS[itemId].label,
        amount: Math.floor(Number(amount)),
        asset: ITEM_DEFINITIONS[itemId].asset,
        kind: "item",
        throwable: ITEM_DEFINITIONS[itemId].throwable !== false,
        usable: ITEM_DEFINITIONS[itemId].usable !== false,
        reusable: Boolean(ITEM_DEFINITIONS[itemId].reusable)
      });
    }
  }
  for (const [itemId, definition] of Object.entries(TRANSFERABLE_CHARGES)) {
    const amount = Math.max(0, Math.floor(Number(player[definition.field]) || 0));
    if (amount > 0) entries.push({ id: itemId, label: definition.label, amount, asset: itemId, kind: "charge" });
  }
  for (const invention of player.inventions || []) {
    entries.push({ id: `invention:${invention}`, label: inventionLabel(invention), amount: 1, asset: invention, kind: "invention" });
  }
  const heavyWeaponCounts = (player.heavyWeapons || []).reduce((counts, weaponId) => {
    counts[weaponId] = (counts[weaponId] || 0) + 1;
    return counts;
  }, {});
  for (const [weaponId, amount] of Object.entries(heavyWeaponCounts)) {
    const definition = HEAVY_WEAPON_DEFINITIONS[weaponId];
    if (definition && amount > 0) entries.push({ id: `heavy:${weaponId}`, label: definition.label, amount, asset: definition.asset, kind: "heavy" });
  }
  for (const weapon of GUNNER_WEAPON_ORDER) {
    if (!gunnerWeaponAvailable(player, weapon)) continue;
    entries.push({ id: `weapon:${weapon}`, label: GUNNER_WEAPONS[weapon]?.name || weapon, amount: 1, asset: weapon, kind: "weapon" });
  }
  return entries;
}

function removeTransferableItem(room, player, itemId, amount = 1) {
  const count = Math.max(1, Math.floor(Number(amount) || 1));
  if (INSTANT_ITEM_DEFINITIONS[itemId]) throw new ApiError(400, `${INSTANT_ITEM_DEFINITIONS[itemId].label}は即席のため譲渡できません。`);
  if (ITEM_DEFINITIONS[itemId]) {
    consumeItem(player, itemId, count);
    if (itemId === "hsg") clearHsgPreparedOverdrive(player);
    return { id: itemId, label: ITEM_DEFINITIONS[itemId].label, amount: count, kind: "item" };
  }
  const charge = TRANSFERABLE_CHARGES[itemId];
  if (charge) {
    if ((Number(player[charge.field]) || 0) < count) throw new ApiError(400, `${charge.label}が不足しています。`);
    player[charge.field] -= count;
    return { id: itemId, label: charge.label, amount: count, kind: "charge" };
  }
  if (itemId.startsWith("invention:")) {
    const invention = itemId.slice(10);
    const index = (player.inventions || []).indexOf(invention);
    if (index < 0) throw new ApiError(400, "その特殊装備を所持していません。");
    player.inventions.splice(index, 1);
    return { id: itemId, label: inventionLabel(invention), amount: 1, kind: "invention" };
  }
  if (itemId.startsWith("weapon:")) {
    const weapon = itemId.slice(7);
    if (!GUNNER_WEAPONS[weapon] || !gunnerWeaponAvailable(player, weapon)) throw new ApiError(400, "その武器を所持していません。");
    const index = (player.purchasedWeapons || []).indexOf(weapon);
    if (index >= 0) player.purchasedWeapons.splice(index, 1);
    player.unavailableGunnerWeapons ||= [];
    if (!player.unavailableGunnerWeapons.includes(weapon)) player.unavailableGunnerWeapons.push(weapon);
    if (player.gunnerReloadWeapon === weapon) {
      player.gunnerReloadWeapon = "";
      player.gunnerReloadUntil = 0;
    }
    if (player.gunFiringWeapon === weapon) {
      if (player.gunnerBurstGbo && player.gunnerBurstGboWeapon === weapon) {
        stopGunnerFire(room, player, { reason: "別操作による中断" });
        throw new ApiError(400, "GBOへcommitした武器は中断により破壊され、別操作へ移せません。");
      }
      player.gunFiring = false;
      player.gunFiringWeapon = "";
      player.gunFiringSince = 0;
      player.gunnerBurstRoundsRemaining = 0;
      player.gunnerBurstEnhanceLevel = 0;
      player.gunnerBurstGbo = false;
      player.gunnerBurstGboWeapon = "";
    }
    if (player.gunnerWeapon === weapon) {
      const currentIndex = Math.max(0, GUNNER_WEAPON_ORDER.indexOf(weapon));
      player.gunnerWeapon = nextUsableGunnerWeapon(player, currentIndex, 1) || DEFAULT_GUNNER_WEAPON;
    }
    return { id: itemId, label: GUNNER_WEAPONS[weapon]?.name || weapon, amount: 1, kind: "weapon" };
  }
  if (itemId.startsWith("heavy:")) {
    const weapon = itemId.slice(6);
    const index = (player.heavyWeapons || []).indexOf(weapon);
    if (index < 0) throw new ApiError(400, "その重火器を所持していません。");
    player.heavyWeapons.splice(index, 1);
    return { id: itemId, label: HEAVY_WEAPON_DEFINITIONS[weapon]?.label || weapon, amount: 1, kind: "heavy" };
  }
  throw new ApiError(400, "譲渡対象が不正です。");
}

function receiveTransferableItem(player, item) {
  const itemId = String(item?.id || "");
  if (ITEM_DEFINITIONS[itemId]) addItem(player, itemId, item.amount);
  else if (TRANSFERABLE_CHARGES[itemId]) player[TRANSFERABLE_CHARGES[itemId].field] = Math.max(0, Number(player[TRANSFERABLE_CHARGES[itemId].field]) || 0) + item.amount;
  else if (itemId.startsWith("invention:")) player.inventions.push(itemId.slice(10));
  else if (itemId.startsWith("weapon:")) purchaseFirearm(player, itemId.slice(7));
  else if (itemId.startsWith("heavy:")) player.heavyWeapons.push(itemId.slice(6));
  else throw new ApiError(400, "この接地アイテムは回収できません。");
  return true;
}

function transferOwnedResource(room, player, targetId, itemId, rawAmount, credits = false) {
  if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent) throw new ApiError(403, "現在は譲渡できません。");
  ensureConscious(player);
  const target = room.players.get(String(targetId || ""));
  if (!target || target.id === player.id || !target.alive || target.ejected) throw new ApiError(404, "譲渡相手がいません。");
  // 所持品とクレジットはスマホのストレージ経由で譲渡するため距離を問わない。
  const amount = Math.max(1, Math.floor(Number(rawAmount) || 1));
  let transferLabel = "";
  if (credits) {
    if (Number(player.credits) < amount) throw new ApiError(400, "クレジットが不足しています。");
    player.credits -= amount;
    grantCredits(room, target, amount, "player-transfer");
    transferLabel = `${amount}C`;
    pushEvent(room, `${player.name} が ${target.name} へ ${amount}Cを譲渡しました。`);
  } else {
    ensureItemStorageAvailable(player);
    const item = removeTransferableItem(room, player, String(itemId || ""), amount);
    receiveTransferableItem(target, item);
    transferLabel = `${item.label}×${item.amount}`;
    pushEvent(room, `${player.name} が ${target.name} へ ${item.label}×${item.amount}を譲渡しました。`);
  }
  pushMagicEffect(room, "transfer-out", player, {
    radius: 150,
    playerId: player.id,
    targetId: target.id,
    targetX: target.x,
    targetY: target.y,
    variant: credits ? "credits" : "item",
    durationMs: 1000
  });
  pushMagicEffect(room, "transfer-in", target, {
    radius: 150,
    playerId: target.id,
    targetId: player.id,
    targetX: player.x,
    targetY: player.y,
    variant: credits ? "credits" : "item",
    durationMs: 1100
  });
  setImmediateFeedback(player, "譲渡", transferLabel);
  setImmediateFeedback(target, "受領", transferLabel);
  touch(room);
}

function applyDefenderFriendlyFirePenalty(room, killer, target, timestamp, options = {}) {
  if (!killer || !target || killer.id === target.id) return false;
  if (killer.role !== target.role || !["defender", "attacker"].includes(killer.role) || !killer.alive || killer.ejected) return false;
  if (!options.ignorePreparationBarrier && absorbPreparationBarrier(room, killer, timestamp, target)) return false;
  recordBotMatchElimination(room, killer, killer);
  killer.alive = false;
  recordKillCamera(room, killer, null, {
    timestamp,
    killerName: "同陣営誤射ペナルティ",
    actionLabel: `${target.name}への同陣営攻撃`,
    actionKind: "friendly-fire-penalty",
    sourceLabel: "戦闘ルール"
  });
  killer.bodyHits = 0;
  killer.overheal = 0;
  killer.limitBreakActive = false;
  killer.limitBreakEndsAt = 0;
  killer.limitBreakStacks = 0;
  killer.inVent = false;
  killer.ventId = "";
  killer.drone.active = false;
  clearAttackState(killer);
  completeTasksAfterDeath(room, killer);
  pushHitEffect(room, killer, "body", true);
  room.bodies.push({
    id: uid("body_"),
    playerId: killer.id,
    killerId: "friendly-fire",
    killerName: "同陣営誤射ペナルティ",
    killerIsBot: true,
    killerSkinId: "operator",
    name: killer.name,
    x: killer.x,
    y: killer.y,
    at: timestamp,
    friendlyFirePenalty: true
  });
  pushDoorLog(room, `${whichRoom(getMap(room), killer)} で同陣営誤射ペナルティ発生`);
  pushEvent(room, `${killer.name} は同陣営の ${target.name} へ攻撃を試みたため即死しました。${target.name} は無傷です。`);
  return true;
}

function destroyElectronicInventoryByEmp(room, target) {
  let destroyed = 0;
  if (Array.isArray(target.purchasedWeapons) && target.purchasedWeapons.includes("taser")) {
    target.purchasedWeapons = target.purchasedWeapons.filter((weaponId) => weaponId !== "taser");
    target.gunnerAmmo.taser = 0;
    destroyed += 1;
  }
  if (destroyed > 0) pushEvent(room, `${target.name} の電子機器 ${destroyed}点がEMPで破壊されました。`);
  return destroyed;
}

function hackerEmpProtectionUntil(room, target) {
  if (!isHackerOperational(target)) return 0;
  const battleStartedAt = Number(room?.battleStartedAt) || 0;
  return battleStartedAt > 0 ? battleStartedAt + HACKER_EMP_OPENING_PROTECTION_MS : 0;
}

function hackerEmpOpeningProtected(room, target, timestamp = now()) {
  const protectedUntil = hackerEmpProtectionUntil(room, target);
  return protectedUntil > 0 && timestamp < protectedUntil;
}

function preparationBarrierActive(room, timestamp = now()) {
  return room?.phase === "playing" && Number(room.preparationEndsAt) > timestamp;
}

function preparationBarrierProtects(room, target, timestamp = now()) {
  return Boolean(target?.alive && !target.ejected && preparationBarrierActive(room, timestamp));
}

function activeGravityStormBarrier(room, target, timestamp = now()) {
  if (!target?.alive || target.ejected) return null;
  return (room?.gravityZones || []).find((zone) => (
    String(zone.ownerId || "") === String(target.id || "") &&
    Number(zone.endsAt) > timestamp &&
    timestamp < Number(zone.barrierUntil || (Number(zone.endsAt) - GRAVITY_STORM_BARRIER_RELEASE_MS))
  )) || null;
}

function absorbPreparationBarrier(room, target, timestamp = now(), source = null) {
  const gravityBarrier = activeGravityStormBarrier(room, target, timestamp);
  if (gravityBarrier) {
    pushMagicEffect(room, "gravity-storm-barrier-hit", target, {
      radius: Number(gravityBarrier.barrierRadius) || GRAVITY_STORM_BARRIER_RADIUS,
      targetId: source?.id || "",
      durationMs: 620,
      variant: "caster-barrier"
    });
    setImmediateFeedback(target, "グラビティストーム・バリア", "攻撃を無効化");
    return true;
  }
  if (!preparationBarrierProtects(room, target, timestamp)) return false;
  pushMagicEffect(room, "preparation-barrier-hit", target, {
    radius: 110,
    playerId: target.id,
    targetId: source?.id || "",
    durationMs: 650
  });
  setImmediateFeedback(target, "準備バリア", "攻撃を無効化");
  return true;
}

function applyEmpDisruption(room, target, timestamp = now()) {
  if (!target?.alive || target.ejected) return 0;
  if (rejectAdverseStatusDuringNaturalRecovery(room, target, "EMPストレージ遮断", timestamp)) return 0;
  target.itemDisabledUntil = Math.max(Number(target.itemDisabledUntil) || 0, timestamp + EMP_ITEM_LOCK_MS);
  if (target.gunFiring) stopGunnerFire(room, target, { reason: "EMPストレージ遮断", autoSwitch: false });
  target.particleCannonUntil = 0;
  target.particleCannonNextAt = 0;
  target.particleCannonPerformanceMultiplier = 1;
  pushMagicEffect(room, "emp-storage-lock", target, {
    radius: 105,
    playerId: target.id,
    durationMs: EMP_ITEM_LOCK_MS,
    variant: "storage"
  });
  setImmediateFeedback(target, "EMPストレージ遮断", `${Math.ceil(EMP_ITEM_LOCK_MS / 1000)}秒間、全アイテム使用・効果停止`);
  return 1;
}

function applyReflectedEmpAttack(room, defender, source, mode, timestamp = now()) {
  if (!source?.alive || source.ejected || source.id === defender?.id) return false;
  applyEmpDisruption(room, source, timestamp);
  if (mode === "disruption") return true;
  if (mode === "lethal") {
    destroyPlayerUnconditionally(room, defender, source, "反射されたEMP", {
      noKillCutin: false,
      attackKind: "reflected-emp-lethal",
      attackLabel: "反射されたEMP",
      ignorePreparationBarrier: true,
      ignoreFriendlyFire: true,
      bypassSlashGuard: true
    });
    return true;
  }
  try {
    killPlayer(room, defender, source.id, {
      ranged: true,
      magic: true,
      hitZone: "body",
      damage: 1,
      allowAnyKiller: true,
      ignoreRange: true,
      ignoreCooldown: true,
      preserveCooldown: true,
      ignorePush: true,
      ignoreFriendlyFire: true,
      bypassSlashGuard: true,
      origin: { x: defender.x, y: defender.y },
      targetRole: source.role,
      attackKind: "reflected-emp",
      attackLabel: "反射されたEMP",
      slashGuardPhysical: false
    });
    return true;
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    return false;
  }
}

function eliminatePlayerWithEmp(room, source, target, timestamp, reason = "EMP共振") {
  if (!target?.alive || target.ejected) return false;
  if (source?.role === target.role && ["defender", "attacker"].includes(source.role) && source.id !== target.id) {
    applyEmpDisruption(room, source, timestamp);
    pushEvent(room, `${source.name} の味方EMPが反射され、発動者のアイテムストレージを遮断しました。${target.name} は無傷です。`);
    return false;
  }
  if (resolveFighterSlashGuard(room, source, target, {
    kind: "emp",
    label: reason,
    physical: false,
    reflectable: false,
    destroy: true,
    reflectEffect: ({ defender, source: reflectedTarget }) => applyReflectedEmpAttack(room, defender, reflectedTarget, "lethal", timestamp)
  }, timestamp)) return false;
  if (absorbPreparationBarrier(room, target, timestamp, source)) return false;
  if (hackerEmpOpeningProtected(room, target, timestamp)) return false;
  applyEmpDisruption(room, target, timestamp);
  recordBotVisiblePoisonDeathInference(room, target, timestamp);
  recordBotMatchElimination(room, target, source);
  target.alive = false;
  recordKillCamera(room, target, source, {
    timestamp,
    actionLabel: reason,
    actionKind: String(reason).includes("反射") ? "reflected-emp-lethal" : "emp-resonance-lethal",
    sourceLabel: "EMP",
    reflected: String(reason).includes("反射")
  });
  target.bodyHits = 0;
  target.overheal = 0;
  target.limitBreakActive = false;
  target.limitBreakEndsAt = 0;
  target.limitBreakStacks = 0;
  target.inVent = false;
  target.ventId = "";
  target.drone.active = false;
  clearAttackState(target);
  completeTasksAfterDeath(room, target);
  if (source && source.id !== target.id) {
    transferKillCredits(room, source, target);
    source.totalKills += 1;
    awardAbilityContribution(source, 1);
  }
  pushHitEffect(room, target, "body", true);
  room.bodies.push({
    id: uid("body_"),
    playerId: target.id,
    killerId: source?.id || "emp",
    killerName: source?.name || "EMP共振",
    killerIsBot: Boolean(source?.isBot),
    killerSkinId: source?.skinId || (source?.isBot ? "operator" : "hood"),
    name: target.name,
    x: target.x,
    y: target.y,
    at: timestamp,
    empDefeat: true
  });
  applyDefenderFriendlyFirePenalty(room, source, target, timestamp);
  pushDoorLog(room, `${whichRoom(getMap(room), target)} で${reason}による反応消失`);
  return true;
}

function applyEmpBodyDamage(room, source, target, timestamp) {
  if (!target?.alive || target.ejected) return "none";
  if (source?.role === target.role && ["defender", "attacker"].includes(source.role) && source.id !== target.id) {
    applyEmpDisruption(room, source, timestamp);
    pushEvent(room, `${source.name} の味方EMPが反射され、発動者のアイテムストレージを遮断しました。${target.name} は無傷です。`);
    return "friendlyFireReflected";
  }
  const slashGuardOutcome = resolveFighterSlashGuard(room, source, target, {
    kind: "emp",
    label: "EMP共振",
    physical: false,
    reflectable: false,
    damage: 1,
    hitZone: "body",
    reflectEffect: ({ defender, source: reflectedTarget }) => applyReflectedEmpAttack(room, defender, reflectedTarget, "body", timestamp)
  }, timestamp);
  if (slashGuardOutcome) return slashGuardOutcome;
  if (absorbPreparationBarrier(room, target, timestamp, source)) return "preparationBarrier";
  if (hackerEmpOpeningProtected(room, target, timestamp)) return "openingProtection";
  applyEmpDisruption(room, target, timestamp);
  if (hasFighterInfiniteResources(target)) {
    syncFighterInfiniteResources(target);
    pushHitEffect(room, target, "body", false);
    setImmediateFeedback(target, "到達報酬", "MP・SP・HP・踏ん張り∞ / EMPダメージ無効");
    return "infiniteResources";
  }
  if (target.overheal > 0) {
    target.overheal -= 1;
    pushHitEffect(room, target, "body", false);
    return "overheal";
  }
  if (target.bodyHits >= 1) {
    return eliminatePlayerWithEmp(room, source, target, timestamp, "EMP共振") ? "lethal" : "substitution";
  }
  target.bodyHits += 1;
  pushHitEffect(room, target, "body", false);
  return "body";
}

function resolveStandardEmp(room, pulse, timestamp) {
  const player = room.players.get(pulse.playerId);
  if (!player) return;
  let cameras = 0;
  let drones = 0;
  let itemLocks = 0;
  let friendlyReflections = 0;
  const map = getMap(room);
  for (const camera of map.cameras) {
    if (room.destroyedCameras[camera.id] || distance(pulse, camera) > EMP_RANGE) continue;
    room.destroyedCameras[camera.id] = true;
    cameras += 1;
  }
  for (const target of room.players.values()) {
    if (target.id !== player.id && target.alive && !target.ejected && distance(pulse, target) <= EMP_RANGE) {
      if (player.role === target.role && ["defender", "attacker"].includes(player.role)) {
        if (absorbPreparationBarrier(room, target, timestamp, player)) continue;
        itemLocks += applyEmpDisruption(room, player, timestamp);
        friendlyReflections += 1;
      } else {
        const slashGuardOutcome = resolveFighterSlashGuard(room, player, target, {
          kind: "emp",
          label: `${pulse.phase === "positive" ? "正相" : "逆相"}EMP`,
          physical: false,
          reflectable: false,
          reflectEffect: ({ defender, source: reflectedTarget }) => applyReflectedEmpAttack(room, defender, reflectedTarget, "disruption", timestamp)
        }, timestamp);
        if (slashGuardOutcome) continue;
        if (absorbPreparationBarrier(room, target, timestamp, player)) continue;
        if (hackerEmpOpeningProtected(room, target, timestamp)) continue;
        itemLocks += applyEmpDisruption(room, target, timestamp);
      }
    }
    if (target.drone?.active && distance(pulse, target.drone) <= EMP_RANGE) {
      const friendlyDrone = target.id !== player.id && target.role === player.role && ["defender", "attacker"].includes(player.role);
      if (friendlyDrone) {
        itemLocks += applyEmpDisruption(room, player, timestamp);
        friendlyReflections += 1;
      } else if (destroyDrone(target, timestamp)) {
        drones += 1;
      }
    }
  }
  pushSound(room, "emp", pulse, {
    ownerId: player.id,
    sourceKind: "player",
    maxDistance: 2200,
    volume: 1
  });
  pushMagicEffect(room, "emp", pulse, { radius: EMP_RANGE, playerId: player.id, variant: pulse.phase });
  pushEvent(room, `${pulse.phase === "positive" ? "正相" : "逆相"}EMP発生: カメラ${cameras}台 / ドローン${drones}機 / ストレージ遮断${itemLocks}人 / 味方反射${friendlyReflections}件`);
  checkWin(room);
  touch(room);
}

function resolveEmpInteraction(room, first, second, timestamp) {
  const firstOwner = room.players.get(first.playerId);
  const secondOwner = room.players.get(second.playerId);
  const midpoint = { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
  const samePhase = first.phase === second.phase;
  const soloEmpPractice = room.soloMission?.id === "emp" && [first.playerId, second.playerId].includes(room.soloMission.playerId);
  if (soloEmpPractice) {
    const outcome = samePhase ? "amplify" : "cancel";
    const outcomes = new Set(Array.isArray(room.soloMission.empTrainingOutcomes) ? room.soloMission.empTrainingOutcomes : []);
    outcomes.add(outcome);
    room.soloMission.empTrainingOutcomes = [...outcomes];
    room.soloMission.empAmplified = outcomes.has("amplify");
    room.soloMission.empCancelled = outcomes.has("cancel");
  }
  if (!samePhase) {
    pushMagicEffect(room, "emp-cancel", midpoint, { radius: EMP_INTERACTION_RANGE, variant: "opposite" });
    pushSound(room, "emp", midpoint, { ownerId: second.playerId, sourceKind: "emp", maxDistance: 1800, volume: 0.8 });
    pushEvent(room, soloEmpPractice
      ? "EMP訓練: 逆位相の重ね合わせで打ち消しに成功しました。"
      : "正相EMPと逆相EMPが干渉し、互いに相殺されました。");
    checkWin(room);
    touch(room);
    return;
  }

  if (soloEmpPractice) {
    pushMagicEffect(room, "emp-resonance", midpoint, { radius: EMP_INTERACTION_RANGE, variant: first.phase });
    pushSound(room, "emp", midpoint, { ownerId: second.playerId, sourceKind: "emp", maxDistance: 2600, volume: 1 });
    pushEvent(room, "EMP訓練: 同位相の重ね合わせで増強に成功しました。");
    checkWin(room);
    touch(room);
    return;
  }

  const pairDistance = distance(first, second);
  let lethalCount = 0;
  let bodyCount = 0;
  for (const target of room.players.values()) {
    if (!target.alive || target.ejected) continue;
    const isFirst = target.id === first.playerId;
    const isSecond = target.id === second.playerId;
    const source = isFirst ? secondOwner : isSecond ? firstOwner : distance(target, first) <= distance(target, second) ? firstOwner : secondOwner;
    if (isFirst || isSecond) {
      if (pairDistance <= EMP_RESONANCE_LETHAL_RANGE) {
        if (eliminatePlayerWithEmp(room, source, target, timestamp, "同位相EMP共振")) lethalCount += 1;
      } else {
        const outcome = applyEmpBodyDamage(room, source, target, timestamp);
        if (outcome === "lethal") lethalCount += 1;
        else if (["body", "overheal"].includes(outcome)) bodyCount += 1;
      }
      continue;
    }
    if (pairDistance <= EMP_RESONANCE_LETHAL_RANGE && distance(target, midpoint) <= EMP_RESONANCE_LETHAL_RANGE) {
      if (eliminatePlayerWithEmp(room, source, target, timestamp, "同位相EMP共振の巻き添え")) lethalCount += 1;
    } else if (Math.min(distance(target, first), distance(target, second)) <= EMP_RESONANCE_BODY_RANGE) {
      const outcome = applyEmpBodyDamage(room, source, target, timestamp);
      if (outcome === "lethal") lethalCount += 1;
      else if (["body", "overheal"].includes(outcome)) bodyCount += 1;
    }
  }
  pushMagicEffect(room, "emp-resonance", midpoint, { radius: EMP_INTERACTION_RANGE, variant: first.phase });
  pushSound(room, "emp", midpoint, { ownerId: second.playerId, sourceKind: "emp", maxDistance: 2600, volume: 1 });
  pushEvent(room, `同位相EMPが共振しました。確殺${lethalCount}人 / ボディダメージ${bodyCount}人。`);
  checkWin(room);
  touch(room);
}

function resolvePendingEmps(room, timestamp = now()) {
  room.activeEmps ||= [];
  const due = room.activeEmps.filter((pulse) => pulse.resolvesAt <= timestamp);
  if (!due.length) return;
  const dueIds = new Set(due.map((pulse) => pulse.id));
  room.activeEmps = room.activeEmps.filter((pulse) => !dueIds.has(pulse.id));
  for (const pulse of due) resolveStandardEmp(room, pulse, timestamp);
}

function activateEmp(room, player, rawPhase = "positive") {
  if (room.phase !== "playing") throw new ApiError(400, "バトル中のみEMPを使用できます。");
  if (!player.alive || player.ejected || player.inVent) throw new ApiError(403, "現在はEMPを使用できません。");
  ensureAbilityAvailable(player);
  const timestamp = now();
  if ((Number(player.empReadyAt) || 0) > timestamp) {
    throw new ApiError(400, `EMP再充填中です（残り${Math.ceil((player.empReadyAt - timestamp) / 1000)}秒）。`);
  }
  const phase = rawPhase === "negative" ? "negative" : "positive";
  player.empReadyAt = timestamp + (room.soloMission?.id === "emp" ? 3000 : EMP_COOLDOWN_MS);
  room.activeEmps ||= [];
  room.activeEmps = room.activeEmps.filter((pulse) => pulse.resolvesAt > timestamp);
  const pulse = {
    id: uid("emp_"),
    playerId: player.id,
    x: player.x,
    y: player.y,
    phase,
    at: timestamp,
    resolvesAt: timestamp + EMP_INTERACTION_WINDOW_MS
  };
  const interaction = room.activeEmps.find((other) => other.playerId !== player.id && distance(other, pulse) <= EMP_INTERACTION_RANGE);
  if (interaction) {
    room.activeEmps = room.activeEmps.filter((other) => other.id !== interaction.id);
    resolveEmpInteraction(room, interaction, pulse, timestamp);
  } else {
    room.activeEmps.push(pulse);
    pushMagicEffect(room, "emp-charge", pulse, { radius: EMP_RANGE, playerId: player.id, variant: phase });
    pushEvent(room, `${player.name} が${phase === "positive" ? "正相" : "逆相"}EMPを起動しました。`);
    touch(room);
  }
}

function nearbyMapObjects(room, player, objectId = "") {
  const objects = [
    ...(getMap(room).objects || []),
    ...(room.alchemyObjects || []),
    ...(room.resolvePoint ? [room.resolvePoint] : [])
  ].filter((object) => object.interactive);
  const candidates = objectId ? objects.filter((object) => object.id === objectId) : objects;
  return candidates
    .map((object) => ({ object, distance: distance(player, object) }))
    .filter((entry) => entry.distance <= Number(entry.object.useRange || MAP_OBJECT_RANGE))
    .sort((a, b) => a.distance - b.distance);
}

function nearbyMapObject(room, player, objectId = "") {
  return nearbyMapObjects(room, player, objectId)[0] || null;
}

function pruneObjectContactUses(player, nearbyEntries) {
  const nearbyIds = new Set((nearbyEntries || []).map(({ object }) => object.id));
  player.objectContactUsedIds = (Array.isArray(player.objectContactUsedIds) ? player.objectContactUsedIds : [])
    .filter((id) => nearbyIds.has(id));
  return new Set(player.objectContactUsedIds);
}

function markObjectContactUsed(player, objectId) {
  const used = new Set(Array.isArray(player.objectContactUsedIds) ? player.objectContactUsedIds : []);
  used.add(objectId);
  player.objectContactUsedIds = [...used];
}

function reducePlayerCooldowns(player, reductionMs, timestamp = now()) {
  const reduction = Math.max(0, Number(reductionMs) || 0);
  if (!reduction) return 0;
  let changed = 0;
  for (const [key, rawValue] of Object.entries(player)) {
    if (!key.endsWith("ReadyAt")) continue;
    const readyAt = Number(rawValue) || 0;
    if (readyAt <= timestamp) continue;
    player[key] = Math.max(timestamp, readyAt - reduction);
    changed += 1;
  }
  player.objectCooldowns ||= {};
  for (const [key, rawValue] of Object.entries(player.objectCooldowns)) {
    const readyAt = Number(rawValue) || 0;
    if (readyAt <= timestamp) continue;
    player.objectCooldowns[key] = Math.max(timestamp, readyAt - reduction);
    changed += 1;
  }
  return changed;
}

function extendPlayerCooldowns(player, extensionMs, timestamp = now()) {
  const extension = Math.max(0, Number(extensionMs) || 0);
  if (!extension) return 0;
  let changed = 0;
  for (const [key, rawValue] of Object.entries(player)) {
    if (!key.endsWith("ReadyAt")) continue;
    const readyAt = Number(rawValue) || 0;
    if (readyAt <= timestamp) continue;
    player[key] = readyAt + extension;
    changed += 1;
  }
  player.objectCooldowns ||= {};
  for (const [key, rawValue] of Object.entries(player.objectCooldowns)) {
    const readyAt = Number(rawValue) || 0;
    if (readyAt <= timestamp) continue;
    player.objectCooldowns[key] = readyAt + extension;
    changed += 1;
  }
  return changed;
}

function recoverMapObjectStatuses(room, player, source) {
  return clearAdverseStatuses(room, player, source);
}

function healBodyHits(player, amount = 1) {
  const before = Math.max(0, Number(player.bodyHits) || 0);
  player.bodyHits = Math.max(0, before - Math.max(1, Number(amount) || 1));
  return player.bodyHits < before;
}

function useMapObject(room, player, objectId) {
  if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "現在はマップオブジェクトを利用できません。");
  }
  ensureConscious(player);
  const nearbyEntries = nearbyMapObjects(room, player);
  const nearby = nearbyEntries.find(({ object }) => object.id === objectId) || null;
  if (!nearby) throw new ApiError(400, "利用可能なオブジェクトに近づいてください。");
  const object = nearby.object;
  const timestamp = now();
  player.objectCooldowns ||= {};
  const usedDuringContact = pruneObjectContactUses(player, nearbyEntries);
  if (usedDuringContact.has(object.id)) {
    throw new ApiError(400, `${object.label}は同じ接触中に再発動しません。一度離れてから利用してください。`);
  }
  const readyAt = Number(player.objectCooldowns[object.id] || 0);
  if (readyAt > timestamp) {
    throw new ApiError(400, `${object.label}は再起動中です（残り${Math.ceil((readyAt - timestamp) / 1000)}秒）。`);
  }

  if (object.type === "resolvePoint") {
    if (!room.resolvePoint || room.resolvePoint.id !== object.id) return;
    if (object.reward === "grit") grantStandFirmCharge(room, player, false, "resolve-focus");
    else grantPushCharge(room, player, false, "resolve-focus");
    room.resolvePoint = null;
    pushMagicEffect(room, "resolve-focus", object, {
      radius: Number(object.radius || 100),
      playerId: player.id,
      variant: object.reward
    });
    setImmediateFeedback(player, "意志の焦点", object.effectLabel);
    pushEvent(room, `${player.name} が意志の焦点から${object.effectLabel}を獲得しました。`);
    touch(room);
    return;
  }

  if (object.effectKind === "stamina") {
    replenishStamina(player, timestamp, true);
    if (player.stamina >= MAX_STORED_STAMINA - 0.01) throw new ApiError(400, `スタミナは最大 ${MAX_STORED_STAMINA} です。`);
    player.stamina = Math.min(MAX_STORED_STAMINA, player.stamina + Math.max(1, Number(object.effectAmount) || 0));
    player.staminaUpdatedAt = timestamp;
  } else if (object.effectKind === "credits") {
    player.credits = Math.max(0, Number(player.credits) || 0) + Math.max(1, Number(object.effectAmount) || 1);
  } else if (object.effectKind === "cooldownReduction") {
    reducePlayerCooldowns(player, Math.max(1000, Number(object.effectAmount) || 1000), timestamp);
  } else if (object.effectKind === "statusRecovery") {
    if (!recoverMapObjectStatuses(room, player, object.label)) throw new ApiError(400, "解除できる状態異常はありません。");
  } else if (object.effectKind === "acceleration") {
    addTimedAcceleration(
      player,
      `object:${object.id}`,
      Math.max(1.01, Number(object.effectAmount) || 1.2),
      Math.max(1000, Number(object.effectDurationMs) || 8000),
      timestamp
    );
  } else if (object.effectKind === "luckBoost") {
    player.objectLuckBonus = Math.max(Number(player.objectLuckBonus) || 0, Math.max(0.01, Number(object.effectAmount) || 0.1));
    player.objectLuckUntil = Math.max(Number(player.objectLuckUntil) || 0, timestamp + Math.max(1000, Number(object.effectDurationMs) || 20000));
    player.luck = luckValueFor(player);
  } else if (object.effectKind === "overheal") {
    player.overheal = Math.min(3, Math.max(0, Number(player.overheal) || 0) + Math.max(1, Number(object.effectAmount) || 1));
  } else if (object.effectKind === "footBath") {
    healBodyHits(player, 1);
    recoverMapObjectStatuses(room, player, object.label);
    reducePlayerCooldowns(player, 6000, timestamp);
    setImmediateFeedback(player, object.label, "HP +1・状態異常解除・再使用待機 -6秒");
  } else if (object.effectKind === "relaxation") {
    addTimedAcceleration(
      player,
      `object:${object.id}`,
      Math.max(1.01, Number(object.effectAmount) || 1.35),
      Math.max(1000, Number(object.effectDurationMs) || 12000),
      timestamp
    );
    setImmediateFeedback(player, object.label, `加速 ${Math.max(1.01, Number(object.effectAmount) || 1.35)}・${Math.round(Math.max(1000, Number(object.effectDurationMs) || 12000) / 1000)}秒`);
  } else if (object.effectKind === "herbalRecovery") {
    healBodyHits(player, 1);
    setImmediateFeedback(player, object.label, "HP +1");
  } else if (object.effectKind === "healthyMeal") {
    healBodyHits(player, 1);
    replenishStamina(player, timestamp, true);
    player.stamina = Math.min(MAX_STORED_STAMINA, player.stamina + 120);
    player.staminaUpdatedAt = timestamp;
    setMana(room, player, (Number(player.mana) || 0) + 1, object.label);
    setImmediateFeedback(player, object.label, "HP +1・スタミナ +120・マナ +1");
  } else if (object.effectKind === "mineralWater") {
    replenishStamina(player, timestamp, true);
    if (player.stamina >= MAX_STORED_STAMINA - 0.01) throw new ApiError(400, "スタミナは最大です。");
    player.stamina = Math.min(MAX_STORED_STAMINA, player.stamina + Math.max(1, Number(object.effectAmount) || 100));
    player.staminaUpdatedAt = timestamp;
  } else if (object.effectKind === "fullRecovery") {
    const needsTreatment = player.bodyHits > 0 || Number(player.overheal) <= 0;
    if (!needsTreatment) throw new ApiError(400, "現在は十分に回復しています。");
    player.bodyHits = 0;
    player.overheal = Math.max(1, Number(player.overheal) || 0);
  } else if (object.effectKind === "decoy") {
    replenishStamina(player, timestamp, true);
    player.stamina = Math.min(MAX_STORED_STAMINA, player.stamina + Math.max(1, Number(object.effectAmount) || MAX_STAMINA));
    player.staminaUpdatedAt = timestamp;
    pushSound(room, "dash", object, {
      ownerId: player.id,
      sourceKind: "player",
      maxDistance: 1800,
      volume: 1.05
    });
  } else if (object.effectKind === "heal") {
    if (player.bodyHits <= 0) throw new ApiError(400, "回復が必要なダメージはありません。");
    healBodyHits(player, object.effectAmount);
  } else if (object.effectKind === "mana") {
    setMana(room, player, (Number(player.mana) || 0) + Math.max(1, Number(object.effectAmount) || 1), object.label);
  } else {
    throw new ApiError(400, "このオブジェクトは接触時に自動で作動します。");
  }

  maintainNaturalRecovery(room, player, timestamp);

  markObjectContactUsed(player, object.id);
  player.objectCooldowns[object.id] = timestamp + Number(object.cooldownMs || 15000);
  pushMagicEffect(room, `object-${object.type}`, object, {
    radius: Number(object.radius || 100),
    playerId: player.id,
    effectKind: object.effectKind
  });
  pushMapObjectGainAtes(room, player, object.effectKind);
  pushSound(room, "object", object, {
    ownerId: player.id,
    sourceKind: "facility",
    maxDistance: 720,
    volume: 0.7
  });
  pushEvent(room, `${player.name} が ${object.label} を使用: ${object.effectLabel}`);
  touch(room);
}

function autoUseNearbyMapObject(room, player, timestamp = now()) {
  if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent || actionBlockedUntil(player) > timestamp) return false;
  const hasStatus = Boolean(player.burnStatus || player.poisonStatus || Number(player.slowedUntil) > timestamp ||
    Number(player.taserSlowedUntil) > timestamp || Number(player.shockSlowedUntil) > timestamp || Number(player.abilityDisabledUntil) > timestamp ||
    Number(player.itemDisabledUntil) > timestamp || Number(player.gravityPinnedUntil) > timestamp);
  const hasCooldown = Object.entries(player).some(([key, value]) => key.endsWith("ReadyAt") && Number(value) > timestamp);
  const nearbyEntries = nearbyMapObjects(room, player);
  const usedDuringContact = pruneObjectContactUses(player, nearbyEntries);
  for (const { object } of nearbyEntries) {
    if (usedDuringContact.has(object.id)) continue;
    const readyAt = Number(player.objectCooldowns?.[object.id] || 0);
    if (readyAt > timestamp) continue;
    const useful = object.type === "resolvePoint" || object.effectKind === "mana" || object.effectKind === "decoy" ||
      object.effectKind === "credits" || object.effectKind === "acceleration" || object.effectKind === "luckBoost" ||
      object.effectKind === "overheal" || object.effectKind === "relaxation" || object.effectKind === "healthyMeal" ||
      (object.effectKind === "footBath" && (hasStatus || hasCooldown || Number(player.bodyHits) > 0)) ||
      (object.effectKind === "herbalRecovery" && Number(player.bodyHits) > 0) ||
      (object.effectKind === "mineralWater" && Number(player.stamina) < MAX_STORED_STAMINA - 0.01) ||
      (object.effectKind === "stamina" && Number(player.stamina) < MAX_STORED_STAMINA - 0.01) ||
      (object.effectKind === "heal" && Number(player.bodyHits) > 0) ||
      (object.effectKind === "fullRecovery" && (
        Number(player.bodyHits) > 0 || Number(player.overheal) <= 0
      ));
    if (!useful) continue;
    try {
      useMapObject(room, player, object.id);
      return true;
    } catch (error) {
      if (!(error instanceof ApiError)) throw error;
    }
  }
  return false;
}

function applyMysteryDrink(room, player, timestamp = now()) {
  const roll = luckAdjustedRoll(player);
  let result;
  if (roll < 0.18) {
    grantCredits(room, player, CREDIT_ECONOMY.mysteryJackpot, "mystery");
    result = `ジャックポット +${CREDIT_ECONOMY.mysteryJackpot}C`;
  } else if (roll < 0.36) {
    player.stamina = Math.min(MAX_STORED_STAMINA, player.stamina + 250);
    player.staminaUpdatedAt = timestamp;
    maintainNaturalRecovery(room, player, timestamp);
    result = "エナジーサージ スタミナ+250";
  } else if (roll < 0.52) {
    player.bodyHits = 0;
    player.overheal = 1;
    clearAdverseStatuses(room, player, "完全活性", timestamp);
    addTimedAcceleration(player, "flora", FLORA_SPEED_MULTIPLIER, FLORA_SPEED_DURATION_MS, timestamp);
    result = "完全活性 回復・オーバーヒール・速度上昇";
  } else if (roll < 0.64) {
    setMana(room, player, Math.max(RATIONAL_MANA_THRESHOLD, Number(player.mana) || 0), "マナ奔流");
    result = "マナ奔流 理知へ移行";
  } else if (roll < 0.78) {
    if (rejectAdverseStatusDuringNaturalRecovery(room, player, "倦怠", timestamp)) result = "倦怠を理知の自然回復で無効化";
    else {
      player.slowedUntil = Math.max(player.slowedUntil || 0, timestamp + 12_000);
      result = "倦怠 移動速度低下12秒";
    }
  } else if (roll < 0.9) {
    if (rejectAdverseStatusDuringNaturalRecovery(room, player, "能力封印", timestamp)) result = "能力封印を理知の自然回復で無効化";
    else {
      player.abilityDisabledUntil = Math.max(player.abilityDisabledUntil || 0, timestamp + MYSTERY_ABILITY_LOCK_MS);
      result = "能力封印15秒";
    }
  } else {
    if (rejectAdverseStatusDuringNaturalRecovery(room, player, "意識消失", timestamp)) result = "意識消失を理知の自然回復で無効化";
    else {
      player.unconsciousUntil = timestamp + MYSTERY_UNCONSCIOUS_MS;
      player.vx = 0;
      player.vy = 0;
      player.movementMode = "unconscious";
      clearAttackState(player);
      result = "意識消失8秒";
    }
  }
  player.lastMysteryResult = result;
  player.lastMysteryResultAt = timestamp;
  return result;
}

function purchaseDrink(room, player, itemId) {
  if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "現在は自販機を利用できません。");
  }
  ensureConscious(player);
  ensureItemStorageAvailable(player);
  const items = {
    "mineral-water": { label: "ミネラルウォーター", cost: MINERAL_WATER_COST, apply: () => { addItem(player, "mineral-water"); } },
    antidote: { label: "解毒剤", cost: ANTIDOTE_COST, apply: () => { addItem(player, "antidote"); } },
    molotov: { label: "火炎瓶", cost: MOLOTOV_COST, apply: () => { addItem(player, "molotov"); } },
    // Quantum Control deliberately turns these low-price feedstocks into a
    // small credit profit (Hg +1C / Pb +1C).
    mercury: { label: "水銀瓶", cost: 60, apply: () => { addItem(player, "mercury"); } },
    lead: { label: "鉛瓶", cost: 40, apply: () => { addItem(player, "lead"); } },
    uranium: { label: "ウラン容器", cost: 140, apply: () => { addItem(player, "uranium"); } },
    plutonium: { label: "プルトニウム容器", cost: 180, apply: () => { addItem(player, "plutonium"); } },
    "orichalcum-sword": { label: "オリハルコン・ソード", cost: ORICHALCUM_SWORD_VENDING_COST, apply: () => { addItem(player, "orichalcum-sword"); } },
    iai: { label: "居合", cost: IAI_VENDING_COST, apply: () => { grantIaiCharge(room, player, true, "vending"); } },
    evade: { label: "回避拡張", cost: 45, apply: () => { player.dodgeDurationBonusMs = Math.min(1500, player.dodgeDurationBonusMs + 250); } },
    speed: { label: "アクセラレート飲料", cost: 55, apply: () => { player.speedMultiplier = Math.round((player.speedMultiplier + 0.15) * 100) / 100; } },
    warp: { label: "テレポートマップスクロール", cost: 35, apply: () => { player.warpCharges = Math.min(3, player.warpCharges + 1); } },
    mystery: { label: "ミステリー", cost: MYSTERY_COST, apply: () => applyMysteryDrink(room, player) },
    fire: { label: "火遁の術", cost: FIRE_JUTSU_COST, apply: () => { player.fireJutsuCharges = Math.min(2, player.fireJutsuCharges + 1); } },
    substitution: { label: "変わり身の術", cost: SUBSTITUTION_COST, apply: () => {
      if (player.substitutionCharges >= 2) throw new ApiError(400, "変わり身は最大2回分まで所持できます。");
      player.substitutionCharges += 1;
    } },
    grit: { label: "踏ん張り", cost: STAND_FIRM_COST, apply: () => grantStandFirmCharge(room, player, true, "vending") },
    heal: { label: "回復", cost: HEAL_COST, apply: () => {
      if (player.bodyHits > 0) player.bodyHits = 0;
      else player.overheal = Math.max(0, Number(player.overheal) || 0) + 1;
    } },
    mana: { label: "マナポーション +1MP", cost: MANA_POTION_COST, apply: () => {
      setMana(room, player, (Number(player.mana) || 0) + 1, "マナポーション");
    } },
    stamina: { label: "スタミナ", cost: 6, apply: () => {
      player.stamina = Math.min(MAX_STORED_STAMINA, Math.max(0, Number(player.stamina) || 0) + 350);
      player.staminaUpdatedAt = now();
      maintainNaturalRecovery(room, player, player.staminaUpdatedAt);
    } },
    hsg: { label: "HSG", cost: 8, apply: () => acquirePhysicalHsg(player) },
    reason: { label: "押し込み", cost: PUSH_COST, apply: () => grantPushCharge(room, player, true, "vending") },
    railgun: { label: "素敵な発明品・レールガン", cost: 150, apply: () => { player.inventions.push("railgun"); } },
    "particle-cannon": { label: "素敵な発明品・荷電粒子砲", cost: 190, apply: () => { player.inventions.push("particle-cannon"); } },
    excalibur: { label: "素敵な発明品・エクスカリバー", cost: 230, apply: () => { player.inventions.push("excalibur"); } },
    computer: { label: "パソコン", cost: 125, apply: () => activateComputerInstant(player) },
    handgun: { label: "ハンドガン", cost: 40, apply: () => purchaseFirearm(player, "handgun") },
    smg: { label: "サブマシンガン", cost: 65, apply: () => purchaseFirearm(player, "smg") },
    assault: { label: "アサルトライフル", cost: 85, apply: () => purchaseFirearm(player, "assault") },
    sniper: { label: "スナイパーライフル", cost: 120, apply: () => purchaseFirearm(player, "sniper") },
    taser: { label: "テーザー銃", cost: 60, apply: () => purchaseFirearm(player, "taser") },
    rpg: { label: "RPG", cost: HEAVY_WEAPON_DEFINITIONS.rpg.cost, apply: () => { (player.heavyWeapons ||= []).push("rpg"); } },
    missile: { label: "ミサイル", cost: HEAVY_WEAPON_DEFINITIONS.missile.cost, apply: () => { (player.heavyWeapons ||= []).push("missile"); } },
    exile: { label: "亡命・遠隔クローン運用", cost: EXILE_COST, apply: () => {
      if (player.exiled) throw new ApiError(400, "既に亡命済みです。");
      player.exiled = true;
    } }
  };
  const product = DVA_ECONOMY.product(itemId);
  const item = items[itemId];
  if (!product || !item || !product.vendingAvailable) throw new ApiError(404, "その商品は自販機では販売していません。");
  item.label = product.label;
  item.cost = product.price;
  if (item.role && player.role !== item.role) throw new ApiError(403, "この商品はアタッカー専用です。");
  if (player.credits < item.cost) throw new ApiError(400, `通貨が不足しています（必要 ${item.cost}C）。`);
  const outcome = item.apply();
  if (!["grit", "reason", "iai"].includes(itemId)) {
    pushInstantItemAcquisitionAte(room, player, itemId, "vending");
  }
  player.credits -= item.cost;
  pushMagicEffect(room, itemId === "mystery" ? "mystery-reveal" : "action-vending", player, {
    radius: itemId === "mystery" ? 145 : 90,
    playerId: player.id
  });
  pushEvent(room, `${player.name} が自販機で${item.label}を購入しました。${outcome ? `結果: ${outcome}` : ""}`);
  touch(room);
}

function purchaseFirearm(player, weaponId) {
  const weapon = GUNNER_WEAPONS[weaponId];
  if (!weapon) throw new ApiError(404, "その銃器は販売されていません。");
  player.purchasedWeapons ||= [];
  if (!player.purchasedWeapons.includes(weaponId)) player.purchasedWeapons.push(weaponId);
  player.unavailableGunnerWeapons = (player.unavailableGunnerWeapons || []).filter((id) => id !== weaponId);
  player.gunnerAmmo ||= createGunnerAmmo();
  player.gunnerAmmo[weaponId] = weapon.maxAmmo;
  player.gunnerWeapon = weaponId;
}

function activateComputerInstant(player) {
  if (player.computerActive) throw new ApiError(400, "パソコン効果は適用済みです。");
  player.computerActive = true;
}

function acquirePhysicalHsg(player) {
  addItem(player, "hsg");
}

function pushInstantItemAcquisitionAte(room, player, itemId, source = "acquired") {
  if (!room || !player) return;
  // Vibe Coding already emits its own generation ATE. Suppress only the
  // generated instant item's acquisition ATE; vending, EC and other grants
  // keep the normal item-specific acquisition feedback.
  if (String(source || "").startsWith("hacker")) return;
  const effectType = {
    stamina: "instant-stamina-acquired",
    heal: "instant-heal-acquired",
    fire: "instant-fire-acquired",
    substitution: "instant-substitution-acquired",
    warp: "teleport-map-scroll-acquired",
    evade: "instant-evade-acquired",
    speed: "instant-speed-acquired",
    mystery: "instant-mystery-acquired",
    mana: "instant-mana-acquired",
    grit: "instant-stand-firm-acquired",
    reason: "instant-push-acquired",
    iai: "instant-iai-acquired",
    computer: "instant-computer-acquired"
  }[itemId];
  if (!effectType) return;
  pushMagicEffect(room, effectType, player, {
    radius: itemId === "iai" ? 122 : itemId === "reason" ? 116 : 124,
    playerId: player.id,
    variant: source
  });
}

function grantStandFirmCharge(room, player, enforceLimit = true, source = "acquired") {
  if (enforceLimit && player.gritCharges >= 3) {
    throw new ApiError(400, "踏ん張りは最大3回分まで所持できます。");
  }
  player.gritCharges += 1;
  pushInstantItemAcquisitionAte(room, player, "grit", source);
}

function grantPushCharge(room, player, enforceLimit = true, source = "acquired") {
  if (enforceLimit && player.reasonCharges >= 3) {
    throw new ApiError(400, "押し込みは最大3回分まで所持できます。");
  }
  // 押し込みと踏ん張りは独立した自動消費効果として同時に所持できる。
  player.reasonCharges += 1;
  pushInstantItemAcquisitionAte(room, player, "reason", source);
}

function grantIaiCharge(room, player, enforceLimit = true, source = "acquired") {
  if (enforceLimit && Math.max(0, Number(player.iaiCharges) || 0) >= 3) {
    throw new ApiError(400, "居合は最大3回分まで所持できます。");
  }
  player.iaiCharges = Math.max(0, Math.floor(Number(player.iaiCharges) || 0)) + 1;
  pushInstantItemAcquisitionAte(room, player, "iai", source);
  return player.iaiCharges;
}

function applyPushBacklash(room, player, removedCharges, timestamp = now()) {
  if (hasFighterInfiniteResources(player)) {
    syncFighterInfiniteResources(player);
    return false;
  }
  const chargeCount = Math.max(0, Math.floor(Number(removedCharges) || 0));
  const damage = Math.round(chargeCount * PUSH_BACKLASH_DAMAGE_PER_CHARGE * 100) / 100;
  if (!damage || !player?.alive || player.ejected) return false;
  if (absorbPreparationBarrier(room, player, timestamp)) return false;
  if (player.overheal > 0) {
    player.overheal -= 1;
    pushHitEffect(room, player, "body", false);
    setImmediateFeedback(player, "押し込み反動", `踏ん張り${chargeCount}解除 / ${damage.toFixed(1)}ダメージをオーバーヒールで吸収`);
    pushEvent(room, `${player.name} の押し込み反動 ${damage.toFixed(1)}ダメージはオーバーヒールに吸収されました。`);
    return false;
  }
  player.bodyHits = Math.round((Math.max(0, Number(player.bodyHits) || 0) + damage) * 100) / 100;
  const lethal = player.bodyHits >= 2;
  pushHitEffect(room, player, "body", lethal);
  setImmediateFeedback(player, "押し込み反動", `踏ん張り${chargeCount}解除 / HP-${damage.toFixed(1)}`);
  if (!lethal) {
    pushEvent(room, `${player.name} は押し込みの反動で ${damage.toFixed(1)}ダメージを受けました。`);
    return false;
  }
  recordBotMatchElimination(room, player, player);
  player.alive = false;
  recordKillCamera(room, player, player, {
    timestamp,
    actionLabel: "押し込み反動",
    actionKind: "push-backlash",
    sourceLabel: `踏ん張り${chargeCount}回分解除・反動${damage.toFixed(1)}`
  });
  player.bodyHits = 0;
  player.overheal = 0;
  player.limitBreakActive = false;
  player.limitBreakEndsAt = 0;
  player.limitBreakStacks = 0;
  player.inVent = false;
  player.ventId = "";
  if (player.drone) player.drone.active = false;
  clearAttackState(player);
  completeTasksAfterDeath(room, player);
  room.bodies.push({
    id: uid("body_"),
    playerId: player.id,
    killerId: "push-backlash",
    killerName: "押し込み反動",
    killerIsBot: true,
    killerSkinId: "operator",
    name: player.name,
    x: player.x,
    y: player.y,
    at: timestamp,
    pushBacklash: true
  });
  pushDoorLog(room, `${whichRoom(getMap(room), player)} で押し込み反動による戦闘不能`);
  pushEvent(room, `${player.name} は押し込みの反動で戦闘不能になりました。`);
  return true;
}

function botPushBacklashWouldBeLethal(bot, target) {
  if (!bot?.isBot || !bot.alive || bot.ejected || Number(bot.overheal) > 0 || !itemStorageAvailable(bot)) return false;
  if (!passivesEnabled(bot) || (Number(bot.reasonCharges) || 0) <= 0) return false;
  const removedCharges = Math.max(0, Number(target?.gritCharges) || 0);
  if (removedCharges <= 0) return false;
  return (Math.max(0, Number(bot.bodyHits) || 0) + removedCharges * PUSH_BACKLASH_DAMAGE_PER_CHARGE) >= 2;
}

function pruneBotVisibleThrowObservations(bot, timestamp = now()) {
  bot.botVisibleThrowObservations = (Array.isArray(bot?.botVisibleThrowObservations)
    ? bot.botVisibleThrowObservations
    : []).filter((observation) => Number(observation.expiresAt) > timestamp).slice(-24);
  return bot.botVisibleThrowObservations;
}

function playerHasVisiblePoisonPresentation(room, player, timestamp = now()) {
  // This boolean is the same statusAte.poison/players[].poisoned presentation
  // serialized to ordinary clients. No source identity or hidden death reason is
  // consulted here.
  return Boolean(player?.alive && !player.ejected && persistentStatusAteState(room, player, timestamp).poison);
}

function recordBotVisibleThrowMotion(room, thrower, thrown, landing, timestamp = now()) {
  if (!thrower?.alive || thrower.ejected || !thrown?.id) return 0;
  let observers = 0;
  for (const bot of room.players.values()) {
    if (!bot.isBot || !bot.alive || bot.ejected || bot.inVent || bot.id === thrower.id) continue;
    if (!botCanDirectlyObservePlayer(room, bot, thrower)) continue;
    const observations = pruneBotVisibleThrowObservations(bot, timestamp);
    observations.push({
      visualThrowId: String(thrown.id),
      throwerId: String(thrower.id),
      visibleItemId: String(thrown.itemId || ""),
      visiblyToxicContainer: TOXIC_THROW_ITEM_IDS.has(String(thrown.itemId || "")),
      startX: Number(thrower.x) || 0,
      startY: Number(thrower.y) || 0,
      targetX: Number(landing?.x) || 0,
      targetY: Number(landing?.y) || 0,
      observedAt: timestamp,
      landsAt: Number(thrown.landsAt) || timestamp,
      poisonLandingObservedAt: 0,
      poisonX: 0,
      poisonY: 0,
      poisonRadius: 0,
      visiblePoisonVictims: {},
      expiresAt: Math.max(Number(thrown.landsAt) || timestamp, timestamp) + BOT_VISIBLE_THROW_MEMORY_MS
    });
    bot.botVisibleThrowObservations = observations.slice(-24);
    observers += 1;
  }
  return observers;
}

function recordBotVisiblePoisonLanding(room, thrown, landing, timestamp = now()) {
  if (!TOXIC_THROW_ITEM_IDS.has(String(thrown?.itemId || ""))) return 0;
  let observers = 0;
  for (const bot of room.players.values()) {
    if (!bot.isBot || !bot.alive || bot.ejected || bot.inVent) continue;
    const observation = pruneBotVisibleThrowObservations(bot, timestamp)
      .find((entry) => entry.visualThrowId === String(thrown.id || ""));
    if (!observation || !observation.visiblyToxicContainer) continue;
    if (!botCanDirectlyObservePosition(room, bot, landing)) continue;
    observation.poisonLandingObservedAt = timestamp;
    observation.poisonX = Number(landing?.x) || 0;
    observation.poisonY = Number(landing?.y) || 0;
    observation.poisonRadius = 145 + Math.max(0, Number(thrown.level) || 0) * 42;
    observation.expiresAt = Math.max(
      Number(observation.expiresAt) || 0,
      timestamp + BOT_VISIBLE_THROW_MEMORY_MS
    );
    observers += 1;
  }
  return observers;
}

function recordBotVisiblePoisonPresentations(room, timestamp = now()) {
  let observationsAdded = 0;
  for (const bot of room.players.values()) {
    if (!bot.isBot || !bot.alive || bot.ejected || bot.inVent) continue;
    const observations = pruneBotVisibleThrowObservations(bot, timestamp)
      .filter((entry) => entry.visiblyToxicContainer && Number(entry.poisonLandingObservedAt) > 0);
    if (!observations.length) continue;
    for (const target of room.players.values()) {
      if (!playerHasVisiblePoisonPresentation(room, target, timestamp)) continue;
      if (!botCanDirectlyObservePlayer(room, bot, target)) continue;
      for (const observation of observations) {
        const previous = observation.visiblePoisonVictims?.[target.id] || null;
        const visuallyEnteredObservedCloud = Math.hypot(
          Number(target.x) - Number(observation.poisonX),
          Number(target.y) - Number(observation.poisonY)
        ) <= Number(observation.poisonRadius) + BOT_VISIBLE_POISON_ASSOCIATION_PADDING;
        if (!previous && !visuallyEnteredObservedCloud) continue;
        observation.visiblePoisonVictims ||= {};
        observation.visiblePoisonVictims[target.id] = {
          firstSeenAt: Number(previous?.firstSeenAt) || timestamp,
          lastSeenAt: timestamp,
          lastX: Number(target.x) || 0,
          lastY: Number(target.y) || 0
        };
        observationsAdded += 1;
      }
    }
  }
  return observationsAdded;
}

function recordBotVisiblePoisonDeathInference(room, target, timestamp = now()) {
  // This intentionally receives neither the authoritative damage source nor a
  // death-cause label. A bot can infer poison only when it sees the public
  // poison ATE on the victim at the visible death moment and has the complete
  // earlier visual chain: thrower motion -> toxic landing -> victim in cloud.
  if (!playerHasVisiblePoisonPresentation(room, target, timestamp)) return 0;
  let witnesses = 0;
  for (const bot of room.players.values()) {
    if (!bot.isBot || !bot.alive || bot.ejected || bot.inVent || bot.id === target.id) continue;
    if (!botCanDirectlyObservePlayer(room, bot, target)) continue;
    const observation = pruneBotVisibleThrowObservations(bot, timestamp)
      .filter((entry) => entry.visiblePoisonVictims?.[target.id])
      .sort((a, b) => Number(b.poisonLandingObservedAt) - Number(a.poisonLandingObservedAt))[0];
    if (!observation) continue;
    const observedThrower = room.players.get(String(observation.throwerId || ""));
    if (!observedThrower?.alive || observedThrower.ejected || observedThrower.id === bot.id) continue;
    bot.botWitnessTargetId = observedThrower.id;
    bot.botWitnessUntil = timestamp + BOT_STAND_FIRM_RETALIATION_MS;
    bot.botWitnessEvidenceKind = "visual-poison-throw-death";
    bot.navPath = [];
    bot.nextBotActionAt = Math.min(Number(bot.nextBotActionAt) || timestamp, timestamp);
    witnesses += 1;
  }
  return witnesses;
}

function botKnownAttackerEvidence(room, bot, timestamp = now()) {
  // Clairvoyance is an observation route, not a role-reveal route. A bot, like
  // an ordinary user, needs witnessed hostile action, a complete visual poison
  // chain, or visible retaliation evidence before treating someone as hostile.
  // Hidden role/faction, status source, thrown owner, corpse killer and internal
  // death reason are forbidden inputs here.
  const witnessed = room.players.get(String(bot?.botWitnessTargetId || ""));
  if (witnessed?.alive && !witnessed.ejected && Number(bot.botWitnessUntil) > timestamp) return witnessed;
  const retaliatingAgainst = room.players.get(String(bot?.botRetaliationTargetId || ""));
  if (retaliatingAgainst?.alive && !retaliatingAgainst.ejected && Number(bot.botRetaliationUntil) > timestamp) {
    return retaliatingAgainst;
  }
  return null;
}

function botCanCommitLuminous(room, bot, targetId, timestamp = now()) {
  if (!bot?.isBot || bot.role !== "defender" || !botIsEnemyOfSoleHuman(room, bot)) return false;
  if (!bot.alive || bot.ejected || bot.inVent || bot.luminousUsed || bot.smartphoneAction || bot.emergenciesLeft <= 0) return false;
  const knownTarget = botKnownAttackerEvidence(room, bot, timestamp);
  return Boolean(knownTarget && knownTarget.id === String(targetId || ""));
}

function isGboEligibleItemId(itemId) {
  const id = String(itemId || "");
  return id === "hsg" ||
    id === "orichalcum-sword" ||
    id.startsWith("weapon:") ||
    id.startsWith("heavy:") ||
    (id.startsWith("invention:") && Boolean(HACKER_INVENTION_LABELS[id.slice(10)]));
}

function spendHeldPowerMana(room, player, amount, label) {
  const cost = Math.max(0, Number(amount) || 0);
  if (hasFighterInfiniteResources(player)) return false;
  if ((Number(player.mana) || 0) < cost) {
    throw new ApiError(400, `${label}にはマナ ${cost} が必要です。`);
  }
  setMana(room, player, (Number(player.mana) || 0) - cost, label);
  return true;
}

function acceptedEnhanceChargeHoldMs(player, rawHoldMs, timestamp = now()) {
  const startedAt = Number(player?.enhanceChargeStartedAt) || 0;
  if (startedAt <= 0) return 0;
  const releasedAt = Number(player.enhanceChargeReleasedAt) || 0;
  if (releasedAt >= startedAt) return Math.max(0, Number(player.enhanceChargeAcceptedHoldMs) || 0);
  const claimedHoldMs = Math.max(0, Number(rawHoldMs) || 0);
  const observedHoldMs = Math.max(0, timestamp - startedAt);
  return Math.min(claimedHoldMs, observedHoldMs);
}

function finalizeEnhanceChargeState(room, player, rawHoldMs, chargeId = "") {
  const startedAt = Number(player?.enhanceChargeStartedAt) || 0;
  const expectedChargeId = String(player?.enhanceChargeId || "");
  if (startedAt <= 0 || !expectedChargeId || (chargeId && String(chargeId) !== expectedChargeId)) {
    clearEnhanceChargeState(player);
    throw new ApiError(409, "長押し状態が一致しません。もう一度押し直してください。");
  }
  const timestamp = now();
  player.enhanceChargeAcceptedHoldMs = acceptedEnhanceChargeHoldMs(player, rawHoldMs, timestamp);
  player.enhanceChargeReleasedAt = timestamp;
  touch(room);
  return player.enhanceChargeAcceptedHoldMs;
}

function resolveHeldPowerMode(room, player, rawHoldMs, label, options = {}) {
  const expectedKind = String(options.kind || "");
  const expectedItemId = String(options.itemId || "");
  const expectedChargeId = String(options.chargeId || "");
  const startedAt = Number(player?.enhanceChargeStartedAt) || 0;
  if (startedAt <= 0) {
    if (options.allowUnchargedNormal && Math.max(0, Number(rawHoldMs) || 0) < ENHANCE_HOLD_STEP_MS) {
      return Object.freeze({ mode: "normal", enhanceLevel: 0, multiplier: 1, acceptedHoldMs: 0 });
    }
    throw new ApiError(409, "長押し開始が確認できません。もう一度押し直してください。");
  }
  const chargeMatches = (!expectedKind || String(player.enhanceChargeKind || "") === expectedKind) &&
    String(player.enhanceChargeItemId || "") === expectedItemId &&
    (!expectedChargeId || String(player.enhanceChargeId || "") === expectedChargeId);
  if (!chargeMatches) {
    clearEnhanceChargeState(player);
    throw new ApiError(409, "長押し対象が開始時と一致しないため中止しました。");
  }
  const acceptedHoldMs = acceptedEnhanceChargeHoldMs(player, rawHoldMs);
  const gbo = Boolean(options.gboEligible) && acceptedHoldMs >= GBO_HOLD_MS;
  const enhanceLevel = gbo
    ? 0
    : Math.min(ENHANCE_MAX_LEVEL, Math.floor(acceptedHoldMs / ENHANCE_HOLD_STEP_MS));
  clearEnhanceChargeState(player);
  if (gbo) {
    spendHeldPowerMana(room, player, GBO_FIXED_MANA_COST, `${label}・GBO`);
    return Object.freeze({ mode: "gbo", enhanceLevel: 0, multiplier: GBO_PERFORMANCE_MULTIPLIER, acceptedHoldMs });
  }
  if (enhanceLevel > 0) {
    spendHeldPowerMana(room, player, ENHANCE_FIXED_MANA_COST, `${label}・エンハンス`);
    return Object.freeze({ mode: "enhance", enhanceLevel, multiplier: 1, acceptedHoldMs });
  }
  return Object.freeze({ mode: "normal", enhanceLevel: 0, multiplier: 1, acceptedHoldMs });
}

function resolveEnhance(room, player, rawHoldMs, label, options = {}) {
  return resolveHeldPowerMode(room, player, rawHoldMs, label, options).enhanceLevel;
}

function pushGboOverdriveEffect(room, player, itemId, variant = "activate") {
  pushMagicEffect(room, "gbo-overdrive", player, {
    radius: 175,
    playerId: player.id,
    variant: `${variant}:${String(itemId || "gear")}`,
    durationMs: 1_450
  });
}

function clearHsgPreparedOverdrive(player) {
  if (!player) return false;
  const changed = Boolean(player.hsgPreparedMode || player.hsgPreparedEnhanceLevel);
  player.hsgPreparedMode = "";
  player.hsgPreparedEnhanceLevel = 0;
  return changed;
}

function prepareHsgOverdrive(room, player, rawHoldMs = 0, chargeId = "") {
  if (room.phase !== "playing" || !player?.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "現在はHSGを準備できません。");
  }
  ensureAbilityAvailable(player);
  ensureItemStorageAvailable(player);
  if (itemCount(player, "hsg") < 1) throw new ApiError(400, "HSGを所有していません。");
  if (Number(player.hsgUntil) > now() || Number(player.hsgReadyAt) > now()) {
    clearEnhanceChargeState(player);
    throw new ApiError(400, "HSGの作動中またはクールタイム中は準備を変更できません。");
  }
  const power = resolveHeldPowerMode(room, player, rawHoldMs, "HSG", {
    kind: "use",
    itemId: "hsg",
    chargeId,
    gboEligible: true
  });
  if (power.mode === "normal") {
    setImmediateFeedback(player, "HSG", "自動起動待機 / 長押しでEnhance・GBO準備");
    touch(room);
    return power;
  }
  player.hsgPreparedMode = power.mode;
  player.hsgPreparedEnhanceLevel = power.enhanceLevel;
  if (power.mode === "gbo") pushGboOverdriveEffect(room, player, "hsg", "prepared");
  const detail = power.mode === "gbo"
    ? "次回自動起動: 80秒 / ACC 18 / 起動後HSG破壊"
    : `次回自動起動: Enhance Lv${power.enhanceLevel} / ${HSG_BASE_DURATION_MS / 1000 + power.enhanceLevel * HSG_ENHANCE_DURATION_MS_PER_LEVEL / 1000}秒 / ACC ${(HSG_BASE_ACC_MULTIPLIER + power.enhanceLevel * HSG_ENHANCE_ACC_PER_LEVEL).toFixed(1)}`;
  setImmediateFeedback(player, power.mode === "gbo" ? "HSG・GBO準備" : "HSG・Enhance準備", detail);
  pushEvent(room, `${player.name} がHSGの${power.mode === "gbo" ? "GBO" : `Enhance Lv${power.enhanceLevel}`}を次回自動起動へ一回予約しました。`);
  touch(room);
  return power;
}

function clearEnhanceChargeState(player) {
  if (!player) return false;
  const changed = Boolean(
    player.enhanceChargeStartedAt ||
    player.enhanceChargeKind ||
    player.enhanceChargeItemId ||
    player.enhanceChargeId ||
    player.enhanceChargeReleasedAt ||
    player.enhanceChargeAcceptedHoldMs
  );
  player.enhanceChargeStartedAt = 0;
  player.enhanceChargeKind = "";
  player.enhanceChargeItemId = "";
  player.enhanceChargeId = "";
  player.enhanceChargeReleasedAt = 0;
  player.enhanceChargeAcceptedHoldMs = 0;
  return changed;
}

function setEnhanceChargeState(room, player, active, kind = "", itemId = "") {
  if (!active) {
    const changed = clearEnhanceChargeState(player);
    if (changed) touch(room);
    return changed;
  }
  if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "現在はエンハンスを溜められません。");
  }
  ensureAbilityAvailable(player);
  ensureConscious(player);
  const normalizedKind = String(kind || "");
  if (!["shoot", "use", "throw", "fire"].includes(normalizedKind)) throw new ApiError(400, "エンハンス対象が不正です。");
  player.enhanceChargeStartedAt = now();
  player.enhanceChargeKind = normalizedKind;
  player.enhanceChargeItemId = String(itemId || "");
  player.enhanceChargeId = uid("charge_");
  player.enhanceChargeReleasedAt = 0;
  player.enhanceChargeAcceptedHoldMs = 0;
  player.vx = 0;
  player.vy = 0;
  player.movementMode = "idle";
  touch(room);
  return player.enhanceChargeId;
}

function clearBurning(room, player, source = "水") {
  if (!player?.burnStatus) return false;
  player.burnStatus = null;
  pushMagicEffect(room, "status-burn-cleared", player, { radius: 105, playerId: player.id, variant: source });
  setImmediateFeedback(player, "燃焼解除", source);
  return true;
}

function clearPoison(room, player, source = "解毒") {
  if (!player?.poisonStatus) return false;
  player.poisonStatus = null;
  pushMagicEffect(room, "status-poison-cleared", player, { radius: 105, playerId: player.id, variant: source });
  setImmediateFeedback(player, "毒解除", source);
  return true;
}

const ADVERSE_STATUS_DEADLINE_FIELDS = Object.freeze([
  "itemDisabledUntil",
  "slowedUntil",
  "taserSlowedUntil",
  "shockSlowedUntil",
  "gravityStormSlowUntil",
  "unconsciousUntil",
  "gravityPinnedUntil",
  "abilityDisabledUntil",
  "timeStoppedUntil"
]);

function hasNaturalRecovery(room, player) {
  return Boolean(
    room?.phase === "playing" &&
    player?.alive &&
    !player.ejected &&
    isRational(player)
  );
}

function hasActiveAdverseStatus(player, timestamp = now()) {
  return Boolean(
    player?.poisonStatus ||
    player?.burnStatus ||
    ADVERSE_STATUS_DEADLINE_FIELDS.some((field) => Number(player?.[field]) > timestamp)
  );
}

function clearAdverseStatuses(room, player, source = "状態異常回復", timestamp = now()) {
  if (!player) return false;
  const hadTimedStatus = ADVERSE_STATUS_DEADLINE_FIELDS.some((field) => Number(player[field]) > timestamp);
  for (const field of ADVERSE_STATUS_DEADLINE_FIELDS) player[field] = 0;
  player.gravityStormSlowMultiplier = 1;
  if (["unconscious", "time-stopped"].includes(player.movementMode)) {
    player.movementMode = "idle";
  }
  if (player.drone?.movementMode === "time-stopped") player.drone.movementMode = "idle";
  const naturalRecovery = source === "自然回復";
  const clearedBurn = Boolean(player.burnStatus);
  const clearedPoison = Boolean(player.poisonStatus);
  if (naturalRecovery) {
    player.burnStatus = null;
    player.poisonStatus = null;
  } else {
    if (clearedBurn) clearBurning(room, player, source);
    if (clearedPoison) clearPoison(room, player, source);
  }
  return hadTimedStatus || clearedBurn || clearedPoison;
}

function rejectAdverseStatusDuringNaturalRecovery(room, target, label = "状態異常", timestamp = now()) {
  if (!hasNaturalRecovery(room, target)) return false;
  pushMagicEffect(room, "natural-recovery", target, {
    radius: 112,
    playerId: target.id,
    variant: `blocked:${label}`,
    durationMs: 1150
  });
  if (Number(target.statusImmunityFeedbackAt) <= timestamp) {
    target.statusImmunityFeedbackAt = timestamp + HAZARD_TICK_MS;
    setImmediateFeedback(target, "自然回復", `${label}を無効化 / 理知`);
  }
  return true;
}

function maintainNaturalRecovery(room, player, timestamp = now()) {
  if (!hasNaturalRecovery(room, player) || !hasActiveAdverseStatus(player, timestamp)) return false;
  const cleared = clearAdverseStatuses(room, player, "自然回復", timestamp);
  if (cleared) {
    pushMagicEffect(room, "natural-recovery", player, {
      radius: 122,
      playerId: player.id,
      variant: "cleared",
      durationMs: 1350
    });
    player.statusImmunityFeedbackAt = Math.max(Number(player.statusImmunityFeedbackAt) || 0, timestamp + HAZARD_TICK_MS);
    setImmediateFeedback(player, "自然回復", "理知 / 状態異常解除");
  }
  return cleared;
}

function advanceNaturalRecoveryHealth(room, player, elapsedMs) {
  if (!hasNaturalRecovery(room, player)) return false;
  if (player.hackerRootActive || hasFighterInfiniteResources(player)) return false;
  const before = Math.max(0, Number(player.bodyHits) || 0);
  if (before <= 0) return false;
  const elapsedSeconds = Math.min(0.25, Math.max(0, Number(elapsedMs) || 0) / 1000);
  const recovered = Math.min(before, NATURAL_RECOVERY_HP_PER_SECOND * elapsedSeconds);
  if (recovered <= 0) return false;
  player.bodyHits = Number(Math.max(0, before - recovered).toFixed(6));
  return player.bodyHits < before;
}

function applyPersistentStatus(room, source, target, kind, strength = 1, timestamp = now(), options = {}) {
  if (!target?.alive || target.ejected) return false;
  if (rejectAdverseStatusDuringNaturalRecovery(room, target, kind === "poison" ? "毒" : "燃焼", timestamp)) return false;
  if (!options.bypassSlashGuard && resolveFighterSlashGuard(room, source, target, {
    kind,
    label: kind === "poison" ? "毒" : "燃焼",
    physical: false,
    reflectable: false,
    reflectEffect: ({ defender, source: reflectedTarget }) => applyPersistentStatus(
      room,
      defender,
      reflectedTarget,
      kind,
      strength,
      timestamp,
      { ignorePreparationBarrier: true, ignoreFriendlyFire: true, bypassSlashGuard: true }
    )
  }, timestamp)) return false;
  if (!options.ignorePreparationBarrier && absorbPreparationBarrier(room, target, timestamp, source)) return false;
  if (!options.ignoreFriendlyFire && source && source.id !== target.id && source.role === target.role && ["defender", "attacker"].includes(source.role)) {
    applyDefenderFriendlyFirePenalty(room, source, target, timestamp);
    return false;
  }
  if (resolveIaiDestructionUpgrade(room, source, target, kind === "poison" ? "毒攻撃" : "燃焼攻撃", {
    ignoreFriendlyFire: true
  })) {
    checkWin(room);
    touch(room);
    return true;
  }
  const field = kind === "poison" ? "poisonStatus" : "burnStatus";
  const current = target[field];
  const sourceId = String(source?.id || current?.sourceId || "");
  const nextStrength = Math.max(Number(current?.strength) || 0, Math.max(0.25, Number(strength) || 1));
  const shouldEmitActivation = !current || sourceId !== String(current.sourceId || "") || nextStrength > (Number(current.strength) || 0) + 0.001;
  target[field] = {
    sourceId,
    strength: nextStrength,
    nextTickAt: Math.min(Number(current?.nextTickAt) || Infinity, timestamp + HAZARD_TICK_MS)
  };
  if (shouldEmitActivation) {
    pushMagicEffect(room, kind === "poison" ? "status-poison" : "status-burning", target, {
      radius: 105,
      playerId: target.id,
      variant: String(target[field].strength)
    });
  }
  return true;
}

function addHazardField(room, source, kind, x, y, radius, strength = 1, durationMs = HAZARD_FIELD_DURATION_MS) {
  const field = {
    id: uid("hazard_"),
    kind,
    sourceId: String(source?.id || ""),
    x: Math.round(x),
    y: Math.round(y),
    radius: Math.max(40, Number(radius) || 120),
    strength: Math.max(0.25, Number(strength) || 1),
    createdAt: now(),
    endsAt: now() + Math.max(1_000, Number(durationMs) || HAZARD_FIELD_DURATION_MS)
  };
  room.hazardFields.push(field);
  room.hazardFields = room.hazardFields.slice(-32);
  pushMagicEffect(room, kind === "poison" ? "hazard-poison" : kind === "water" ? "hazard-water" : "hazard-fire", field, {
    radius: field.radius,
    playerId: source?.id || "",
    variant: String(field.strength)
  });
  return field;
}

function safeThrowPoint(room, player, targetX = Number.NaN, targetY = Number.NaN) {
  const map = getMap(room);
  const requestedX = Number(targetX);
  const requestedY = Number(targetY);
  const requestedDx = requestedX - player.x;
  const requestedDy = requestedY - player.y;
  const requestedLength = Math.hypot(requestedDx, requestedDy);
  const explicitTarget = Number.isFinite(requestedX) && Number.isFinite(requestedY) && requestedLength > 0.01;
  const direction = explicitTarget
    ? { dx: requestedDx / requestedLength, dy: requestedDy / requestedLength }
    : finiteDirection(player.aimX, player.aimY, 0, 1);
  const throwDistance = explicitTarget ? requestedLength : ITEM_THROW_BASE_DISTANCE;
  for (let ratio = 1; ratio >= 0.15; ratio -= 0.05) {
    const x = clampNumber(player.x + direction.dx * throwDistance * ratio, map.playerRadius, map.width - map.playerRadius, player.x);
    const y = clampNumber(player.y + direction.dy * throwDistance * ratio, map.playerRadius, map.height - map.playerRadius, player.y);
    if (isWalkable(room, x, y, Math.max(12, map.playerRadius * 0.4))) return { x, y, distance: throwDistance * ratio };
  }
  return { x: player.x, y: player.y, distance: 0 };
}

function useMineralWater(room, player, center, level = 0, thrown = false) {
  const radius = thrown ? 135 + level * 38 : 0;
  const timestamp = now();
  const targets = thrown
    ? [...room.players.values()].filter((target) => target.alive && !target.ejected && distance(center, target) <= radius)
    : [player];
  for (const target of targets) {
    clearBurning(room, target, "ミネラルウォーター");
    target.stamina = Math.min(MAX_STORED_STAMINA, Number(target.stamina || 0) + MINERAL_WATER_STAMINA + level * 45);
    target.staminaUpdatedAt = timestamp;
    maintainNaturalRecovery(room, target, timestamp);
  }
  if (thrown) addHazardField(room, player, "water", center.x, center.y, radius, 1 + level * 0.25, 4_500 + level * 1_000);
}

function useAntidote(room, player, center, level = 0, thrown = false) {
  const radius = thrown ? 120 + level * 30 : 0;
  const targets = thrown
    ? [...room.players.values()].filter((target) => target.alive && !target.ejected && distance(center, target) <= radius)
    : [player];
  for (const target of targets) clearPoison(room, target, "解毒剤");
  if (thrown) pushMagicEffect(room, "hazard-antidote", center, { radius, playerId: player.id, variant: String(level) });
}

function applyBottleShardSplash(room, player, itemId, center, level = 0) {
  if (!BOTTLE_ITEM_IDS.has(itemId)) return 0;
  const radius = BOTTLE_SHARD_BASE_RADIUS + level * 16;
  const timestamp = now();
  let hits = 0;
  for (const target of room.players.values()) {
    if (!target.alive || target.ejected || distance(center, target) > radius || Math.random() >= BOTTLE_SHARD_HIT_CHANCE) continue;
    const damage = BOTTLE_SHARD_MIN_DAMAGE + Math.random() * (BOTTLE_SHARD_MAX_DAMAGE - BOTTLE_SHARD_MIN_DAMAGE);
    if (resolveFighterSlashGuard(room, player, target, {
      kind: "bottle-shards",
      label: "瓶の破片",
      physical: true,
      reflectable: true,
      damage,
      hitZone: "body"
    }, timestamp)) continue;
    if (absorbPreparationBarrier(room, target, timestamp, player)) continue;
    if (hasFighterInfiniteResources(target)) {
      syncFighterInfiniteResources(target);
      pushHitEffect(room, target, "body", false);
      continue;
    }
    if (Number(target.overheal) > 0) {
      target.overheal = Math.max(0, Number(target.overheal) - 1);
    } else {
      target.bodyHits = Number(target.bodyHits || 0) + damage;
    }
    hits += 1;
    const lethalThreshold = 2;
    const lethal = Number(target.bodyHits) >= lethalThreshold;
    pushHitEffect(room, target, "body", lethal);
    if (lethal) destroyPlayerUnconditionally(room, null, target, "瓶の破片", { bypassSlashGuard: true });
  }
  pushMagicEffect(room, "bottle-shards", center, {
    radius,
    playerId: player.id,
    variant: `${itemId}:${hits}`
  });
  if (hits > 0) pushEvent(room, `瓶の破片が ${hits} 人に命中しました。`);
  return hits;
}

function itemThrowFlightDuration(distanceToLanding) {
  return Math.round(clampNumber(
    Math.max(0, Number(distanceToLanding) || 0) / ITEM_THROW_SPEED * 1000,
    ITEM_THROW_MIN_FLIGHT_MS,
    ITEM_THROW_MAX_FLIGHT_MS,
    ITEM_THROW_MIN_FLIGHT_MS
  ));
}

function queueThrownItem(room, player, itemId, item, landing, rawPower = 0) {
  const createdAt = now();
  const durationMs = itemThrowFlightDuration(landing.distance);
  const power = rawPower && typeof rawPower === "object"
    ? rawPower
    : { mode: Number(rawPower) > 0 ? "enhance" : "normal", enhanceLevel: Number(rawPower) || 0 };
  const level = power.mode === "gbo" ? 0 : Math.max(0, Math.floor(Number(power.enhanceLevel) || 0));
  const gbo = power.mode === "gbo";
  // This is a Fighter ability augmentation, never a property of the thrown
  // item or of the Orichalcum Sword.
  const energyShockwave = hasOperatorAccess(player, "fighter") && consumeFighterEnergyCharge(player, 1, "ファイター投擲衝撃波");
  room.thrownItems ||= [];
  const thrown = {
    id: uid("throw_"),
    itemId,
    item,
    ownerId: player.id,
    x: Math.round(player.x),
    y: Math.round(player.y),
    targetX: Math.round(landing.x),
    targetY: Math.round(landing.y),
    level,
    gbo,
    energyShockwave,
    createdAt,
    landsAt: createdAt + durationMs
  };
  room.thrownItems.push(thrown);
  room.thrownItems = room.thrownItems.slice(-48);
  pushMagicEffect(room, "action-item-throw", player, {
    radius: 90,
    playerId: player.id,
    targetX: landing.x,
    targetY: landing.y,
    variant: `flight:${itemId}`,
    durationMs
  });
  recordBotVisibleThrowMotion(room, player, thrown, landing, createdAt);
  if (gbo) pushGboOverdriveEffect(room, player, itemId, "throw");
  if (energyShockwave) {
    pushMagicEffect(room, "fighter-energy-release", player, {
      radius: 92,
      playerId: player.id,
      targetX: landing.x,
      targetY: landing.y,
      variant: `throw:remaining-ec-${player.fighterEnergyCharge}`,
      durationMs
    });
  }
  const label = item?.label || ITEM_DEFINITIONS[itemId]?.label || "アイテム";
  pushEvent(room, `${player.name} が${label}を投擲しました${gbo ? "（GBO・接触性能×10・接地時破壊）" : level ? `（エンハンス${level}）` : ""}${energyShockwave ? "。ファイター投擲衝撃波を付与しました" : ""}。`);
  touch(room);
}

function releaseThrownEnergyShockwave(room, source, landing) {
  if (!source?.id) return;
  pushMagicEffect(room, "fighter-energy-impact", landing, {
    radius: FIGHTER_THROW_SHOCKWAVE_RADIUS,
    playerId: source.id,
    durationMs: 880,
    variant: "one-body-damage"
  });
  const targets = [...room.players.values()]
    .filter((target) => target.id !== source.id && target.alive && !target.ejected && distance(landing, target) <= FIGHTER_THROW_SHOCKWAVE_RADIUS)
    .sort((a, b) => distance(landing, a) - distance(landing, b));
  for (const target of targets) {
    if (!source.alive || source.ejected) break;
    try {
      const outcome = killPlayer(room, source, target.id, {
        ranged: true,
        hitZone: "body",
        damage: 1,
        ignoreRange: true,
        ignoreCooldown: true,
        preserveCooldown: true,
        magic: true,
        attackKind: "fighter-energy-shockwave",
        attackLabel: "ファイター投擲衝撃波",
        slashGuardPhysical: true,
        slashGuardReflectable: false,
        slashGuardPerfectEligible: false,
        targetRole: target.role
      });
      pushEvent(room, `${source.name} のファイター投擲衝撃波が ${target.name} に命中しました（${outcome}）。`);
    } catch (error) {
      if (!(error instanceof ApiError)) throw error;
    }
  }
}

function applyThrownImpactDamage(room, source, landing, label, damage, radius, options = {}) {
  const requestedTargetId = String(options.targetId || "");
  const targets = [...room.players.values()]
    .filter((candidate) => candidate.alive && !candidate.ejected && distance(landing, candidate) <= radius)
    .filter((candidate) => !requestedTargetId || candidate.id === requestedTargetId)
    .sort((a, b) => distance(landing, a) - distance(landing, b));
  if (!targets.length) return false;
  const timestamp = now();
  const impactDamage = Math.max(0.1, Number(damage) || 0.1);
  let hitCount = 0;
  for (const target of targets) {
    if (!target.alive || target.ejected) continue;
    if (resolveFighterSlashGuard(room, source, target, {
      kind: "thrown-impact",
      label: `${label}の衝撃`,
      physical: true,
      reflectable: true,
      damage: impactDamage,
      hitZone: "body"
    }, timestamp)) continue;
    if (absorbPreparationBarrier(room, target, timestamp, source)) continue;
    if (source && source.id !== target.id && source.role === target.role && ["defender", "attacker"].includes(source.role)) {
      applyDefenderFriendlyFirePenalty(room, source, target, timestamp);
      continue;
    }
    if (hasFighterInfiniteResources(target)) {
      syncFighterInfiniteResources(target);
      pushHitEffect(room, target, "body", false);
      hitCount += 1;
      continue;
    }
    if (Number(target.overheal) > 0) {
      target.overheal = Math.max(0, Number(target.overheal) - 1);
    } else {
      target.bodyHits = Math.round((Math.max(0, Number(target.bodyHits) || 0) + impactDamage) * 100) / 100;
    }
    const lethal = Number(target.bodyHits) >= 2;
    pushHitEffect(room, target, "body", lethal);
    if (lethal) destroyPlayerUnconditionally(room, source, target, `${label}の衝撃`, { bypassSlashGuard: true });
    hitCount += 1;
  }
  return hitCount > 0;
}

function rigidThrownItemKind(itemId, item = {}) {
  const id = String(itemId || "");
  // Only authored bottle vessels shatter and disappear at landing. Every
  // other physical item, including sealed Uranium/Plutonium containers and
  // HSG, remains as the same recoverable rigid entity after an ordinary throw.
  if (!id || id === "fire-jutsu" || BOTTLE_ITEM_IDS.has(id)) return "";
  if (id === "orichalcum-sword") return "sword";
  if (id.startsWith("weapon:")) return "firearm";
  if (id.startsWith("invention:")) return "invention";
  if (id.startsWith("heavy:")) return "heavy";
  if (item?.kind === "item" && ITEM_DEFINITIONS[id]?.throwable !== false) return "rigid";
  return "";
}

function rigidGroundItemAssetId(itemId) {
  return String(itemId || "").replace(/^(?:weapon:|invention:|heavy:)/, "");
}

function rigidThrownCollision(room, thrown) {
  const startX = Number(thrown?.x) || 0;
  const startY = Number(thrown?.y) || 0;
  const endX = Number(thrown?.targetX) || startX;
  const endY = Number(thrown?.targetY) || startY;
  const dx = endX - startX;
  const dy = endY - startY;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared <= 0.001) return null;
  return [...room.players.values()]
    .filter((target) => (
      target.id !== String(thrown?.ownerId || "") &&
      target.alive &&
      !target.ejected &&
      !target.inVent
    ))
    .map((target) => {
      const along = clampNumber(((target.x - startX) * dx + (target.y - startY) * dy) / lengthSquared, 0, 1, 0);
      const x = startX + dx * along;
      const y = startY + dy * along;
      return { target, along, x, y, missDistance: Math.hypot(target.x - x, target.y - y) };
    })
    .filter((entry) => entry.along > 0.03 && entry.missDistance <= RIGID_THROW_COLLISION_RADIUS)
    .sort((a, b) => a.along - b.along || a.missDistance - b.missDistance)[0] || null;
}

function rigidThrownImpactProfile(target, kind) {
  const severity = luckAdjustedRoll(target);
  const luck = luckValueFor(target);
  if (kind === "sword" && severity >= RIGID_THROW_BLADE_SEVERITY) {
    return { severity, luck, certainKill: true, contact: "blade", damage: 2 };
  }
  const [minimum, maximum] = kind === "firearm"
    ? [0.08, 0.36]
    : kind === "sword"
      ? [0.12, 0.51]
      : [0.10, 0.60];
  const boundedSeverity = kind === "sword"
    ? Math.min(1, severity / RIGID_THROW_BLADE_SEVERITY)
    : severity;
  return {
    severity,
    luck,
    certainKill: false,
    contact: kind === "sword" ? "safe-side" : "body",
    damage: Math.round((minimum + (maximum - minimum) * boundedSeverity) * 100) / 100
  };
}

function applyRigidThrownImpact(room, source, thrown, collision, kind) {
  if (!collision?.target) return null;
  const target = collision.target;
  const label = thrown?.item?.label || ITEM_DEFINITIONS[thrown?.itemId]?.label || "剛体アイテム";
  const profile = rigidThrownImpactProfile(target, kind);
  const gbo = Boolean(thrown?.gbo);
  const impactDamage = profile.damage * (gbo ? GBO_PERFORMANCE_MULTIPLIER : 1);
  const impactRadius = RIGID_THROW_COLLISION_RADIUS * (gbo ? GBO_PERFORMANCE_MULTIPLIER : 1);
  let outcome = "body";
  if (profile.certainKill && source?.alive && !source.ejected) {
    try {
      outcome = killPlayer(room, source, target.id, {
        ranged: true,
        hitZone: "head",
        ignoreRange: true,
        allowAnyKiller: true,
        targetRole: target.role,
        magic: false,
        attackKind: "thrown-sword-blade",
        attackLabel: "投擲オリハルコン剣の刃",
        slashGuardPhysical: true
      });
    } catch (error) {
      if (!(error instanceof ApiError)) throw error;
      outcome = "blocked";
    }
    if (gbo) {
      applyThrownImpactDamage(room, source, { x: collision.x, y: collision.y }, `${label}・GBO`, impactDamage, impactRadius);
    }
  } else {
    applyThrownImpactDamage(
      room,
      source,
      { x: collision.x, y: collision.y },
      label,
      impactDamage,
      impactRadius,
      { targetId: gbo ? "" : target.id }
    );
  }
  pushMagicEffect(room, "rigid-item-impact", { x: collision.x, y: collision.y }, {
    radius: (kind === "sword" ? 112 : 82) * (gbo ? 2.2 : 1),
    playerId: source?.id || "",
    targetId: target.id,
    variant: `${gbo ? "gbo:" : ""}${kind}:${profile.contact}:${impactDamage.toFixed(2)}:luck-${profile.luck.toFixed(2)}`
  });
  const resultText = profile.certainKill
    ? `刃が直撃し確殺判定（${outcome}）`
    : `${impactDamage.toFixed(2)}ダメージ判定`;
  setImmediateFeedback(target, `${label}被弾`, `${resultText} / 幸運 ${profile.luck.toFixed(2)}`);
  pushEvent(room, `${target.name} に投擲された${label}が被弾し、幸運 ${profile.luck.toFixed(2)}から${resultText}になりました。`);
  return { targetId: target.id, outcome, ...profile };
}

function placeRigidGroundItem(room, thrown, landing, kind, impact = null) {
  const itemId = String(thrown?.itemId || "");
  const item = thrown?.item && typeof thrown.item === "object"
    ? { ...thrown.item }
    : { id: itemId, label: ITEM_DEFINITIONS[itemId]?.label || itemId, kind: "item" };
  const angle = Math.atan2(
    (Number(thrown?.targetY) || Number(landing.y) || 0) - (Number(thrown?.y) || 0),
    (Number(thrown?.targetX) || Number(landing.x) || 0) - (Number(thrown?.x) || 0)
  );
  const groundItem = {
    id: uid("ground_item_"),
    itemId,
    item,
    label: item.label || ITEM_DEFINITIONS[itemId]?.label || itemId,
    asset: rigidGroundItemAssetId(itemId),
    kind,
    x: Math.round(Number(landing.x) || 0),
    y: Math.round(Number(landing.y) || 0),
    angle: Math.round(angle * 1000) / 1000,
    pickupRange: GROUND_ITEM_PICKUP_RANGE,
    ownerId: String(thrown?.ownerId || ""),
    createdAt: now(),
    impact
  };
  room.groundItems ||= [];
  room.groundItems.push(groundItem);
  return groundItem;
}

function pickupGroundItem(room, player, groundItemId = "") {
  if (room.phase !== "playing" || !player?.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "現在は接地アイテムを拾えません。");
  }
  ensureConscious(player);
  ensureItemStorageAvailable(player);
  const requestedId = String(groundItemId || "");
  const candidates = (room.groundItems || [])
    .map((groundItem, index) => ({ groundItem, index, distance: distance(player, groundItem) }))
    .filter(({ groundItem, distance: itemDistance }) => (
      (!requestedId || groundItem.id === requestedId) &&
      itemDistance <= Number(groundItem.pickupRange || GROUND_ITEM_PICKUP_RANGE)
    ))
    .sort((a, b) => a.distance - b.distance);
  const selected = candidates[0];
  if (!selected) throw new ApiError(404, "拾える接地アイテムが近くにありません。");
  receiveTransferableItem(player, selected.groundItem.item);
  room.groundItems.splice(selected.index, 1);
  pushMagicEffect(room, "action-item-pickup", player, {
    radius: 84,
    playerId: player.id,
    variant: selected.groundItem.asset
  });
  pushEvent(room, `${player.name} が接地していた${selected.groundItem.label}を拾いました。`);
  touch(room);
  return selected.groundItem;
}

function resolveThrownInventoryLanding(room, source, thrown, landing) {
  const { itemId, level } = thrown;
  const radius = 145 + level * 42;
  if (["mercury", "lead", "uranium", "plutonium"].includes(itemId)) {
    const strength = {
      mercury: 1.15,
      lead: 0.95,
      uranium: 1.55,
      plutonium: 1.9
    }[itemId] + level * 0.35;
    addHazardField(room, source, "poison", landing.x, landing.y, radius, strength);
  } else if (itemId === "molotov" || itemId === "heated-water") {
    addHazardField(room, source, "fire", landing.x, landing.y, radius, 1 + level * 0.4);
  } else if (itemId === "mineral-water") {
    useMineralWater(room, source, landing, level, true);
  } else if (itemId === "antidote") {
    useAntidote(room, source, landing, level, true);
  } else if (itemId === "ice") {
    applyThrownImpactDamage(room, source, landing, ITEM_DEFINITIONS[itemId].label, Math.min(1.75, 0.8 + level * 0.24), radius);
    pushMagicEffect(room, "quantum-ice-impact", landing, { radius, playerId: source?.id || "", variant: String(level) });
  } else {
    applyThrownImpactDamage(room, source, landing, ITEM_DEFINITIONS[itemId]?.label || "アイテム", 0.45 + level * 0.12, 72 + level * 10);
  }
  applyBottleShardSplash(room, source || { id: thrown.ownerId, name: "投擲者" }, itemId, landing, level);
}

function resolveThrownOwnedLanding(room, source, thrown, landing) {
  const { itemId, item, level } = thrown;
  if (itemId === "fire-jutsu") {
    addHazardField(room, source, "fire", landing.x, landing.y, 150 + level * 45, 1 + level * 0.35);
    return;
  }
  const isInvention = itemId.startsWith("invention:");
  const isWeapon = itemId.startsWith("weapon:");
  const multiplier = thrown.gbo ? GBO_PERFORMANCE_MULTIPLIER : 1;
  const damage = (isInvention ? 1.05 + level * 0.2 : isWeapon ? 0.62 + level * 0.15 : 0.45 + level * 0.12) * multiplier;
  const radius = (isInvention ? 120 + level * 16 : isWeapon ? 82 + level * 12 : 72 + level * 10) * multiplier;
  applyThrownImpactDamage(room, source, landing, item?.label || "アイテム", damage, radius);
}

function resolveThrownItemLanding(room, thrown) {
  const source = room.players.get(String(thrown.ownerId || "")) || {
    id: String(thrown.ownerId || "thrower-left"),
    name: "投擲者",
    role: ""
  };
  const intendedLanding = { x: Number(thrown.targetX) || 0, y: Number(thrown.targetY) || 0 };
  const rigidKind = rigidThrownItemKind(thrown.itemId, thrown.item);
  const collision = rigidKind ? rigidThrownCollision(room, thrown) : null;
  const landing = collision
    ? { x: Number(collision.x) || intendedLanding.x, y: Number(collision.y) || intendedLanding.y }
    : intendedLanding;
  let groundItem = null;
  if (rigidKind) {
    const impact = collision ? applyRigidThrownImpact(room, source, thrown, collision, rigidKind) : null;
    if (thrown.gbo) {
      if (!collision) {
        const baseDamage = rigidKind === "sword" ? 0.51 : rigidKind === "firearm" ? 0.36 : rigidKind === "invention" ? 1.05 : 0.6;
        applyThrownImpactDamage(room, source, landing, `${thrown.item?.label || "武具"}・GBO`, baseDamage * GBO_PERFORMANCE_MULTIPLIER, RIGID_THROW_COLLISION_RADIUS * GBO_PERFORMANCE_MULTIPLIER);
      }
      pushMagicEffect(room, "gbo-overdrive", landing, {
        radius: 205,
        playerId: source?.id || "",
        variant: `impact:${thrown.itemId}`,
        durationMs: 1_450
      });
    } else {
      groundItem = placeRigidGroundItem(room, thrown, landing, rigidKind, impact);
    }
  } else if (ITEM_DEFINITIONS[thrown.itemId]) {
    resolveThrownInventoryLanding(room, source, thrown, landing);
    recordBotVisiblePoisonLanding(room, thrown, landing, now());
  } else {
    resolveThrownOwnedLanding(room, source, thrown, landing);
  }
  if (thrown.energyShockwave) releaseThrownEnergyShockwave(room, source, landing);
  pushMagicEffect(room, "action-item-throw", landing, {
    radius: 110 + Number(thrown.level || 0) * 14,
    variant: `impact:${thrown.itemId}`,
    durationMs: 950
  });
  const label = thrown.item?.label || ITEM_DEFINITIONS[thrown.itemId]?.label || "アイテム";
  pushEvent(room, groundItem
    ? `${label}は${collision ? "被弾地点" : "接地点"}へ剛体のまま残りました。誰でも拾えます。`
    : `${label}は接地して破壊され、効果が発動しました。`);
  checkWin(room);
  touch(room);
}

function advanceThrownItems(room, timestamp = now(), elapsedMs = 0) {
  const timeKeeperActive = roomTimeKeeperActive(room, timestamp);
  const pending = [];
  for (const thrown of room.thrownItems || []) {
    if (timeKeeperActive) {
      const elapsed = Math.max(0, Number(elapsedMs) || 0);
      thrown.createdAt = (Number(thrown.createdAt) || timestamp) + elapsed;
      thrown.landsAt = (Number(thrown.landsAt) || timestamp) + elapsed;
      pending.push(thrown);
      continue;
    }
    if (Number(thrown.landsAt) > timestamp) pending.push(thrown);
    else resolveThrownItemLanding(room, thrown);
  }
  room.thrownItems = pending;
}

function throwInventoryItem(room, player, itemId, rawHoldMs = 0, targetX = Number.NaN, targetY = Number.NaN, chargeId = "") {
  if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent) throw new ApiError(403, "現在は投擲できません。");
  ensureAbilityAvailable(player);
  ensureItemStorageAvailable(player);
  if (!ITEM_DEFINITIONS[itemId]) throw new ApiError(400, "投擲対象が不正です。");
  if (ITEM_DEFINITIONS[itemId].throwable === false) throw new ApiError(400, `${ITEM_DEFINITIONS[itemId].label}は投擲できません。`);
  if (itemCount(player, itemId) < 1) throw new ApiError(400, `${ITEM_DEFINITIONS[itemId].label}を所持していません。`);
  const power = resolveHeldPowerMode(room, player, rawHoldMs, ITEM_DEFINITIONS[itemId].label, {
    kind: "throw",
    itemId,
    chargeId,
    gboEligible: itemId === "orichalcum-sword" || itemId === "hsg"
  });
  const landing = safeThrowPoint(room, player, targetX, targetY);
  if (landing.distance > 700) markSoloMissionAction(room, player, "clairvoyance");
  consumeItem(player, itemId);
  if (itemId === "hsg") clearHsgPreparedOverdrive(player);
  queueThrownItem(room, player, itemId, { id: itemId, label: ITEM_DEFINITIONS[itemId].label, kind: "item" }, landing, power);
}

function throwOwnedItem(room, player, itemId, rawHoldMs = 0, targetX = Number.NaN, targetY = Number.NaN, chargeId = "") {
  if (ITEM_DEFINITIONS[itemId]) return throwInventoryItem(room, player, itemId, rawHoldMs, targetX, targetY, chargeId);
  if (INSTANT_ITEM_DEFINITIONS[itemId]) throw new ApiError(400, `${INSTANT_ITEM_DEFINITIONS[itemId].label}は即席のため投擲できません。`);
  if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent) throw new ApiError(403, "現在は投擲できません。");
  ensureAbilityAvailable(player);
  ensureItemStorageAvailable(player);
  const owned = transferableItemsFor(player).find((entry) => entry.id === itemId);
  const label = TRANSFERABLE_CHARGES[itemId]?.label || owned?.label || "アイテム";
  if (!owned && !TRANSFERABLE_CHARGES[itemId]) throw new ApiError(400, "その武具を所持していません。");
  const power = resolveHeldPowerMode(room, player, rawHoldMs, label, {
    kind: "throw",
    itemId,
    chargeId,
    gboEligible: isGboEligibleItemId(itemId)
  });
  const landing = safeThrowPoint(room, player, targetX, targetY);
  if (landing.distance > 700) markSoloMissionAction(room, player, "clairvoyance");
  const item = removeTransferableItem(room, player, itemId, 1);
  queueThrownItem(room, player, itemId, item, landing, power);
}

function useInventoryItem(room, player, itemId, rawHoldMs = 0, chargeId = "") {
  if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent) throw new ApiError(403, "現在は使用できません。");
  ensureAbilityAvailable(player);
  ensureItemStorageAvailable(player);
  const definition = ITEM_DEFINITIONS[itemId];
  if (!definition) throw new ApiError(400, "使用対象が不正です。");
  if (definition.usable === false) throw new ApiError(400, `${definition.label}は通常使用できません。`);
  if (itemCount(player, itemId) < 1) throw new ApiError(400, `${definition.label}を所持していません。`);
  const power = resolveHeldPowerMode(room, player, rawHoldMs, definition.label, {
    kind: "use",
    itemId,
    chargeId,
    gboEligible: itemId === "orichalcum-sword"
  });
  const level = power.enhanceLevel;
  if (itemId === "orichalcum-sword") {
    return fighterSlash(room, player, "", true, power);
  }
  consumeItem(player, itemId);
  if (itemId === "mineral-water") {
    useMineralWater(room, player, player, level, false);
  } else if (itemId === "antidote") {
    useAntidote(room, player, player, level, false);
  } else if (["mercury", "lead", "uranium", "plutonium"].includes(itemId)) {
    const strength = {
      mercury: 1.15,
      lead: 0.95,
      uranium: 1.55,
      plutonium: 1.9
    }[itemId] + level * 0.35;
    const applied = applyPersistentStatus(room, player, player, "poison", strength, now(), { ignorePreparationBarrier: true });
    if (applied) setImmediateFeedback(player, "有害物質曝露", `${definition.label} / 毒強度${strength.toFixed(2)}`);
  } else if (itemId === "molotov" || itemId === "heated-water") {
    const strength = 1 + level * 0.4;
    const applied = applyPersistentStatus(room, player, player, "burn", strength, now(), { ignorePreparationBarrier: true });
    if (applied) setImmediateFeedback(player, "燃焼", `${definition.label} / 燃焼強度${strength.toFixed(2)}`);
  } else if (itemId === "ice") {
    const damage = Math.min(1.75, 0.65 + level * 0.22);
    player.bodyHits = Math.round((Math.max(0, Number(player.bodyHits) || 0) + damage) * 100) / 100;
    const timestamp = now();
    if (!rejectAdverseStatusDuringNaturalRecovery(room, player, "低温減速", timestamp)) {
      player.taserSlowedUntil = Math.max(Number(player.taserSlowedUntil) || 0, timestamp + 5_000 + level * 1_000);
    }
    const lethal = player.bodyHits >= 2;
    pushHitEffect(room, player, "body", lethal);
    if (lethal) destroyPlayerUnconditionally(room, player, player, "氷結水の直接使用");
    setImmediateFeedback(player, "低温障害", `${damage.toFixed(2)}ダメージ`);
  } else {
    throw new ApiError(400, "この所持品は通常使用できません。");
  }
  pushMagicEffect(room, "action-item-use", player, { radius: 90, playerId: player.id, variant: itemId });
  pushEvent(room, `${player.name} が${definition.label}を使用しました${level ? `（エンハンス${level}）` : ""}。`);
  checkWin(room);
  touch(room);
}

function useOwnedItem(room, player, itemId, rawHoldMs = 0, chargeId = "") {
  if (itemId === "hsg") return prepareHsgOverdrive(room, player, rawHoldMs, chargeId);
  if (ITEM_DEFINITIONS[itemId]) return useInventoryItem(room, player, itemId, rawHoldMs, chargeId);
  if (itemId === "fire-jutsu") return useFireJutsu(room, player, rawHoldMs, chargeId);
  if (itemId === "instant-warp") throw new ApiError(400, "テレポートマップスクロールは即席です。拡大マップからテレポート権利を行使してください。");
  if (["substitution", "stand-firm", "push", "iai"].includes(itemId)) {
    throw new ApiError(400, "このアイテムは条件成立時に自動発動します。");
  }
  if (itemId.startsWith("weapon:")) {
    switchGunnerWeapon(room, player, itemId.slice(7));
    return;
  }
  throw new ApiError(400, "この所持品は専用操作から使用してください。");
}

function normalizeQuantumMode(rawMode) {
  const mode = String(rawMode || "nuclear-transmutation");
  return {
    "transmute-mercury": "nuclear-transmutation",
    "transmute-lead": "nuclear-transmutation",
    "cool-water": "kinetic-decelerate",
    "heat-water": "kinetic-accelerate",
    "fission-uranium": "nuclear-fission",
    "fission-plutonium": "nuclear-fission"
  }[mode] || mode;
}

function firstHeldQuantumItem(player, itemIds) {
  return itemIds.find((itemId) => itemCount(player, itemId) > 0) || "";
}

function useQuantumControl(room, player, rawMode) {
  if (room.phase !== "playing" || !hasOperatorAccess(player, "quantum") || !player.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "クオンタムを使用できません。");
  }
  const mode = normalizeQuantumMode(rawMode || player.quantumMode || "nuclear-transmutation");
  if (!["kinetic-accelerate", "kinetic-decelerate", "nuclear-transmutation", "nuclear-fission"].includes(mode)) {
    throw new ApiError(400, "クオンタム方式が不正です。");
  }
  player.quantumMode = mode;
  const itemId = mode === "nuclear-transmutation"
    ? firstHeldQuantumItem(player, ["lead", "mercury"])
    : mode === "nuclear-fission"
      ? firstHeldQuantumItem(player, ["uranium", "plutonium"])
      : firstHeldQuantumItem(player, ["mineral-water"]);
  // A Quantum activation without a compatible held item is a strict silent
  // no-op. This check must precede availability/cost checks and every effect.
  if (!itemId) return false;
  ensureAbilityAvailable(player);
  if (Number(player.stamina) < QUANTUM_ACTION_STAMINA_COST) throw new ApiError(400, `クオンタムには${QUANTUM_ACTION_STAMINA_COST}SPが必要です。`);
  if (mode === "nuclear-fission" && Number(player.mana) < QUANTUM_NUCLEAR_MANA_COST) {
    throw new ApiError(400, `核分裂には${QUANTUM_NUCLEAR_MANA_COST}MPが必要です。`);
  }
  spendStamina(player, QUANTUM_ACTION_STAMINA_COST, room, "クオンタム");
  if (mode === "nuclear-transmutation") {
    consumeItem(player, itemId);
    const credits = acquireGoldAsCredits(room, player, `quantum-gold:${itemId}`);
    pushMagicEffect(room, "quantum-transmutation", player, {
      radius: 150,
      playerId: player.id,
      variant: itemId,
      durationMs: 3600
    });
    pushEvent(room, `${player.name} が${ITEM_DEFINITIONS[itemId].label}を金へ核変換し、${credits}Cへ自動換金しました。`);
  } else if (mode === "kinetic-decelerate" || mode === "kinetic-accelerate") {
    consumeItem(player, "mineral-water");
    const output = mode === "kinetic-decelerate" ? "ice" : "heated-water";
    addItem(player, output);
    pushMagicEffect(room, mode === "kinetic-decelerate" ? "quantum-temperature-cold" : "quantum-temperature-hot", player, {
      radius: 135,
      playerId: player.id,
      variant: output
    });
    pushEvent(room, `${player.name} が運動エネルギーを${mode === "kinetic-decelerate" ? "減速させて氷結水" : "加速させて高温水"}を生成しました。`);
  } else if (mode === "nuclear-fission") {
    consumeItem(player, itemId);
    spendMana(room, player, QUANTUM_NUCLEAR_MANA_COST, "核分裂");
    const targets = [...room.players.values()].filter((target) => target.id !== player.id && target.alive && !target.ejected && !target.exiled);
    for (const target of targets) destroyPlayerUnconditionally(room, player, target, "核分裂連鎖", {
      attackKind: "nuclear-fission",
      attackLabel: "核分裂連鎖",
      slashGuardPhysical: false,
      slashGuardReflectable: false,
      reflectDestroy: true
    });
    pushMagicEffect(room, "quantum-nuclear", player, { radius: Math.max(getMap(room).width, getMap(room).height), playerId: player.id, variant: itemId });
    checkWin(room);
    if (room.phase !== "ended" && !player.exiled) destroyPlayerUnconditionally(room, player, player, "核分裂の代償");
    pushEvent(room, `${player.name} が${ITEM_DEFINITIONS[itemId].label}へ中性子を作用させ、核分裂の連鎖を開始しました。`);
  }
  checkWin(room);
  touch(room);
  return true;
}

function advanceHazards(room, timestamp = now()) {
  room.hazardFields = (room.hazardFields || []).filter((field) => Number(field.endsAt) > timestamp);
  for (const field of room.hazardFields) {
    if (Number(field.nextTickAt) > timestamp) continue;
    field.nextTickAt = timestamp + HAZARD_TICK_MS;
    const source = room.players.get(field.sourceId) || null;
    for (const target of room.players.values()) {
      if (!target.alive || target.ejected || distance(field, target) > field.radius || (field.excludeSource && target.id === field.sourceId)) continue;
      if (field.kind === "water") clearBurning(room, target, "散水");
      else applyPersistentStatus(room, source, target, field.kind, field.strength, timestamp);
    }
  }
  recordBotVisiblePoisonPresentations(room, timestamp);
  for (const target of room.players.values()) {
    maintainNaturalRecovery(room, target, timestamp);
    for (const [field, kind, baseDamage] of [["poisonStatus", "毒", POISON_DAMAGE_PER_TICK], ["burnStatus", "燃焼", BURN_DAMAGE_PER_TICK]]) {
      const status = target[field];
      if (!status || !target.alive || target.ejected) continue;
      if (Number(status.nextTickAt) > timestamp) continue;
      const source = room.players.get(status.sourceId) || null;
      status.nextTickAt = timestamp + HAZARD_TICK_MS;
      const damage = baseDamage * Math.max(0.25, Number(status.strength) || 1);
      if (resolveFighterSlashGuard(room, source, target, {
        kind: field === "poisonStatus" ? "poison" : "burn",
        label: kind,
        physical: false,
        reflectable: false,
        damage,
        hitZone: "body"
      }, timestamp)) continue;
      if (absorbPreparationBarrier(room, target, timestamp, source)) continue;
      if (hasFighterInfiniteResources(target)) {
        syncFighterInfiniteResources(target);
        pushHitEffect(room, target, "body", false);
        continue;
      }
      const threshold = 2;
      target.bodyHits = Math.round((Math.max(0, Number(target.bodyHits) || 0) + damage) * 100) / 100;
      pushHitEffect(room, target, "body", target.bodyHits >= threshold);
      if (target.bodyHits >= threshold) {
        const destroyed = destroyPlayerUnconditionally(room, source, target, kind);
        if (destroyed) target[field] = null;
      } else {
        setImmediateFeedback(target, kind, `${damage.toFixed(2)}継続ダメージ`);
      }
    }
  }
}

function useFireJutsu(room, player, rawHoldMs = 0, chargeId = "") {
  if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "現在は火遁の術を使用できません。");
  }
  ensureAbilityAvailable(player);
  ensureItemStorageAvailable(player);
  if (player.fireJutsuCharges <= 0) throw new ApiError(400, "火遁の術を所持していません。");
  const enhance = resolveEnhance(room, player, rawHoldMs, "火遁の術", {
    kind: String(player.enhanceChargeKind || "fire"),
    itemId: "fire-jutsu",
    chargeId,
    gboEligible: false
  });
  const radius = FIRE_JUTSU_RADIUS + enhance * 75;
  const origin = { x: player.x, y: player.y, id: player.id };
  player.fireJutsuCharges -= 1;
  pushMagicEffect(room, "fire", origin, { radius, playerId: player.id, variant: String(enhance) });
  pushSound(room, "fireJutsu", origin, {
    ownerId: player.id,
    sourceKind: "magic",
    maxDistance: 2200,
    volume: 1
  });

  const fireField = addHazardField(room, player, "fire", origin.x, origin.y, radius, 1 + enhance * 0.35);
  fireField.excludeSource = true;
  pushEvent(room, `${player.name} が火遁の術を発動し、燃焼領域を展開しました${enhance ? `（エンハンス${enhance}）` : ""}。`);
  checkWin(room);
  touch(room);
}

function useTeleportMapScroll(room, player, rawX, rawY) {
  if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "現在はテレポートできません。");
  }
  ensureAbilityAvailable(player);
  if (player.warpCharges <= 0) throw new ApiError(400, "テレポート可能回数がありません。");
  const destination = resolveExpandedMapTeleportDestination(room, rawX, rawY);
  const origin = moveByExpandedMapTeleport(player, destination);
  player.warpCharges -= 1;
  pushMagicEffect(room, "action-warp", origin, {
    radius: 125,
    playerId: player.id,
    targetX: destination.x,
    targetY: destination.y
  });
  pushMagicEffect(room, "action-warp", player, {
    radius: 125,
    playerId: player.id,
    variant: "arrival"
  });
  pushEvent(room, `${player.name} がテレポートマップスクロールの権利を行使しました。`);
  touch(room);
}

function healFlora(room, player) {
  if (room.phase !== "playing" || !hasOperatorAccess(player, "flora")) {
    throw new ApiError(403, "フローラだけが回復できます。");
  }
  if (!player.alive || player.ejected || player.inVent) throw new ApiError(403, "現在は回復できません。");
  ensureAbilityAvailable(player);
  const timestamp = now();
  spendOperatorMana(room, player, "フローラ");
  if (player.bodyHits > 0) player.bodyHits = 0;
  else player.overheal = Math.max(0, Number(player.overheal) || 0) + 1;
  clearAdverseStatuses(room, player, "フローラ回復", timestamp);
  player.stamina = Math.min(MAX_STORED_STAMINA, Math.max(0, Number(player.stamina) || 0) + MAX_STAMINA);
  addTimedAcceleration(player, "flora", FLORA_SPEED_MULTIPLIER, FLORA_SPEED_DURATION_MS, timestamp);
  player.floraReadyAt = 0;
  setImmediateFeedback(player, "フローラ回復", `自分 / HP回復 / SP+${MAX_STAMINA} / 状態解除 / 加速`);
  awardAbilityContribution(player, 1);
  pushMagicEffect(room, "flora", player, { radius: FLORA_SELF_EFFECT_RADIUS, playerId: player.id });
  pushGainAte(room, player, "heal", { variant: "flora" });
  pushGainAte(room, player, "stamina", { variant: "flora", durationMs: 1620 });
  pushGainAte(room, player, "statusRecovery", { variant: "flora", durationMs: 1740 });
  pushEvent(room, `${player.name} がフローラを発動し、自分へ回復・スタミナ・状態解除・加速を付与しました。`);
  touch(room);
}

function floraSunbeam(room, player, targetId = "", direction = {}) {
  if (room.phase !== "playing" || !hasOperatorAccess(player, "flora") || !player.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "現在はサンビームを使用できません。");
  }
  ensureAbilityAvailable(player);
  spendOperatorMana(room, player, "サンビーム");
  const trackedCandidate = room.players.get(String(targetId || ""));
  const tracked = trackedCandidate &&
    trackedCandidate.id !== player.id &&
    trackedCandidate.alive &&
    !trackedCandidate.ejected
      ? trackedCandidate
      : null;
  let dx = Number(direction.dx);
  let dy = Number(direction.dy);
  if (!Number.isFinite(dx) || !Number.isFinite(dy) || Math.hypot(dx, dy) < 0.01) {
    dx = Number(player.aimX) || 0;
    dy = Number(player.aimY) || 1;
  }
  if (tracked?.alive && !tracked.ejected) {
    dx = tracked.x - player.x;
    dy = tracked.y - player.y;
  }
  const length = Math.hypot(dx, dy) || 1;
  dx /= length;
  dy /= length;
  const variantIndex = Math.abs(Math.floor((player.x + player.y) / 180)) % 3;
  const opticalVariant = ["refraction", "scattering", "diffraction"][variantIndex];
  const candidates = [...room.players.values()]
    .filter((target) => target.id !== player.id && target.alive && !target.ejected)
    .map((target) => {
      const rx = target.x - player.x;
      const ry = target.y - player.y;
      return { target, along: rx * dx + ry * dy, perpendicular: Math.abs(rx * dy - ry * dx) };
    })
    .filter((entry) => entry.along > 0 && entry.along <= SUNBEAM_RANGE && entry.perpendicular <= SUNBEAM_WIDTH)
    .sort((a, b) => a.along - b.along);
  // One canonical Sunbeam combines target-directed convergence with full-ray
  // piercing. Every valid body intersecting the ray receives its own
  // independent guard, barrier, dodge, and certain-kill resolution.
  const selected = candidates;
  let hits = 0;
  for (const entry of selected) {
    if (!player.alive || player.ejected || !entry.target?.alive || entry.target.ejected) break;
    killPlayer(room, player, entry.target.id, {
      ranged: true,
      hitZone: "head",
      damage: 1,
      ignoreRange: true,
      allowAnyKiller: true,
      targetRole: entry.target.role,
      magic: true,
      attackKind: "sunbeam",
      attackLabel: "サンビーム",
      slashGuardPhysical: false
    });
    hits += 1;
  }
  const end = { x: player.x + dx * SUNBEAM_RANGE, y: player.y + dy * SUNBEAM_RANGE };
  pushMagicEffect(room, "flora-sunbeam", player, {
    radius: SUNBEAM_WIDTH * 2,
    targetX: end.x,
    targetY: end.y,
    playerId: player.id,
    variant: `${opticalVariant}:piercing`
  });
  pushSound(room, "sunbeam", player, { ownerId: player.id, sourceKind: "magic", maxDistance: 2100, volume: 0.9 });
  awardAbilityContribution(player, hits ? 1 : 0.25);
  pushEvent(room, `${player.name} がサンビームを発動しました（${opticalVariant}・判定${hits}人）。`);
  checkWin(room);
  touch(room);
}

function useFloraAbility(room, player, mode, options = {}) {
  const selected = mode === "sunbeam" ? "sunbeam" : "heal";
  player.floraMode = selected;
  if (selected === "sunbeam") {
    floraSunbeam(room, player, String(options.targetId || ""), {
      dx: options.dx,
      dy: options.dy
    });
  }
  else healFlora(room, player);
}

const ALCHEMY_RECIPE_IMPLEMENTATIONS = {
  "orichalcum-sword": { label: "オリハルコン・ソード", cost: 0, apply: (_room, player) => addItem(player, "orichalcum-sword") },
  stamina: { label: "スタミナ", cost: 1, apply: (room, player) => { const timestamp = now(); player.stamina = Math.min(MAX_STORED_STAMINA, player.stamina + 350); player.staminaUpdatedAt = timestamp; maintainNaturalRecovery(room, player, timestamp); pushInstantItemAcquisitionAte(room, player, "stamina", "hacker"); } },
  hsg: { label: "HSG", cost: 0, apply: (_room, player) => acquirePhysicalHsg(player) },
  heal: { label: "回復", cost: 1, apply: (room, player) => { if (player.bodyHits > 0) player.bodyHits = 0; else player.overheal = Math.max(0, Number(player.overheal) || 0) + 1; pushInstantItemAcquisitionAte(room, player, "heal", "hacker"); } },
  fire: { label: "火遁の術", cost: 1, apply: (room, player) => { player.fireJutsuCharges += 1; pushInstantItemAcquisitionAte(room, player, "fire", "hacker"); } },
  substitution: { label: "変わり身の術", cost: 1, apply: (room, player) => { player.substitutionCharges += 1; pushInstantItemAcquisitionAte(room, player, "substitution", "hacker"); } },
  warp: { label: "テレポートマップスクロール", cost: 1, apply: (room, player) => { player.warpCharges += 1; pushInstantItemAcquisitionAte(room, player, "warp", "hacker"); } },
  grit: { label: "踏ん張り", cost: 1, apply: (room, player) => grantStandFirmCharge(room, player, false, "hacker") },
  reason: { label: "押し込み", cost: 1, apply: (room, player) => grantPushCharge(room, player, false, "hacker") },
  mercury: { label: "水銀瓶", cost: 0, apply: (_room, player) => addItem(player, "mercury") },
  lead: { label: "鉛瓶", cost: 0, apply: (_room, player) => addItem(player, "lead") },
  uranium: { label: "ウラン容器", cost: 0, apply: (_room, player) => addItem(player, "uranium") },
  plutonium: { label: "プルトニウム容器", cost: 0, apply: (_room, player) => addItem(player, "plutonium") },
  "mineral-water": { label: "ミネラルウォーター", cost: 0, apply: (_room, player) => addItem(player, "mineral-water") },
  antidote: { label: "解毒剤", cost: 0, apply: (_room, player) => addItem(player, "antidote") },
  molotov: { label: "火炎瓶", cost: 0, apply: (_room, player) => addItem(player, "molotov") },
  iai: { label: "居合", cost: 1, apply: (room, player) => grantIaiCharge(room, player, false, "hacker") },
  "vending-evade": { label: "回避拡張", cost: 0, apply: (room, player) => { player.dodgeDurationBonusMs = Math.min(1500, player.dodgeDurationBonusMs + 250); pushInstantItemAcquisitionAte(room, player, "evade", "hacker"); } },
  "vending-speed": { label: "アクセラレート飲料", cost: 0, apply: (room, player) => { player.speedMultiplier = Math.round((player.speedMultiplier + 0.15) * 100) / 100; pushInstantItemAcquisitionAte(room, player, "speed", "hacker"); } },
  "vending-mystery": { label: "ミステリー", cost: 0, apply: (room, player) => { const result = applyMysteryDrink(room, player); pushInstantItemAcquisitionAte(room, player, "mystery", `hacker:${result}`); } },
  "vending-mana": { label: "マナポーション", cost: 0, apply: (room, player) => { setMana(room, player, (Number(player.mana) || 0) + 1, "バイブコーディング"); pushInstantItemAcquisitionAte(room, player, "mana", "hacker"); } },
  "vending-railgun": { label: "レールガン", cost: 0, apply: (_room, player) => { if (!player.inventions.includes("railgun")) player.inventions.push("railgun"); } },
  "vending-particle-cannon": { label: "荷電粒子砲", cost: 0, apply: (_room, player) => { if (!player.inventions.includes("particle-cannon")) player.inventions.push("particle-cannon"); } },
  "vending-excalibur": { label: "エクスカリバー", cost: 0, apply: (_room, player) => { if (!player.inventions.includes("excalibur")) player.inventions.push("excalibur"); } },
  "vending-exile": { label: "亡命", cost: 0, apply: (_room, player) => { player.exiled = true; } },
  "vending-computer": { label: "パソコン", cost: 0, apply: (_room, player) => activateComputerInstant(player) },
  "vending-handgun": { label: "ハンドガン", cost: 0, apply: (_room, player) => purchaseFirearm(player, "handgun") },
  "vending-smg": { label: "サブマシンガン", cost: 0, apply: (_room, player) => purchaseFirearm(player, "smg") },
  "vending-assault": { label: "アサルトライフル", cost: 0, apply: (_room, player) => purchaseFirearm(player, "assault") },
  "vending-sniper": { label: "スナイパーライフル", cost: 0, apply: (_room, player) => purchaseFirearm(player, "sniper") },
  "vending-taser": { label: "テーザー銃", cost: 0, apply: (_room, player) => purchaseFirearm(player, "taser") },
  "vending-ice": { label: "氷結水", cost: 0, apply: (_room, player) => addItem(player, "ice") },
  "vending-heated-water": { label: "高温水", cost: 0, apply: (_room, player) => addItem(player, "heated-water") },
  gold: { label: "金", cost: 0, apply: (room, player) => { acquireGoldAsCredits(room, player, "hacker-gold"); } },
  "vending-rpg": { label: "RPG", cost: 0, apply: (_room, player) => { (player.heavyWeapons ||= []).push("rpg"); } },
  "vending-missile": { label: "ミサイル", cost: 0, apply: (_room, player) => { (player.heavyWeapons ||= []).push("missile"); } },
  "hack-credits-delete": { label: "クレジット削除", cost: 2, apply: (room, player, targetId) => { hackerTarget(room, player, targetId).credits = 0; } },
  "hack-credits-duplicate": { label: "クレジット増殖", cost: 2, apply: (room, player, targetId) => { const target = hackerTarget(room, player, targetId); target.credits = Math.max(0, Number(target.credits) || 0) * 2 + CREDIT_ECONOMY.hackerDuplicateBonus; } },
  "hack-items-delete": { label: "アイテム削除", cost: 2, apply: (room, player, targetId) => clearHackableInventory(hackerTarget(room, player, targetId)) },
  "hack-items-duplicate": { label: "アイテム増殖", cost: 2, apply: (room, player, targetId) => duplicateHackableInventory(hackerTarget(room, player, targetId)) },
  "hack-hp-delete": { label: "HP削除", cost: 2, apply: (room, player, targetId) => deleteHackerTargetHp(room, player, targetId) },
  "hack-hp-duplicate": { label: "HP増殖", cost: 2, apply: (room, player, targetId) => { const target = hackerTarget(room, player, targetId); target.bodyHits = 0; target.overheal = Math.max(1, target.overheal); } },
  "hack-mana-delete": { label: "マナ削除", cost: 2, apply: (room, player, targetId) => setMana(room, hackerTarget(room, player, targetId), 0, "バイブコーディング") },
  "hack-mana-duplicate": { label: "マナ増殖", cost: 2, apply: (room, player, targetId) => { const target = hackerTarget(room, player, targetId); setMana(room, target, Math.max(2, Number(target.mana) || 0) * 2, "バイブコーディング"); } },
  "hack-status-recover": { label: "状態異常回復", cost: 0, apply: (room, player, targetId) => recoverHackerTargetStatus(room, player, targetId) },
  revive: { label: "人体生成", cost: 3, apply: (room, player, targetId) => humanTransmutation(room, player, targetId) }
};

// Vending and Vibe Coding use one runtime catalog membership. Only behavior is
// implemented here; identity, label, category, availability and CT are always
// derived from DVA_ECONOMY so a new sellable product cannot disappear from the
// Hacker generator because somebody forgot a second display list.
const HACKER_EXTENSION_RECIPE_IDS = new Set([
  "hack-credits-delete", "hack-credits-duplicate", "hack-items-delete",
  "hack-items-duplicate", "hack-hp-delete", "hack-hp-duplicate", "hack-mana-delete",
  "hack-mana-duplicate", "hack-status-recover", "revive"
]);
const ALCHEMY_RECIPES = Object.fromEntries([
  ...DVA_ECONOMY.products.map((product) => {
    const implementation = ALCHEMY_RECIPE_IMPLEMENTATIONS[product.hackerRecipeId];
    if (!implementation) throw new Error(`Missing Hacker behavior for shared product: ${product.id}`);
    return [product.hackerRecipeId, { ...implementation, label: product.label, productId: product.id }];
  }),
  ...[...HACKER_EXTENSION_RECIPE_IDS].map((id) => {
    const implementation = ALCHEMY_RECIPE_IMPLEMENTATIONS[id];
    if (!implementation) throw new Error(`Missing Hacker extension behavior: ${id}`);
    return [id, implementation];
  })
]);

const ALCHEMY_RECIPE_ALIASES = Object.freeze({
  "stand-firm": "grit",
  push: "reason",
  "instant-warp": "warp",
  "fire-jutsu": "fire",
  "vending-mineral-water": "mineral-water",
  "vending-molotov": "molotov",
  "vending-antidote": "antidote"
});

function canonicalAlchemyConversion(rawConversion) {
  const requested = String(rawConversion || "stamina").trim().toLowerCase();
  return ALCHEMY_RECIPE_ALIASES[requested] || requested;
}

function hackerTarget(room, player, targetId) {
  const target = room.players.get(String(targetId || "")) || [...room.players.values()]
    .filter((candidate) => candidate.id !== player.id && !candidate.ejected)
    .sort((a, b) => distance(player, a) - distance(player, b))[0];
  if (!target || target.ejected) throw new ApiError(404, "バイブコーディング対象がいません。");
  return target;
}

function clearHackableInventory(target) {
  for (const field of ["warpCharges", "fireJutsuCharges", "substitutionCharges", "gritCharges", "reasonCharges", "iaiCharges"]) target[field] = 0;
  target.inventions = [];
  target.itemInventory = {};
}

function duplicateHackableInventory(target) {
  for (const field of ["warpCharges", "fireJutsuCharges", "substitutionCharges", "gritCharges", "reasonCharges", "iaiCharges"]) {
    target[field] = Math.max(0, Number(target[field]) || 0) * 2;
  }
  target.inventions = [...(target.inventions || []), ...(target.inventions || [])];
  for (const itemId of Object.keys(target.itemInventory || {})) {
    target.itemInventory[itemId] = itemCount(target, itemId) * 2;
  }
}

function recoverHackerTargetStatus(room, player, targetId) {
  const target = hackerTarget(room, player, targetId);
  if (!target.alive || target.ejected) throw new ApiError(400, "状態異常を回復できる対象ではありません。");
  const timestamp = now();
  const cleared = clearAdverseStatuses(room, target, "バイブコーディング", timestamp);
  pushMagicEffect(room, "hacker-status-recover", target, {
    radius: 145,
    playerId: player.id,
    targetId: target.id
  });
  setImmediateFeedback(target, "状態異常回復", cleared ? "解除完了" : "異常なし");
}

function deleteHackerTargetHp(room, player, targetId) {
  const target = hackerTarget(room, player, targetId);
  if (resolveFighterSlashGuard(room, player, target, {
    kind: "hp-deletion",
    label: "バイブコーディングのHP削除",
    physical: false,
    reflectable: false,
    destroy: true
  })) return false;
  target.overheal = 0;
  target.bodyHits = 2;
  setImmediateFeedback(target, "HP削除", "HPが0になった");
  return destroyPlayerUnconditionally(room, player, target, "バイブコーディング: HP削除", { bypassSlashGuard: true });
}

function advanceAlchemyObjects(room, timestamp) {
  room.alchemyObjects ||= [];
}

function hasOperatorAccess(player, type) {
  const nativeSpecial = type === "gravity" ? "teleport" : type;
  return player.special === nativeSpecial || (
    HACKER_ROOT_OPERATOR_TYPES.includes(type) && hackerRootEligible(player)
  );
}

function humanTransmutation(room, player, targetId) {
  if (player.alchemyReviveUsed) throw new ApiError(400, "人体生成は対戦中一度だけです。");
  const target = room.players.get(String(targetId || "")) || [...room.players.values()].find((candidate) => !candidate.alive && !candidate.ejected);
  if (!target || target.alive || target.ejected) throw new ApiError(404, "人体生成できる死者がいません。");
  const spawn = getMap(room).spawns[Math.floor(Math.random() * getMap(room).spawns.length)];
  target.alive = true;
  target.botMatchEliminatedById = "";
  target.chatMuted = true;
  target.bodyHits = 0;
  target.overheal = 0;
  target.x = spawn.x;
  target.y = spawn.y;
  target.vx = 0;
  target.vy = 0;
  room.bodies = room.bodies.filter((body) => body.playerId !== target.id);
  player.alchemyReviveUsed = true;
  pushMagicEffect(room, "alchemy-human-transmutation", target, { radius: 180, playerId: player.id, targetId: target.id });
  pushEvent(room, `${player.name} が人体生成で ${target.name} を復活させました。復活者はバトル中チャット不可です。`);
}

// Final cooldowns before stored Mana GPU credit. Credit itself is uncapped;
// each generation consumes only the amount required by this table.
const HACKER_EXTENSION_COOLDOWN_MS = Object.freeze({
  "hack-credits-delete": 60_000,
  "hack-credits-duplicate": 90_000,
  "hack-items-delete": 75_000,
  "hack-items-duplicate": 105_000,
  "hack-hp-delete": 120_000,
  "hack-hp-duplicate": 60_000,
  "hack-mana-delete": 60_000,
  "hack-mana-duplicate": 90_000,
  "hack-status-recover": 36_000,
  revive: 120_000
});

function vibeCodingCooldownMsFor(conversion) {
  const id = String(conversion || "");
  return DVA_ECONOMY.cooldownForRecipe(id) || HACKER_EXTENSION_COOLDOWN_MS[id] || (id.startsWith("object-") ? 30_000 : 36_000);
}

function advanceHackerManaGpu(room, player, elapsedMs, timestamp = now()) {
  if (room.phase === "meeting") return false;
  if (
    room.phase !== "playing" ||
    !isHackerOperator(player) ||
    !player.alive ||
    player.ejected ||
    (Number(player.mana) || 0) <= 0
  ) {
    player.manaGpuDrainCarry = 0;
    return false;
  }
  player.manaGpuDrainCarry = Math.max(0, Number(player.manaGpuDrainCarry) || 0) +
    HACKER_MANA_GPU_DRAIN_PER_SECOND * Math.max(0, Number(elapsedMs) || 0) / 1000;
  const spend = Math.min(
    Math.floor(player.manaGpuDrainCarry * 100) / 100,
    Math.max(0, Number(player.mana) || 0)
  );
  if (spend < 0.01) return false;
  player.manaGpuDrainCarry = Math.max(0, player.manaGpuDrainCarry - spend);
  setMana(room, player, (Number(player.mana) || 0) - spend, "マナGPU");
  player.manaGpuCooldownCreditMs = Math.max(0, Number(player.manaGpuCooldownCreditMs) || 0) +
    spend * HACKER_MANA_GPU_COOLDOWN_REDUCTION_MS_PER_MANA;
  return true;
}

function useAlchemy(room, player, rawConversion, targetId = "") {
  if (room.phase !== "playing" || !isHackerOperator(player)) {
    throw new ApiError(403, "ハッカーではありません。");
  }
  if (!player.alive || player.ejected || player.inVent) throw new ApiError(403, "現在は生成できません。");
  ensureAbilityAvailable(player);
  const timestamp = now();
  if ((Number(player.vibeCodingReadyAt) || 0) > timestamp) {
    throw new ApiError(400, `バイブコーディング再実行待ちです（残り${Math.ceil((player.vibeCodingReadyAt - timestamp) / 1000)}秒）。`);
  }
  const conversion = canonicalAlchemyConversion(rawConversion);
  const recipe = ALCHEMY_RECIPES[conversion];
  if (!recipe) {
    throw new ApiError(400, `生成先が不正です。画面を更新して再選択してください（${conversion || "未選択"}）。`);
  }
  const catalogProduct = DVA_ECONOMY.productForRecipe(conversion);
  if (catalogProduct?.hackerAccess === "root" && !hackerRootEligible(player)) {
    throw new ApiError(403, `${catalogProduct.label}はroot化中だけ生成できます。`);
  }
  recipe.apply(room, player, targetId);
  player.vibeCodingCooldownMs = vibeCodingCooldownMsFor(conversion);
  const shortenedCooldownMs = Math.min(
    player.vibeCodingCooldownMs,
    Math.max(0, Number(player.manaGpuCooldownCreditMs) || 0)
  );
  player.manaGpuCooldownCreditMs = Math.max(0, Number(player.manaGpuCooldownCreditMs) - shortenedCooldownMs);
  player.vibeCodingReadyAt = timestamp + player.vibeCodingCooldownMs - shortenedCooldownMs;
  if (Number(player.mana) <= 0) {
    // Gold has already been authoritatively acquired. The legacy desire-state
    // resource normalization must never overwrite its 100C payout afterward.
    // Other recipes retain their existing zero-mana credit debt behavior.
    if (conversion !== "gold") player.credits = DESIRE_RESOURCE_DEBT;
    player.stamina = DESIRE_RESOURCE_DEBT;
  }
  player.staminaUpdatedAt = now();
  maintainNaturalRecovery(room, player, player.staminaUpdatedAt);
  awardAbilityContribution(player, 0.75);
  pushMagicEffect(room, "action-vibe-coding", player, {
    radius: 145,
    playerId: player.id,
    variant: conversion
  });
  pushEvent(room, `${player.name} がバイブコーディングで${recipe.label}を生成しました。短縮クールを${(shortenedCooldownMs / 1000).toFixed(1)}秒使用しました。`);
  touch(room);
}

function iaiChargeAvailable(player, timestamp = now()) {
  return Boolean(
    player?.alive &&
    !player.ejected &&
    Math.max(0, Math.floor(Number(player.iaiCharges) || 0)) > 0 &&
    itemStorageAvailable(player, timestamp) &&
    passivesEnabled(player)
  );
}

function consumeIaiChargeForSuccessfulAttack(room, source, target, reason, options = {}) {
  if (!source || source.id === target?.id || !iaiChargeAvailable(source)) return false;
  source.iaiCharges = Math.max(0, Math.floor(Number(source.iaiCharges) || 0) - 1);
  pushMagicEffect(room, "iai-destruction-attack", target, {
    radius: 148,
    playerId: source.id,
    targetId: target.id,
    targetX: target.x,
    targetY: target.y,
    variant: options.iaiUpgrade ? "upgraded-to-destruction" : options.noBody ? "existing-disappearance" : "existing-destruction",
    durationMs: 900
  });
  setImmediateFeedback(source, "居合", `${reason || "攻撃"}を${options.noBody ? "消滅のまま" : "破壊"}へ接続 / 残り${source.iaiCharges}`);
  pushEvent(room, `${source.name} の居合が次の成功攻撃へ自動発動しました。${options.noBody ? "既存の消滅結果を維持します。" : `${target.name}を破壊します。`}`);
  return true;
}

function resolveIaiDestructionUpgrade(room, source, target, reason, options = {}) {
  if (!target?.alive || target.ejected || !iaiChargeAvailable(source)) return false;
  const exactReason = requireExactKillCameraActionLabel(reason, "iai-upgrade");
  return destroyPlayerUnconditionally(room, source, target, `居合を帯びた${exactReason}`, {
    ...options,
    bypassSlashGuard: true,
    ignorePreparationBarrier: true,
    iaiUpgrade: true
  });
}

function destroyPlayerUnconditionally(room, source, target, reason, options = {}) {
  if (!target?.alive || target.ejected) return false;
  const timestamp = now();
  const exactActionLabel = requireExactKillCameraActionLabel(options.attackLabel || reason, options.attackKind || "destruction");
  if (options.attackKind && !options.bypassSlashGuard) {
    const guardOutcome = resolveFighterSlashGuard(room, source, target, {
      kind: String(options.attackKind),
      label: String(options.attackLabel || reason || "攻撃"),
      physical: Boolean(options.slashGuardPhysical),
      reflectable: options.slashGuardReflectable !== false,
      damage: 2,
      hitZone: "head",
      destroy: Boolean(options.reflectDestroy),
      ignoreInfiniteResourcesOnReflect: Boolean(options.reflectIgnoreInfiniteResources)
    });
    if (guardOutcome) return false;
  }
  if (!options.ignorePreparationBarrier && absorbPreparationBarrier(room, target, timestamp, source)) return false;
  if (!options.ignoreFriendlyFire && source?.role === target.role && ["defender", "attacker"].includes(source?.role) && source.id !== target.id) {
    if (source.alive && !source.ejected) applyDefenderFriendlyFirePenalty(room, source, target, timestamp);
    return false;
  }
  recordBotVisiblePoisonDeathInference(room, target, timestamp);
  recordBotMatchElimination(room, target, source);
  target.alive = false;
  recordKillCamera(room, target, source, {
    timestamp,
    actionLabel: exactActionLabel,
    actionKind: String(options.attackKind || (options.noBody ? "disappearance" : "destruction")),
    sourceLabel: String(options.sourceLabel || reason || ""),
    reflected: String(options.attackKind || "").includes("reflected")
  });
  target.bodyHits = 0;
  target.overheal = 0;
  target.gritCharges = 0;
  target.beautyCharges = 0;
  target.substitutionCharges = 0;
  target.inVent = false;
  target.ventId = "";
  target.drone.active = false;
  clearAttackState(target);
  completeTasksAfterDeath(room, target);
  if (source && source.id !== target.id) {
    transferKillCredits(room, source, target);
    transferKillInventory(room, source, target);
    source.totalKills += 1;
  }
  consumeIaiChargeForSuccessfulAttack(room, source, target, reason, options);
  pushHitEffect(room, target, "head", true);
  if (!options.noBody) {
    room.bodies.push({
      id: uid("body_"), playerId: target.id, killerId: source?.id || "destruction",
      killerName: source?.name || reason, killerIsBot: Boolean(source?.isBot),
      killerSkinId: source?.skinId || "operator", name: target.name,
      x: target.x, y: target.y, at: timestamp, destruction: true,
      noKillCutin: Boolean(options.noKillCutin)
    });
  }
  pushEvent(room, options.noBody
    ? `${target.name} は${reason}で消滅し、死体は残りませんでした。`
    : `${target.name} は${reason}で破壊され、死体が残りました。`);
  return true;
}

function inventionLineTargets(room, player, range, width, enemyOnly = false) {
  const dx = Number(player.aimX) || 0;
  const dy = Number(player.aimY) || 1;
  return [...room.players.values()]
    .filter((target) => target.id !== player.id && target.alive && !target.ejected && (!enemyOnly || target.role === attackTargetRole(player)))
    .map((target) => {
      const rx = target.x - player.x;
      const ry = target.y - player.y;
      return { target, along: rx * dx + ry * dy, perpendicular: Math.abs(rx * dy - ry * dx) };
    })
    .filter((entry) => entry.along > 0 && entry.along <= range && entry.perpendicular <= width)
    .sort((a, b) => a.along - b.along);
}

function useAlchemistInvention(room, player, invention, rawHoldMs = 0, chargeId = "") {
  if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "現在は素敵な発明品を使用できません。");
  }
  ensureAbilityAvailable(player);
  ensureItemStorageAvailable(player);
  const id = String(invention || "");
  const index = (player.inventions || []).indexOf(id);
  if (index < 0) throw new ApiError(404, "その素敵な発明品を所持していません。");
  const power = resolveHeldPowerMode(room, player, rawHoldMs, inventionLabel(id), {
    kind: "use",
    itemId: `invention:${id}`,
    chargeId,
    gboEligible: Boolean(HACKER_INVENTION_LABELS[id])
  });
  const performanceMultiplier = power.mode === "gbo"
    ? GBO_PERFORMANCE_MULTIPLIER
    : 1 + power.enhanceLevel * GUNNER_ENHANCE_DAMAGE_PER_LEVEL;
  player.inventions.splice(index, 1);
  if (power.mode === "gbo") pushGboOverdriveEffect(room, player, `invention:${id}`, "invention-use");
  if (id === "computer") {
    room.utilityViews.set(player.id, {
      type: "computer", title: "Smartphone Geolocation",
      lines: [...room.players.values()]
        .filter((target) => target.alive && !target.ejected && target.special !== "alchemist")
        .map((target) => `${target.name}: ${whichRoom(getMap(room), target)} (${Math.round(target.x)}, ${Math.round(target.y)})`)
    });
  } else if (id === "excalibur") {
    const targets = inventionLineTargets(room, player, Math.max(getMap(room).width, getMap(room).height) * 2 * performanceMultiplier, Math.max(getMap(room).width, getMap(room).height) * performanceMultiplier, true);
    for (const { target } of targets) destroyPlayerUnconditionally(room, player, target, "エクスカリバー", {
      attackKind: "excalibur",
      attackLabel: "エクスカリバー",
      slashGuardPhysical: true,
      slashGuardReflectable: true,
      reflectDestroy: true
    });
    pushMagicEffect(room, "alchemy-excalibur", player, { radius: 900 * performanceMultiplier, playerId: player.id, variant: power.mode === "gbo" ? "gbo-tenfold" : "forward-half-map" });
    checkWin(room);
    if (!(room.phase === "ended" && room.winner === "attackers" && player.role === "attacker")) {
      destroyPlayerUnconditionally(room, player, player, "エクスカリバーの代償");
    }
  } else if (id === "railgun") {
    for (const { target } of inventionLineTargets(room, player, 5000 * performanceMultiplier, 38 * performanceMultiplier, false)) destroyPlayerUnconditionally(room, player, target, "レールガン", {
      attackKind: "railgun",
      attackLabel: "レールガン弾",
      slashGuardPhysical: true,
      slashGuardReflectable: true,
      reflectDestroy: true
    });
    pushMagicEffect(room, "alchemy-railgun", player, { radius: 100 * Math.sqrt(performanceMultiplier), targetX: player.x + player.aimX * 5000 * performanceMultiplier, targetY: player.y + player.aimY * 5000 * performanceMultiplier, playerId: player.id, variant: power.mode });
  } else if (id === "particle-cannon") {
    player.particleCannonUntil = now() + 6_000 * performanceMultiplier;
    player.particleCannonNextAt = 0;
    player.particleCannonPerformanceMultiplier = performanceMultiplier;
    pushMagicEffect(room, "alchemy-particle-cannon", player, {
      radius: 150,
      targetX: player.x + player.aimX * 1250 * performanceMultiplier,
      targetY: player.y + player.aimY * 1250 * performanceMultiplier,
      playerId: player.id,
      variant: power.mode === "gbo" ? "gbo-tenfold" : "continuous"
    });
  }
  awardAbilityContribution(player, 2);
  pushSound(room, "invention", player, { ownerId: player.id, sourceKind: "alchemy", maxDistance: 3200, volume: 1 });
  pushEvent(room, `${player.name} が素敵な発明品 ${id} を使用しました${power.mode === "gbo" ? "（GBO・数値性能×10・武具破壊）" : power.enhanceLevel ? `（エンハンスLv${power.enhanceLevel}）` : ""}。`);
  checkWin(room);
  touch(room);
}

function advanceParticleCannon(room, player, timestamp) {
  if (room.phase !== "playing") return;
  if ((Number(player.particleCannonUntil) || 0) <= timestamp || !player.alive) {
    player.particleCannonPerformanceMultiplier = 1;
    return;
  }
  if ((Number(player.particleCannonNextAt) || 0) > timestamp) return;
  const performanceMultiplier = Math.max(1, Number(player.particleCannonPerformanceMultiplier) || 1);
  player.particleCannonNextAt = timestamp + 300 / performanceMultiplier;
  const targets = inventionLineTargets(room, player, 1250 * performanceMultiplier, 70 * performanceMultiplier, true);
  for (const { target } of targets) {
    destroyPlayerUnconditionally(room, player, target, "荷電粒子砲", {
      attackKind: "particle-cannon",
      attackLabel: "荷電粒子砲",
      slashGuardPhysical: false,
      slashGuardReflectable: false,
      reflectDestroy: true
    });
  }
  pushMagicEffect(room, "alchemy-particle-beam", player, {
    radius: 140 * Math.sqrt(performanceMultiplier), targetX: player.x + player.aimX * 1250 * performanceMultiplier, targetY: player.y + player.aimY * 1250 * performanceMultiplier, playerId: player.id, variant: performanceMultiplier > 1 ? "gbo-tenfold" : "continuous"
  });
}

function useBorrowedAbility(room, player, type, options = {}) {
  const key = String(type || "");
  if (!isHackerOperational(player) || !hackerRootEligible(player)) {
    throw new ApiError(403, "能力ボタンでroot化した後だけ他オペレーターの能力を借用できます。");
  }
  if (!HACKER_ROOT_OPERATOR_TYPES.includes(key)) {
    throw new ApiError(400, "借用能力の種類が不正です。");
  }
  if (key === "fighter") {
    toggleLimitBreak(room, player);
  } else if (key === "gravity") {
    const mode = String(options.mode || "storm");
    const targetId = String(options.targetId || player.id);
    if (["body", "near", "heart", "target"].includes(mode)) {
      teleportPlayer(room, player, options.x, options.y, targetId, mode);
    } else if (mode === "accelerate" || mode === "decelerate") {
      toggleGravityTime(room, player, mode, targetId);
    } else if (mode === "storm") {
      useGravityStorm(room, player, targetId);
    } else if (mode === "time-keeper") {
      useTimeKeeper(room, player);
    } else {
      throw new ApiError(400, "借用グラビティの方式が不正です。");
    }
  } else if (key === "flora") {
    useFloraAbility(room, player, String(options.mode || "heal"), options);
  } else if (key === "gunner") {
    throw new ApiError(400, "ガンナーのエイム・特殊弾装填・HSGは自動パッシブです。GBOは所持武具のUse／Throw／Shoot長押しから全員が使用します。");
  } else if (key === "quantum") {
    return useQuantumControl(room, player, String(options.mode || "nuclear-transmutation"));
  }
}

function clearAimState(player) {
  player.aimTargetId = "";
  player.aimStartedAt = 0;
  player.aimReadyAt = 0;
  player.aimExpiresAt = 0;
  player.aimSourceX = 0;
  player.aimSourceY = 0;
  player.aimTargetX = 0;
  player.aimTargetY = 0;
}

function clearPendingAttack(player) {
  player.attackTargetId = "";
  player.attackResolveAt = 0;
}

function clearAttackState(player) {
  clearAimState(player);
  clearPendingAttack(player);
  clearEnhanceChargeState(player);
}

function attackTargetFor(room, killer, targetId) {
  const targetRole = attackTargetRole(killer);
  const explicit = targetId ? room.players.get(targetId) : null;
  if (explicit) return explicit;
  return [...room.players.values()]
    .filter((player) => player.role === targetRole && player.alive && !player.ejected)
    .sort((a, b) => distance(killer, a) - distance(killer, b))[0] || null;
}

function canUseKill(player) {
  if (player.role === "attacker") return true;
  if (player.isBot) return false;
  return hasOperatorAccess(player, "fighter");
}

function attackTargetRole(player) {
  return player.role === "defender" ? "attacker" : "defender";
}

function validateAttackStart(room, killer, targetId, options = {}) {
  const timestamp = now();
  if (room.phase !== "playing") throw new ApiError(400, "会議中は攻撃できません。");
  if (!canUseKill(killer) || !killer.alive || killer.ejected) throw new ApiError(403, "攻撃できません。");
  ensureConscious(killer);
  if (killer.inVent) throw new ApiError(400, "ダクト内では攻撃できません。");
  if (killer.attackResolveAt > timestamp) throw new ApiError(400, "すでに攻撃準備中です。");
  if (!options.ignoreCooldown && killer.killReadyAt > timestamp) {
    throw new ApiError(400, `キルクールダウン中です（残り${Math.ceil((killer.killReadyAt - timestamp) / 1000)}秒）。`);
  }
  const target = attackTargetFor(room, killer, targetId);
  const explicitTarget = Boolean(targetId);
  if (!target || (!explicitTarget && target.role !== attackTargetRole(killer)) || !target.alive || target.ejected) {
    throw new ApiError(404, "攻撃対象がいません。");
  }
  if (distance(killer, target) > room.settings.killRange) throw new ApiError(400, "対象が遠すぎます。");
  return { target, timestamp };
}

function startNinjutsu(room, player, targetId) {
  const { target, timestamp } = validateAttackStart(room, player, targetId);
  player.aimTargetId = target.id;
  player.aimStartedAt = timestamp;
  player.aimReadyAt = timestamp + NINJUTSU_DURATION_MS;
  player.aimExpiresAt = player.aimReadyAt + AIM_HOLD_MS;
  player.aimSourceX = player.x;
  player.aimSourceY = player.y;
  player.aimTargetX = target.x;
  player.aimTargetY = target.y;
  pushMagicEffect(room, "action-ninjutsu-focus", player, { radius: 115, playerId: player.id, targetId: target.id });
  touch(room);
}

function setAttackResult(player, result, timestamp = now()) {
  player.lastAttackResult = result;
  player.lastAttackResultAt = timestamp;
}

function aimedTargetMoved(player, target) {
  if (!target) return true;
  const sourceMoved = Math.hypot(player.x - player.aimSourceX, player.y - player.aimSourceY) > AIM_TARGET_MOVE_TOLERANCE;
  const targetMoved = Math.hypot(target.x - player.aimTargetX, target.y - player.aimTargetY) > AIM_TARGET_MOVE_TOLERANCE;
  return sourceMoved || targetMoved;
}

function failAimForMovement(room, player, timestamp = now()) {
  clearAimState(player);
  if (room.phase === "playing" && player.alive && !player.ejected) {
    player.killReadyAt = Math.max(player.killReadyAt, timestamp + room.settings.killCooldown * 1000);
  }
  setAttackResult(player, "moved", timestamp);
  touch(room);
}

function ninjutsuEliminationProfile(player) {
  if (player?.special === "assassin") {
    return {
      reason: "アサシン忍殺による消滅",
      attackKind: "assassin-ninjutsu-annihilation",
      attackLabel: "アサシン忍殺による消滅"
    };
  }
  return {
    reason: "忍殺",
    attackKind: "ninjutsu",
    attackLabel: "忍殺"
  };
}

function resolveNinjutsuDisappearance(room, player, targetId, timestamp = now()) {
  const target = room.players.get(targetId);
  if (!target?.alive || target.ejected) return "miss";
  const profile = ninjutsuEliminationProfile(player);
  const disappeared = destroyPlayerUnconditionally(room, player, target, profile.reason, {
    noBody: true,
    attackKind: profile.attackKind,
    attackLabel: profile.attackLabel,
    slashGuardPhysical: true,
    slashGuardReflectable: true,
    reflectDestroy: true
  });
  if (!disappeared) {
    checkWin(room);
    touch(room);
    return "blocked";
  }
  player.killsThisRound += 1;
  player.killReadyAt = timestamp + Math.max(MIN_KILL_COOLDOWN, room.settings.killCooldown) * 1000;
  recordBotKillWitnesses(room, player, target, timestamp);
  evaluateSoloMission(room, timestamp);
  pushDoorLog(room, `${whichRoom(getMap(room), target)} 付近で${profile.attackLabel}による反応消失`);
  checkWin(room);
  touch(room);
  return "disappeared";
}

function performNinjutsuAttack(room, player, targetId) {
  const timestamp = now();
  if (!player.aimTargetId || player.aimTargetId !== targetId) throw new ApiError(400, "この対象へ忍殺準備をしていません。");
  if (player.aimReadyAt > timestamp) {
    throw new ApiError(400, `忍殺準備中です（残り${((player.aimReadyAt - timestamp) / 1000).toFixed(1)}秒）。`);
  }
  if (!player.aimExpiresAt || player.aimExpiresAt <= timestamp) {
    clearAimState(player);
    throw new ApiError(400, "忍殺の有効時間が切れました。");
  }
  if (aimedTargetMoved(player, room.players.get(targetId))) {
    failAimForMovement(room, player, timestamp);
    return;
  }
  const outcome = resolveNinjutsuDisappearance(room, player, targetId, timestamp);
  clearAimState(player);
  setAttackResult(player, outcome, timestamp);
  touch(room);
}

function resolveReadyAim(room, player, timestamp = now()) {
  if (!player.aimTargetId || !player.aimReadyAt || player.aimReadyAt > timestamp) return;
  const targetId = player.aimTargetId;
  if (aimedTargetMoved(player, room.players.get(targetId))) {
    failAimForMovement(room, player, timestamp);
    return;
  }
  try {
    const outcome = resolveNinjutsuDisappearance(room, player, targetId, timestamp);
    clearAimState(player);
    setAttackResult(player, outcome, timestamp);
  } catch {
    clearAimState(player);
    if (room.phase === "playing" && player.alive && !player.ejected) {
      player.killReadyAt = Math.max(player.killReadyAt, timestamp + room.settings.killCooldown * 1000);
    }
    setAttackResult(player, "miss", timestamp);
  }
  touch(room);
}

function killPlayer(room, killer, targetId, options = {}) {
  const ranged = Boolean(options.ranged);
  const lockedAim = Boolean(options.lockedAim);
  const ignoreCooldown = Boolean(options.ignoreCooldown);
  const ignoreRange = Boolean(options.ignoreRange);
  const ignoreDodge = Boolean(options.ignoreDodge);
  const preserveCooldown = Boolean(options.preserveCooldown);
  const allowAnyKiller = Boolean(options.allowAnyKiller);
  const ignorePush = Boolean(options.ignorePush);
  const ignoreFriendlyFire = Boolean(options.ignoreFriendlyFire);
  const bypassSlashGuard = Boolean(options.bypassSlashGuard);
  const bodyDamage = clampNumber(options.damage, 0.01, 2, 1);
  let hitZone = options.hitZone === "head" ? "head" : "body";
  let standFirmConverted = false;
  if (room.phase !== "playing") throw new ApiError(400, "会議中はキルできません。");
  if ((!canUseKill(killer) && !allowAnyKiller) || !killer.alive || killer.ejected) throw new ApiError(403, "キルできません。");
  if (killer.inVent) throw new ApiError(400, "ダクト内ではキルできません。");
  const timestamp = now();
  const attackOrigin = options.origin || { x: killer.x, y: killer.y };
  if (!ranged && !ignoreCooldown && killer.killReadyAt > timestamp) {
    throw new ApiError(400, `キルクールダウン中です（残り${Math.ceil((killer.killReadyAt - timestamp) / 1000)}秒）。`);
  }
  const map = getMap(room);
  const target = attackTargetFor(room, killer, targetId);
  const expectedTargetRole = options.targetRole || attackTargetRole(killer);
  const explicitTarget = Boolean(targetId);
  if (!target || (!explicitTarget && target.role !== expectedTargetRole) || !target.alive || target.ejected) {
    throw new ApiError(404, "キル対象がいません。");
  }
  if (!ranged && !lockedAim && !ignoreRange && distance(killer, target) > room.settings.killRange) throw new ApiError(400, "対象が遠すぎます。");
  if (!ignoreFriendlyFire && killer.role === target.role && ["defender", "attacker"].includes(killer.role)) {
    if (!ranged && !ignoreCooldown && !preserveCooldown) {
      killer.killReadyAt = timestamp + Math.max(MIN_KILL_COOLDOWN, room.settings.killCooldown) * 1000;
    }
    applyDefenderFriendlyFirePenalty(room, killer, target, timestamp);
    checkWin(room);
    touch(room);
    return "friendlyFirePenalty";
  }

  if (!bypassSlashGuard) {
    const slashGuardPhysical = options.slashGuardPhysical === undefined
      ? !options.magic
      : Boolean(options.slashGuardPhysical);
    const attackKind = String(options.attackKind || (slashGuardPhysical ? ranged ? "projectile" : "melee" : "nonphysical"));
    const guardOutcome = resolveFighterSlashGuard(room, killer, target, {
      kind: attackKind,
      label: String(options.attackLabel || (attackKind === "slash" ? "斬る" : slashGuardPhysical ? "物理攻撃" : "非物理攻撃")),
      physical: slashGuardPhysical,
      reflectable: options.slashGuardReflectable !== false,
      perfectGuardEligible: options.slashGuardPerfectEligible !== false,
      damage: bodyDamage,
      hitZone,
      magic: Boolean(options.magic),
      destroy: Boolean(options.destroy),
      ignoreInfiniteResourcesOnReflect: Boolean(options.ignoreInfiniteResources)
    }, timestamp);
    if (guardOutcome) return guardOutcome;
  }

  if (absorbPreparationBarrier(room, target, timestamp, killer)) return "preparationBarrier";

  if ((ignoreDodge || Number(target.dodgeActiveUntil) <= timestamp) && resolveIaiDestructionUpgrade(
    room,
    killer,
    target,
    String(options.attackLabel || (options.attackKind === "slash" ? "斬る" : ranged ? "射撃" : "攻撃")),
    { ignoreFriendlyFire: true }
  )) {
    if (!ranged && !ignoreCooldown && !preserveCooldown) {
      killer.killsThisRound += 1;
      killer.killReadyAt = timestamp + Math.max(MIN_KILL_COOLDOWN, room.settings.killCooldown) * 1000;
    }
    checkWin(room);
    touch(room);
    return "destroyed";
  }

  if (hasFighterInfiniteResources(target)) {
    syncFighterInfiniteResources(target);
    pushHitEffect(room, target, "body", false);
    pushEvent(room, `${target.name} は無限HPと無限踏ん張りで攻撃を防ぎました。`);
    touch(room);
    return "infiniteResources";
  }

  if (!options.destroy && triggerSubstitution(room, target, options.magic ? "magic" : ranged ? "ranged" : "attack", timestamp)) {
    if (!ranged && !ignoreCooldown && !preserveCooldown) killer.killReadyAt = timestamp + Math.max(MIN_KILL_COOLDOWN, room.settings.killCooldown) * 1000;
    return "substitution";
  }

  if (lockedAim && killer.special !== "fighter" && staminaStateLabel(killer.stamina) === "気概") {
    hitZone = "body";
    setImmediateFeedback(killer, "気概", "忍殺が非確殺攻撃へ変化");
  }

  if (!ignorePush && itemStorageAvailable(killer, timestamp) && passivesEnabled(killer) && (Number(killer.reasonCharges) || 0) > 0 && (Number(target.gritCharges) || 0) > 0) {
    killer.reasonCharges -= 1;
    const removedCharges = Number(target.gritCharges) || 0;
    target.gritCharges = 0;
    awardAbilityContribution(killer, 0.5);
    pushMagicEffect(room, "action-push", target, {
      radius: 125,
      playerId: killer.id,
      targetId: target.id,
      variant: String(removedCharges)
    });
    const backlashDamage = removedCharges * PUSH_BACKLASH_DAMAGE_PER_CHARGE;
    pushEvent(room, `${killer.name} の押し込みが ${target.name} の踏ん張り${removedCharges}回分を無効化しました。反動 ${backlashDamage.toFixed(1)}ダメージ。`);
    if (applyPushBacklash(room, killer, removedCharges, timestamp)) {
      checkWin(room);
      touch(room);
      return "pushBacklash";
    }
  }

  if (!ignoreDodge && target.dodgeActiveUntil > timestamp) {
    target.dodgeActiveUntil = 0;
    const incomingCertainKill = fighterKillCounterTriggerIsCertainKill(hitZone, options);
    if (fighterKillCounterAvailable(target) && incomingCertainKill) {
      recordBotMatchElimination(room, killer, target);
      killer.alive = false;
      recordKillCamera(room, killer, target, {
        timestamp,
        actionLabel: "回避キルカウンター",
        actionKind: "fighter-dodge-counter",
        sourceLabel: "100SP回避による確殺反撃"
      });
      killer.bodyHits = 0;
      killer.overheal = 0;
      killer.limitBreakActive = false;
      killer.limitBreakEndsAt = 0;
      killer.limitBreakStacks = 0;
      killer.inVent = false;
      killer.ventId = "";
      killer.drone.active = false;
      clearAttackState(killer);
      completeTasksAfterDeath(room, killer);
      transferKillCredits(room, target, killer);
      target.totalKills += 1;
      target.killsThisRound += 1;
      awardAbilityContribution(target, 1);
      target.killReadyAt = timestamp + Math.max(MIN_KILL_COOLDOWN, room.settings.killCooldown) * 1000;
      pushHitEffect(room, killer, "body", true);
      room.bodies.push({
        id: uid("body_"),
        playerId: killer.id,
        killerId: target.id,
        killerName: target.name,
        killerIsBot: target.isBot,
        killerSkinId: target.skinId || (target.isBot ? "operator" : "hood"),
        name: killer.name,
        x: killer.x,
        y: killer.y,
        at: timestamp,
        fighterDodgeCounter: true
      });
      applyDefenderFriendlyFirePenalty(room, target, killer, timestamp);
      pushMagicEffect(room, "action-fighter-dodge-counter", target, {
        radius: 155,
        playerId: target.id,
        targetId: killer.id
      });
      pushSound(room, "fighterCounter", target, { ownerId: target.id, maxDistance: 1400, volume: 0.9 });
      pushDoorLog(room, `${whichRoom(map, target)} でファイターのキルカウンター発生`);
      pushEvent(room, `${target.name} が確殺を回避し、攻撃者 ${killer.name} を返り討ちにしました。`);
      checkWin(room);
      touch(room);
      return "fighterCountered";
    }
    if (!ranged && !ignoreCooldown && !preserveCooldown) {
      killer.killReadyAt = timestamp + Math.max(MIN_KILL_COOLDOWN, room.settings.killCooldown) * 1000;
    }
    pushEvent(room, `${target.name} が ${killer.name} の攻撃を回避しました。`);
    touch(room);
    return "dodged";
  }

  if (hitZone === "head" && !hackerRootEligible(target) && !hasLimitBreakDeathVulnerability(target) && itemStorageAvailable(target, timestamp) && passivesEnabled(target) && target.gritCharges > 0) {
    target.gritCharges -= 1;
    hitZone = "body";
    standFirmConverted = true;
    if (target.isBot) {
      target.botRetaliationTargetId = killer.id;
      const cooldownWaitMs = Math.max(0, Number(target.killReadyAt) - timestamp);
      target.botRetaliationUntil = timestamp + Math.max(BOT_STAND_FIRM_RETALIATION_MS, cooldownWaitMs + 15_000);
      target.navPath = [];
      target.nextBotActionAt = Math.min(Number(target.nextBotActionAt) || timestamp, timestamp);
    }
    pushMagicEffect(room, "action-stand", target, { radius: 120, playerId: target.id });
    pushEvent(room, `${target.name} の踏ん張りが確殺をボディダメージへ変換しました。`);
  }

  if (hitZone === "body" && target.overheal > 0) {
    target.overheal -= 1;
    if (ranged) killer.gunReadyAt = Math.max(Number(killer.gunReadyAt) || 0, timestamp);
    else if (!ignoreCooldown && !preserveCooldown) killer.killReadyAt = timestamp + QUICK_FOLLOW_UP_COOLDOWN_MS;
    pushHitEffect(room, target, "body", false);
    pushEvent(room, `${target.name} のオーバーヒールがボディ攻撃を吸収しました。`);
    if (hasOperatorAccess(killer, "gunner")) awardAbilityContribution(killer, 0.5);
    touch(room);
    return "overheal";
  }

  if (hitZone === "body") {
    const nextDamage = Math.round((Math.max(0, Number(target.bodyHits) || 0) + bodyDamage) * 100) / 100;
    const lethalThreshold = 2;
    if (standFirmConverted && nextDamage >= lethalThreshold) {
      target.bodyHits = 1;
      if (ranged) killer.gunReadyAt = Math.max(Number(killer.gunReadyAt) || 0, timestamp);
      else if (!ignoreCooldown && !preserveCooldown) killer.killReadyAt = timestamp + QUICK_FOLLOW_UP_COOLDOWN_MS;
      pushHitEffect(room, target, "body", false);
      touch(room);
      return "body";
    }
    if (nextDamage >= lethalThreshold) {
      target.bodyHits = 2;
    } else {
      target.bodyHits = nextDamage;
      if (ranged) killer.gunReadyAt = Math.max(Number(killer.gunReadyAt) || 0, timestamp);
      else if (!ignoreCooldown && !preserveCooldown) killer.killReadyAt = timestamp + QUICK_FOLLOW_UP_COOLDOWN_MS;
      pushHitEffect(room, target, "body", false);
      pushEvent(room, `${target.name} が${bodyDamage.toFixed(2)}ダメージを受けました（残りHP ${(2 - nextDamage).toFixed(2)}）。`);
      if (hasOperatorAccess(killer, "gunner")) awardAbilityContribution(killer, Math.min(0.2, bodyDamage / 3));
      touch(room);
      return "body";
    }
  }

  const killActionKind = String(options.attackKind || "").trim();
  if (!killActionKind) throw new Error("Exact lethal action kind is required before committing a kill.");
  const killActionLabel = requireExactKillCameraActionLabel(options.attackLabel, killActionKind);
  recordBotVisiblePoisonDeathInference(room, target, timestamp);
  recordBotMatchElimination(room, target, killer);
  target.alive = false;
  recordKillCamera(room, target, killer, {
    timestamp,
    actionLabel: killActionLabel,
    actionKind: killActionKind,
    sourceLabel: ranged ? gunnerWeaponFor(killer).name : killActionLabel,
    reflected: killActionKind.includes("reflected")
  });
  target.gunnerSnipingActive = false;
  target.gunnerAimTargetId = "";
  target.bodyHits = 0;
  target.overheal = 0;
  target.limitBreakActive = false;
  target.limitBreakEndsAt = 0;
  target.limitBreakStacks = 0;
  target.inVent = false;
  target.ventId = "";
  clearAttackState(target);
  pushHitEffect(room, target, hitZone, true);
  completeTasksAfterDeath(room, target);
  transferKillCredits(room, killer, target);
  transferKillInventory(room, killer, target);
  killer.totalKills += 1;
  evaluateSoloMission(room, timestamp);
  if (hasOperatorAccess(killer, "gunner")) awardAbilityContribution(killer, 0.5);
  if (!options.noBody) {
    room.bodies.push({
      id: uid("body_"),
      playerId: target.id,
      killerId: killer.id,
      killerName: killer.name,
      killerIsBot: killer.isBot,
      killerSkinId: killer.skinId || (killer.isBot ? "operator" : "hood"),
      name: target.name,
      x: target.x,
      y: target.y,
      at: timestamp
    });
  }
  recordBotKillWitnesses(room, killer, target, timestamp);
  if (!options.deferFriendlyFire) applyDefenderFriendlyFirePenalty(room, killer, target, timestamp);

  if (!ranged && !ignoreCooldown && !preserveCooldown) {
    killer.killsThisRound += 1;
    const nextCooldown = Math.max(MIN_KILL_COOLDOWN, room.settings.killCooldown);
    killer.killReadyAt = timestamp + nextCooldown * 1000;
  }
  pushDoorLog(room, `${whichRoom(map, attackOrigin)} 付近で反応消失`);
  pushEvent(room, options.noBody
    ? `${target.name} が忍殺され、痕跡は残りませんでした。`
    : `${target.name} が倒れました。死体発見で会議が始まります。`);
  checkWin(room);
  touch(room);
  return "lethal";
}

function clearShotPath(room, shooter, target, directionX, directionY, options = {}) {
  const along = (target.x - shooter.x) * directionX + (target.y - shooter.y) * directionY;
  const steps = Math.max(1, Math.ceil(along / 18));
  for (let step = 1; step < steps; step += 1) {
    const distanceAlong = along * step / steps;
    const x = shooter.x + directionX * distanceAlong;
    const y = shooter.y + directionY * distanceAlong;
    if (!isWalkable(room, x, y, 2)) return false;
    if (!options.ignoreCover && (room.alchemyObjects || []).some((object) => object.type === "cover" && (!object.endsAt || object.endsAt > now()) && Math.hypot(x - object.x, y - object.y) <= object.radius)) return false;
  }
  return true;
}

function recordBotKillWitnesses(room, killer, target, timestamp = now()) {
  for (const witness of room.players.values()) {
    if (!witness.isBot || !witness.alive || witness.ejected || witness.inVent || witness.id === target.id) continue;
    if (witness.role !== "defender") continue;
    const separation = distance(witness, killer);
    if (separation > BOT_KILL_WITNESS_RANGE) continue;
    const dx = killer.x - witness.x;
    const dy = killer.y - witness.y;
    const length = Math.hypot(dx, dy) || 1;
    if (!clearShotPath(room, witness, killer, dx / length, dy / length)) continue;
    witness.botWitnessTargetId = killer.id;
    witness.botWitnessUntil = timestamp + BOT_STAND_FIRM_RETALIATION_MS;
    witness.botWitnessEvidenceKind = "visible-hostile-kill";
    if (botCanCommitLuminous(room, witness, killer.id, timestamp)) {
      try {
        callEmergency(room, witness, killer.id, "witness");
      } catch {}
    }
  }
}

function shotEndPoint(room, shooter, directionX, directionY, maxRange) {
  let distanceAlong = maxRange;
  for (let sample = 18; sample <= maxRange; sample += 18) {
    if (!isWalkable(room, shooter.x + directionX * sample, shooter.y + directionY * sample, 2)) {
      distanceAlong = Math.max(24, sample - 18);
      break;
    }
  }
  return {
    x: shooter.x + directionX * distanceAlong,
    y: shooter.y + directionY * distanceAlong
  };
}

function destroyGboFirearmAccess(room, player, weaponId, reason = "GBO使用完了") {
  const id = String(weaponId || "");
  if (!GUNNER_WEAPONS[id]) return false;
  const purchasedIndex = (player.purchasedWeapons || []).indexOf(id);
  if (purchasedIndex >= 0) player.purchasedWeapons.splice(purchasedIndex, 1);
  player.unavailableGunnerWeapons ||= [];
  if (!player.unavailableGunnerWeapons.includes(id)) player.unavailableGunnerWeapons.push(id);
  if (player.gunnerReloadWeapon === id) {
    player.gunnerReloadWeapon = "";
    player.gunnerReloadUntil = 0;
  }
  if (player.gunnerWeapon === id) {
    const currentIndex = Math.max(0, GUNNER_WEAPON_ORDER.indexOf(id));
    player.gunnerWeapon = nextUsableGunnerWeapon(player, currentIndex, 1) || id;
  }
  pushMagicEffect(room, "gbo-overdrive", player, {
    radius: 185,
    playerId: player.id,
    variant: `destroyed:weapon:${id}`,
    durationMs: 1_450
  });
  setImmediateFeedback(player, "GBO武器破壊", `${GUNNER_WEAPONS[id].name} / ${reason}`);
  pushEvent(room, `${player.name} の${GUNNER_WEAPONS[id].name}はGBOの${reason}により破壊されました。`);
  return true;
}

function stopGunnerFire(room, player, options = {}) {
  if (!player.gunFiring) return false;
  const weaponId = player.gunFiringWeapon || gunnerWeaponFor(player).id;
  const destroyGboWeapon = Boolean(player.gunnerBurstGbo && player.gunnerBurstGboWeapon === weaponId);
  player.gunFiring = false;
  player.gunFiringWeapon = "";
  player.gunFiringSince = 0;
  player.gunnerBurstRoundsRemaining = 0;
  player.gunnerBurstEnhanceLevel = 0;
  player.gunnerBurstGbo = false;
  player.gunnerBurstGboWeapon = "";
  if (destroyGboWeapon) destroyGboFirearmAccess(room, player, weaponId, String(options.reason || "中断"));
  touch(room);
  return true;
}

function finishGunnerBurstRound(room, shooter, weapon, timestamp = now()) {
  shooter.gunnerBurstRoundsRemaining = Math.max(0, Math.floor(Number(shooter.gunnerBurstRoundsRemaining) || 0) - 1);
  const magazineConsumed = shooter.gunnerBurstRoundsRemaining <= 0 ||
    (Number(shooter.gunnerAmmo?.[weapon.id]) || 0) < weapon.ammoPerShot;
  if (!magazineConsumed) return false;
  const gbo = Boolean(shooter.gunnerBurstGbo && shooter.gunnerBurstGboWeapon === weapon.id);
  stopGunnerFire(room, shooter, { reason: "1弾倉を撃ち切り" });
  if (!gbo && shooter.alive && !shooter.ejected && !shooter.inVent) {
    startGunnerReload(room, shooter, weapon.id, timestamp, "1弾倉を撃ち切ったため");
  }
  return true;
}

function nextUsableGunnerWeapon(player, startIndex, step) {
  for (let offset = 1; offset <= GUNNER_WEAPON_ORDER.length; offset += 1) {
    const index = (startIndex + step * offset + GUNNER_WEAPON_ORDER.length * 2) % GUNNER_WEAPON_ORDER.length;
    const id = GUNNER_WEAPON_ORDER[index];
    if (gunnerWeaponAvailable(player, id)) return id;
  }
  return "";
}

function switchGunnerWeapon(room, player, requestedWeaponId = "", direction = 1) {
  if (room.phase !== "playing") throw new ApiError(400, "バトル中のみ武器を切り替えられます。");
  if (!hasFirearmAccess(player)) throw new ApiError(403, "使用できる銃器を所持していません。");
  if (!player.alive || player.ejected || player.inVent) throw new ApiError(403, "現在は武器を切り替えられません。");
  ensureConscious(player);
  ensureItemStorageAvailable(player);
  if (player.gunFiring) stopGunnerFire(room, player, { reason: "切替", autoSwitch: false });
  const currentIndex = Math.max(0, GUNNER_WEAPON_ORDER.indexOf(gunnerWeaponFor(player).id));
  const step = direction < 0 ? -1 : 1;
  let nextWeaponId = "";
  if (requestedWeaponId && GUNNER_WEAPONS[requestedWeaponId] && gunnerWeaponAvailable(player, requestedWeaponId)) {
    nextWeaponId = requestedWeaponId;
  } else {
    nextWeaponId = nextUsableGunnerWeapon(player, currentIndex, step);
  }
  if (!nextWeaponId) throw new ApiError(400, "使用できる銃が残っていません。");
  player.gunnerWeapon = nextWeaponId;
  const weapon = gunnerWeaponFor(player);
  // Special ammunition belongs to the currently selected firearm rather than
  // remaining pinned to whichever firearm happened to be selected on pickup.
  // Preserve the active ammunition kind when possible, then expose its stored
  // rounds through the newly selected weapon.
  activateStoredGunnerSpecialAmmo(player, weapon.id);
  pushMagicEffect(room, "action-weapon-switch", player, {
    radius: 90,
    playerId: player.id,
    variant: weapon.id
  });
  touch(room);
}

function gunnerDamageAtDistance(weapon, distanceToTarget) {
  if (weapon.id === "sniper") return weapon.damage;
  const ratio = clampNumber(distanceToTarget / Math.max(1, weapon.range), 0, 1, 0);
  const multiplier = Math.max(weapon.minDamageRatio, 1 - (1 - weapon.minDamageRatio) * ratio);
  return Math.round(weapon.damage * multiplier * 100) / 100;
}

function findGunnerTarget(room, shooter, weapon, dx, dy, options = {}) {
  return [...room.players.values()]
    .filter((player) => player.id !== shooter.id && player.alive && !player.ejected)
    .map((player) => {
      const relativeX = player.x - shooter.x;
      const relativeY = player.y - shooter.y;
      const along = relativeX * dx + relativeY * dy;
      const perpendicular = Math.abs(relativeX * dy - relativeY * dx);
      return { player, along, perpendicular };
    })
    .filter((entry) => entry.along > 8 && entry.along <= weapon.range && entry.perpendicular <= weapon.lineWidth)
    .filter((entry) => clearShotPath(room, shooter, entry.player, dx, dy, { ignoreCover: Boolean(options.ignoreCover) }))
    .sort((a, b) => a.along - b.along)[0] || null;
}

function gunnerSpecialAmmoLabel(type) {
  return GUNNER_SPECIAL_AMMO_LABELS[type] || "特殊弾";
}

function ensureGunnerSpecialAmmoInventory(player) {
  if (!player.gunnerSpecialAmmoInventory || typeof player.gunnerSpecialAmmoInventory !== "object") {
    player.gunnerSpecialAmmoInventory = { weak: 0, shock: 0 };
    const legacyType = String(player.gunnerSpecialAmmoType || "");
    if (GUNNER_SPECIAL_AMMO_TYPES.includes(legacyType)) {
      player.gunnerSpecialAmmoInventory[legacyType] = Math.max(0, Math.floor(Number(player.gunnerSpecialAmmoRounds) || 0));
    }
  }
  for (const type of GUNNER_SPECIAL_AMMO_TYPES) {
    player.gunnerSpecialAmmoInventory[type] = Math.max(0, Math.floor(Number(player.gunnerSpecialAmmoInventory[type]) || 0));
  }
  return player.gunnerSpecialAmmoInventory;
}

function activateStoredGunnerSpecialAmmo(player, weaponId = player?.gunnerWeapon) {
  const inventory = ensureGunnerSpecialAmmoInventory(player);
  const activeType = String(player?.gunnerSpecialAmmoType || "");
  const nextType = GUNNER_SPECIAL_AMMO_TYPES.includes(activeType) && inventory[activeType] > 0
    ? activeType
    : GUNNER_SPECIAL_AMMO_TYPES.find((type) => inventory[type] > 0) || "";
  if (!nextType) {
    clearGunnerSpecialAmmo(player);
    return "";
  }
  player.gunnerSpecialAmmoType = nextType;
  player.gunnerSpecialAmmoWeapon = String(weaponId || player?.gunnerWeapon || DEFAULT_GUNNER_WEAPON);
  player.gunnerSpecialAmmoRounds = inventory[nextType];
  return nextType;
}

function gunnerSpecialAmmoTypeForShot(player, weaponId) {
  const inventory = ensureGunnerSpecialAmmoInventory(player);
  const type = String(player?.gunnerSpecialAmmoType || "");
  if (!GUNNER_SPECIAL_AMMO_TYPES.includes(type)) return "";
  if (String(player?.gunnerSpecialAmmoWeapon || "") !== String(weaponId || "")) return "";
  player.gunnerSpecialAmmoRounds = inventory[type];
  return inventory[type] > 0 ? type : "";
}

function clearGunnerSpecialAmmo(player) {
  player.gunnerSpecialAmmoType = "";
  player.gunnerSpecialAmmoWeapon = "";
  player.gunnerSpecialAmmoRounds = 0;
}

function consumeGunnerSpecialAmmoRound(player, weaponId) {
  const type = gunnerSpecialAmmoTypeForShot(player, weaponId);
  if (!type) return "";
  const inventory = ensureGunnerSpecialAmmoInventory(player);
  inventory[type] = Math.max(0, inventory[type] - 1);
  player.gunnerSpecialAmmoRounds = inventory[type];
  if (inventory[type] <= 0) activateStoredGunnerSpecialAmmo(player, weaponId);
  return type;
}

function applyShockSpecialRound(room, shooter, target, timestamp = now(), options = {}) {
  if (!target?.alive || target.ejected) return "miss";
  if (!options.ignoreFriendlyFire && shooter?.role === target.role && ["defender", "attacker"].includes(shooter?.role) && shooter.id !== target.id) {
    applyDefenderFriendlyFirePenalty(room, shooter, target, timestamp);
    return "friendlyFirePenalty";
  }
  if (!options.bypassSlashGuard) {
    const guardOutcome = resolveFighterSlashGuard(room, shooter, target, {
      kind: "shock-bullet",
      label: "ショック弾",
      physical: true,
      reflectable: true,
      damage: 0.01,
      hitZone: "body",
      reflectEffect: ({ defender, source }) => applyShockSpecialRound(room, defender, source, timestamp, {
        bypassSlashGuard: true,
        ignoreFriendlyFire: true,
        reflected: true
      })
    }, timestamp);
    if (guardOutcome) return guardOutcome;
  }
  if (absorbPreparationBarrier(room, target, timestamp, shooter)) return "preparationBarrier";
  if (hasFighterInfiniteResources(target)) {
    syncFighterInfiniteResources(target);
    pushEvent(room, `${target.name} は無限HPと無限踏ん張りでショック弾を防ぎました。`);
    touch(room);
    return "infiniteResources";
  }
  if (luckValueFor(target) < GUNNER_SHOCK_LOW_LUCK_THRESHOLD) {
    return killPlayer(room, shooter, target.id, {
      ranged: true,
      hitZone: "head",
      damage: 2,
      allowAnyKiller: true,
      ignoreRange: true,
      ignoreCooldown: true,
      preserveCooldown: true,
      ignoreFriendlyFire: true,
      bypassSlashGuard: true,
      targetRole: target.role,
      attackKind: options.reflected ? "reflected-shock-bullet" : "shock-bullet",
      attackLabel: options.reflected ? "反射されたショック弾" : "ショック弾",
      slashGuardPhysical: true
    });
  }
  if (rejectAdverseStatusDuringNaturalRecovery(room, target, "ショック弾減速", timestamp)) {
    pushEvent(room, `${target.name} はショック弾の減速を理知の自然回復で無効化しました。`);
    touch(room);
    return "statusImmune";
  }
  target.shockSlowedUntil = Math.max(Number(target.shockSlowedUntil) || 0, timestamp + GUNNER_SHOCK_SLOW_MS);
  pushEvent(room, `${target.name} はショック弾で6秒間移動速度が35%低下します。`);
  touch(room);
  return "shockSlowed";
}

function fireGunnerRound(room, shooter, weapon, timestamp) {
  const remainingAmmo = Math.max(0, Number(shooter.gunnerAmmo?.[weapon.id]) || 0);
  if (remainingAmmo < weapon.ammoPerShot) return false;
  shooter.gunnerAmmo[weapon.id] = remainingAmmo - weapon.ammoPerShot;
  const enhanceLevel = Math.min(ENHANCE_MAX_LEVEL, Math.max(0, Math.floor(Number(shooter.gunnerBurstEnhanceLevel) || 0)));
  const gbo = Boolean(shooter.gunnerBurstGbo && shooter.gunnerBurstGboWeapon === weapon.id);
  const effectiveWeapon = gbo
    ? { ...weapon, range: weapon.range * GBO_PERFORMANCE_MULTIPLIER, cooldownMs: Math.max(1, weapon.cooldownMs / GBO_PERFORMANCE_MULTIPLIER) }
    : weapon;
  const specialAmmoType = consumeGunnerSpecialAmmoRound(shooter, weapon.id);
  shooter.gunnerLastShotAt = timestamp;
  shooter.gunReadyAt = timestamp + effectiveWeapon.cooldownMs;
  pushSound(room, "gunshot", shooter, {
    ownerId: shooter.id,
    sourceKind: "player",
    maxDistance: weapon.soundDistance,
    volume: weapon.volume,
    variant: weapon.id
  });

  const { dx, dy } = finiteDirection(shooter.aimX, shooter.aimY, 0, 1);
  const targetEntry = findGunnerTarget(room, shooter, effectiveWeapon, dx, dy, { ignoreCover: true });
  const endPoint = targetEntry
    ? { x: shooter.x + dx * targetEntry.along, y: shooter.y + dy * targetEntry.along }
    : shotEndPoint(room, shooter, dx, dy, effectiveWeapon.range);
  pushMagicEffect(room, "action-shoot", shooter, {
    radius: Math.max(90, weapon.lineWidth * 2),
    playerId: shooter.id,
    targetX: endPoint.x,
    targetY: endPoint.y,
    variant: weapon.id
  });
  if (specialAmmoType) {
    pushMagicEffect(room, "action-special-ammo-shot", shooter, {
      radius: Math.max(110, weapon.lineWidth * 2.2),
      playerId: shooter.id,
      targetId: targetEntry?.player?.id || "",
      targetX: endPoint.x,
      targetY: endPoint.y,
      variant: `${specialAmmoType}:${weapon.id}`
    });
  }

  if (targetEntry) {
    if (shooter.isBot) {
      const botShotLabel = shooter.gunnerSnipingActive
        ? `エイム・${weapon.name}HS`
        : specialAmmoType === "weak"
          ? "ウィーク弾"
          : specialAmmoType === "shock"
            ? "ショック弾"
            : `${gbo ? "GBO・" : ""}${weapon.name}の銃弾`;
      rememberBotKillDecision(room, shooter, targetEntry.player, {
        code: "visible-target-first-in-clear-gun-line",
        actionLabel: botShotLabel,
        reasons: ["射線上で最初に命中する対象を直接視認し、射程・弾薬・射撃間隔の条件を満たした"]
      }, timestamp);
    }
    if (shooter.gunnerSnipingActive) {
      pushMagicEffect(room, "action-gunner-aim-headshot", targetEntry.player, {
        radius: 150,
        playerId: shooter.id,
        targetId: targetEntry.player.id,
        variant: weapon.id
      });
      const outcome = killPlayer(room, shooter, targetEntry.player.id, {
        ranged: true,
        hitZone: "head",
        allowAnyKiller: true,
        targetRole: targetEntry.player.role,
        attackKind: "gunner-stationary-aim-headshot",
        attackLabel: `エイム・${weapon.name}HS`,
        slashGuardPhysical: true
      });
      finishGunnerBurstRound(room, shooter, weapon, timestamp);
      checkWin(room);
      touch(room);
      return true;
    }
    if (specialAmmoType === "weak") {
      pushMagicEffect(room, "action-special-ammo-impact", targetEntry.player, {
        radius: 145,
        playerId: shooter.id,
        targetId: targetEntry.player.id,
        variant: "weak:target-destruction"
      });
      const targetDestroyed = destroyPlayerUnconditionally(
        room,
        shooter,
        targetEntry.player,
        "ウィーク弾",
        {
          noKillCutin: false,
          attackKind: "weak-bullet",
          attackLabel: "ウィーク弾",
          slashGuardPhysical: true,
          slashGuardReflectable: true,
          reflectDestroy: true
        }
      );
      pushEvent(room, targetDestroyed
        ? `${shooter.name} のウィーク弾が命中し、${targetEntry.player.name}を破壊しました。`
        : `${shooter.name} のウィーク弾は対象側の防御または反射で破壊に至りませんでした。`);
      finishGunnerBurstRound(room, shooter, weapon, timestamp);
      checkWin(room);
      touch(room);
      return true;
    }
    if (specialAmmoType === "shock") {
      const outcome = applyShockSpecialRound(room, shooter, targetEntry.player, timestamp);
      pushMagicEffect(room, "action-special-ammo-impact", targetEntry.player, {
        radius: 135,
        playerId: shooter.id,
        targetId: targetEntry.player.id,
        variant: `shock:${outcome}`
      });
      finishGunnerBurstRound(room, shooter, weapon, timestamp);
      checkWin(room);
      touch(room);
      return true;
    }
    const baseDamage = gunnerDamageAtDistance(effectiveWeapon, targetEntry.along);
    const damage = Math.round(baseDamage * (1 + enhanceLevel * GUNNER_ENHANCE_DAMAGE_PER_LEVEL) * (gbo ? GBO_PERFORMANCE_MULTIPLIER : 1) * 100) / 100;
    const outcome = killPlayer(room, shooter, targetEntry.player.id, {
      ranged: true,
      hitZone: "body",
      damage,
      allowAnyKiller: true,
      targetRole: targetEntry.player.role,
      attackKind: gbo ? "gbo-bullet" : "bullet",
      attackLabel: `${gbo ? "GBO・" : ""}${weapon.name}の銃弾`,
      slashGuardPhysical: true
    });
    if (weapon.id === "taser" && !["lethal", "slashGuarded", "slashPerfectGuarded", "slashPerfectReflected"].includes(outcome) && targetEntry.player.alive) {
      if (rejectAdverseStatusDuringNaturalRecovery(room, targetEntry.player, "テーザー減速", timestamp)) {
        pushEvent(room, `${targetEntry.player.name} はテーザーの減速を理知の自然回復で無効化しました。`);
      } else {
        targetEntry.player.taserSlowedUntil = Math.max(targetEntry.player.taserSlowedUntil || 0, timestamp + weapon.slowMs * (gbo ? GBO_PERFORMANCE_MULTIPLIER : 1));
        pushMagicEffect(room, "action-taser", targetEntry.player, { radius: 95, playerId: shooter.id, targetId: targetEntry.player.id });
        pushEvent(room, `${targetEntry.player.name} はテーザーで痺れ、${Math.round(weapon.slowMs * (gbo ? GBO_PERFORMANCE_MULTIPLIER : 1) / 1000)}秒間移動速度が低下します。`);
      }
    }
  } else {
    touch(room);
  }
  finishGunnerBurstRound(room, shooter, weapon, timestamp);
  return true;
}

function advanceGunnerFire(room, shooter, timestamp = now()) {
  if (!shooter.gunFiring) return;
  const weapon = GUNNER_WEAPONS[shooter.gunFiringWeapon] || gunnerWeaponFor(shooter);
  if (room.phase !== "playing" || !shooter.alive || shooter.ejected || shooter.inVent || actionBlockedUntil(shooter) > timestamp || !itemStorageAvailable(shooter, timestamp)) {
    stopGunnerFire(room, shooter, { reason: "中断" });
    return;
  }
  if ((Number(shooter.gunReadyAt) || 0) > timestamp) return;
  const fired = fireGunnerRound(room, shooter, weapon, timestamp);
  if (!fired) {
    const gbo = Boolean(shooter.gunnerBurstGbo && shooter.gunnerBurstGboWeapon === weapon.id);
    stopGunnerFire(room, shooter, { reason: "弾切れ" });
    if (!gbo) startGunnerReload(room, shooter, weapon.id, timestamp, "弾倉が空になったため");
    return;
  }
}

function shootGunner(room, shooter, rawDx, rawDy, action = "start", rawHoldMs = 0, chargeId = "", serverInternal = false) {
  if (!hasFirearmAccess(shooter)) throw new ApiError(403, "使用できる銃器を所持していません。");
  if (action === "stop") {
    // Trigger release no longer controls firing. One accepted activation owns
    // the current magazine until it is consumed or an authoritative state
    // interruption stops it.
    return;
  }
  if (room.phase !== "playing") throw new ApiError(400, "バトル中のみ射撃できます。");
  if (!shooter.alive || shooter.ejected || shooter.inVent) throw new ApiError(403, "現在は射撃できません。");
  ensureAbilityAvailable(shooter);
  ensureItemStorageAvailable(shooter);
  if (shooter.gunFiring) return;
  const timestamp = now();
  const weapon = gunnerWeaponFor(shooter);
  if (!shooter.gunnerAmmo || typeof shooter.gunnerAmmo !== "object") shooter.gunnerAmmo = createGunnerAmmo();
  if ((Number(shooter.gunnerReloadUntil) || 0) > timestamp) throw new ApiError(400, "リロード中です。");
  const remainingAmmo = Math.max(0, Number(shooter.gunnerAmmo[weapon.id]) || 0);
  if (remainingAmmo < weapon.ammoPerShot) {
    startGunnerReload(room, shooter, weapon.id, timestamp, "弾倉が空のため");
    return;
  }
  const power = resolveHeldPowerMode(room, shooter, rawHoldMs, `${weapon.name}ため撃ち`, {
    kind: "shoot",
    itemId: `weapon:${weapon.id}`,
    chargeId,
    gboEligible: true,
    allowUnchargedNormal: Boolean(serverInternal)
  });
  const enhanceLevel = power.enhanceLevel;
  advanceGunnerAimPassive(room, shooter, timestamp);
  const fallbackDx = Number.isFinite(Number(shooter.aimX)) ? Number(shooter.aimX) : 0;
  const fallbackDy = Number.isFinite(Number(shooter.aimY)) ? Number(shooter.aimY) : 1;
  let dx = shooter.gunnerSnipingActive ? fallbackDx : clampNumber(rawDx, -1, 1, fallbackDx);
  let dy = shooter.gunnerSnipingActive ? fallbackDy : clampNumber(rawDy, -1, 1, fallbackDy);
  const length = Math.hypot(dx, dy) || 1;
  dx /= length;
  dy /= length;
  shooter.aimX = dx;
  shooter.aimY = dy;
  shooter.gunFiring = true;
  shooter.gunFiringWeapon = weapon.id;
  shooter.gunFiringSince = timestamp;
  shooter.gunnerBurstRoundsRemaining = Math.max(1, Math.ceil(remainingAmmo / weapon.ammoPerShot));
  shooter.gunnerBurstEnhanceLevel = enhanceLevel;
  shooter.gunnerBurstGbo = power.mode === "gbo";
  shooter.gunnerBurstGboWeapon = power.mode === "gbo" ? weapon.id : "";
  shooter.gunReadyAt = timestamp;
  if (power.mode === "gbo") pushGboOverdriveEffect(room, shooter, `weapon:${weapon.id}`, "magazine-commit");
  setImmediateFeedback(
    shooter,
    power.mode === "gbo" ? "GBO・1弾倉射撃" : enhanceLevel ? `ため撃ち Lv${enhanceLevel}` : "1弾倉射撃",
    `${weapon.name} / 残り${shooter.gunnerBurstRoundsRemaining}発${power.mode === "gbo" ? " / 通常ダメージ・射程・cadence×10 / 完了・中断時に武器破壊" : enhanceLevel ? ` / 与ダメージ×${(1 + enhanceLevel * GUNNER_ENHANCE_DAMAGE_PER_LEVEL).toFixed(1)}` : ""}`
  );
  advanceGunnerFire(room, shooter, timestamp);
  touch(room);
}

function startGunnerReload(room, player, weaponId = gunnerWeaponFor(player).id, timestamp = now(), reason = "") {
  const weapon = GUNNER_WEAPONS[weaponId];
  if (!weapon || !gunnerWeaponAvailable(player, weaponId)) return false;
  player.gunnerAmmo ||= createGunnerAmmo();
  if ((Number(player.gunnerAmmo[weaponId]) || 0) >= weapon.maxAmmo) return false;
  if ((Number(player.gunnerReloadUntil) || 0) > timestamp && player.gunnerReloadWeapon === weaponId) return false;
  stopGunnerFire(room, player, { reason: "リロード" });
  if (!gunnerWeaponAvailable(player, weaponId)) return false;
  player.gunnerReloadWeapon = weaponId;
  player.gunnerReloadUntil = timestamp + GUNNER_RELOAD_MS;
  pushMagicEffect(room, "action-reload", player, { radius: 90, playerId: player.id, variant: `${weapon.id}:start` });
  pushEvent(room, `${player.name} が${weapon.name}の自動リロードを開始しました${reason ? `（${reason}）` : ""}。`);
  touch(room);
  return true;
}

function advanceGunnerReload(room, player, timestamp = now()) {
  if (room.phase === "meeting") return false;
  if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent || !hasFirearmAccess(player)) {
    player.gunnerReloadUntil = 0;
    player.gunnerReloadWeapon = "";
    return false;
  }
  const activeUntil = Number(player.gunnerReloadUntil) || 0;
  if (activeUntil > 0) {
    if (timestamp < activeUntil) return false;
    const weaponId = player.gunnerReloadWeapon;
    const weapon = GUNNER_WEAPONS[weaponId];
    player.gunnerReloadUntil = 0;
    player.gunnerReloadWeapon = "";
    if (!weapon || !gunnerWeaponAvailable(player, weaponId)) return false;
    player.gunnerAmmo ||= createGunnerAmmo();
    player.gunnerAmmo[weaponId] = weapon.maxAmmo;
    pushMagicEffect(room, "action-reload", player, { radius: 90, playerId: player.id, variant: `${weapon.id}:complete` });
    setImmediateFeedback(player, "自動リロード完了", `${weapon.name} ${weapon.maxAmmo}発`);
    touch(room);
    return true;
  }
  if (player.gunFiring) return false;
  const weapon = gunnerWeaponFor(player);
  if (!gunnerWeaponAvailable(player, weapon.id)) return false;
  const ammo = Math.max(0, Number(player.gunnerAmmo?.[weapon.id]) || 0);
  if (ammo >= weapon.maxAmmo) return false;
  const lastShotAt = Number(player.gunnerLastShotAt) || 0;
  if (ammo < weapon.ammoPerShot || (lastShotAt > 0 && timestamp - lastShotAt >= GUNNER_IDLE_AUTO_RELOAD_DELAY_MS)) {
    return startGunnerReload(room, player, weapon.id, timestamp, ammo < weapon.ammoPerShot ? "弾倉が空のため" : "射撃停止後の自動補填");
  }
  return false;
}

function nextGunnerSpecialAmmoType(player) {
  let bag = Array.isArray(player.gunnerSpecialAmmoBag)
    ? player.gunnerSpecialAmmoBag.filter((type) => GUNNER_SPECIAL_AMMO_TYPES.includes(type))
    : [];
  if (!bag.length) {
    bag = [...GUNNER_SPECIAL_AMMO_TYPES];
    for (let index = bag.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [bag[index], bag[swapIndex]] = [bag[swapIndex], bag[index]];
    }
    const previous = String(player.gunnerSpecialAmmoType || "");
    if (bag.length > 1 && bag[0] === previous) [bag[0], bag[1]] = [bag[1], bag[0]];
  }
  const type = bag.shift() || GUNNER_SPECIAL_AMMO_TYPES[0];
  player.gunnerSpecialAmmoBag = bag;
  return type;
}

function advanceGunnerSpecialAmmoPassive(room, player, timestamp = now()) {
  if (room.phase === "meeting") return false;
  const eligible = room.phase === "playing" &&
    player.alive &&
    !player.ejected &&
    !player.inVent &&
    hasOperatorAccess(player, "gunner") &&
    passivesEnabled(player);
  if (!eligible) {
    player.gunnerSpecialAmmoReadyAt = 0;
    return false;
  }
  if (!(Number(player.gunnerSpecialAmmoReadyAt) > 0)) {
    player.gunnerSpecialAmmoReadyAt = timestamp + GUNNER_SPECIAL_AMMO_INTERVAL_MS;
    return false;
  }
  if (timestamp < player.gunnerSpecialAmmoReadyAt) return false;
  const weapon = gunnerWeaponFor(player);
  if (!gunnerWeaponAvailable(player, weapon.id)) {
    player.gunnerSpecialAmmoReadyAt = timestamp + GUNNER_SPECIAL_AMMO_INTERVAL_MS;
    return false;
  }
  const type = nextGunnerSpecialAmmoType(player);
  const inventory = ensureGunnerSpecialAmmoInventory(player);
  player.gunnerAmmo ||= createGunnerAmmo();
  player.gunnerAmmo[weapon.id] = weapon.maxAmmo;
  inventory[type] += weapon.maxAmmo;
  // A different newly awarded kind remains stored while a valid loaded kind
  // stays active. Whichever kind is active is rebound to the firearm selected
  // at award time; later weapon switches rebind it again.
  const activeType = activateStoredGunnerSpecialAmmo(player, weapon.id);
  player.gunnerSpecialAmmoReadyAt = timestamp + GUNNER_SPECIAL_AMMO_INTERVAL_MS;
  if (player.gunnerReloadWeapon === weapon.id) {
    player.gunnerReloadUntil = 0;
    player.gunnerReloadWeapon = "";
  }
  pushMagicEffect(room, "action-special-ammo-load", player, {
    radius: 125,
    playerId: player.id,
    variant: `${type}:${weapon.id}`
  });
  const activeLabel = gunnerSpecialAmmoLabel(activeType || type);
  setImmediateFeedback(player, "特殊弾獲得", `${gunnerSpecialAmmoLabel(type)} +${weapon.maxAmmo}発 / ${activeLabel}を${weapon.shortName || weapon.name}へ適用 / ${gunnerSpecialAmmoLabel(type)}所持${inventory[type]}発`);
  pushEvent(room, `${player.name} が${gunnerSpecialAmmoLabel(type)}弾を${weapon.maxAmmo}発獲得し、装填中の${activeLabel}を選択中の${weapon.shortName || weapon.name}へ適用しました（${gunnerSpecialAmmoLabel(type)}所持${inventory[type]}発）。`);
  touch(room);
  return true;
}

function reloadGunner(room, player) {
  if (room.phase !== "playing" || !hasFirearmAccess(player) || !player.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "現在はリロードできません。");
  }
  ensureConscious(player);
  ensureItemStorageAvailable(player);
  const weapon = gunnerWeaponFor(player);
  if ((Number(player.gunnerAmmo?.[weapon.id]) || 0) >= weapon.maxAmmo) throw new ApiError(400, "弾倉は満タンです。");
  startGunnerReload(room, player, weapon.id, now(), "手動要求");
}

function clearGunnerAim(player) {
  if (!player) return false;
  const changed = Boolean(player.gunnerSnipingActive || player.gunnerAimTargetId);
  player.gunnerSnipingActive = false;
  player.gunnerAimTargetId = "";
  return changed;
}

function gunnerAimCandidates(room, player) {
  const weapon = gunnerWeaponFor(player);
  return [...room.players.values()]
    .filter((target) => (
      target.id !== player.id &&
      target.alive &&
      !target.ejected &&
      !target.inVent &&
      distance(player, target) <= weapon.range
    ))
    .filter((target) => {
      const dx = target.x - player.x;
      const dy = target.y - player.y;
      const length = Math.hypot(dx, dy) || 1;
      return clearShotPath(room, player, target, dx / length, dy / length);
    })
    .sort((a, b) => distance(player, a) - distance(player, b) || a.id.localeCompare(b.id));
}

function gunnerAimMovementAllowed(player) {
  return String(player?.movementMode || "idle") !== "dash";
}

function advanceGunnerAimPassive(room, player, timestamp = now()) {
  const eligible = Boolean(
    room?.phase === "playing" &&
    player?.alive &&
    !player.ejected &&
    !player.inVent &&
    !player.drone?.active &&
    hasOperatorAccess(player, "gunner") &&
    passivesEnabled(player) &&
    gunnerAimMovementAllowed(player)
  );
  if (!eligible) return clearGunnerAim(player);
  const candidates = gunnerAimCandidates(room, player);
  const previousTargetId = String(player.gunnerAimTargetId || "");
  const target = candidates.find((candidate) => candidate.id === previousTargetId) || candidates[0] || null;
  if (!target) return clearGunnerAim(player);
  const dx = target.x - player.x;
  const dy = target.y - player.y;
  const length = Math.hypot(dx, dy) || 1;
  player.aimX = dx / length;
  player.aimY = dy / length;
  player.gunnerSnipingActive = true;
  player.gunnerAimTargetId = target.id;
  if (target.id !== previousTargetId) {
    pushMagicEffect(room, "gunner-passive-aim", player, {
      radius: 118,
      playerId: player.id,
      targetId: target.id,
      targetX: target.x,
      targetY: target.y,
      variant: gunnerWeaponFor(player).id,
      durationMs: 900
    });
    setImmediateFeedback(player, "エイム", "非ダッシュ・可視対象を追尾");
  }
  return true;
}

function useHeavyWeapon(room, player, weaponId, rawHoldMs = 0, chargeId = "") {
  if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "現在は重火器を使用できません。");
  }
  ensureAbilityAvailable(player);
  ensureItemStorageAvailable(player);
  const weapon = String(weaponId || "");
  if (!HEAVY_WEAPON_DEFINITIONS[weapon]) throw new ApiError(400, "重火器の種類が不正です。");
  const index = (player.heavyWeapons || []).indexOf(weapon);
  if (index < 0) throw new ApiError(400, "その重火器を所持していません。");
  const power = resolveHeldPowerMode(room, player, rawHoldMs, HEAVY_WEAPON_DEFINITIONS[weapon].label, {
    kind: "use",
    itemId: `heavy:${weapon}`,
    chargeId,
    gboEligible: true
  });
  const performanceMultiplier = power.mode === "gbo"
    ? GBO_PERFORMANCE_MULTIPLIER
    : 1 + power.enhanceLevel * GUNNER_ENHANCE_DAMAGE_PER_LEVEL;
  player.heavyWeapons.splice(index, 1);
  if (power.mode === "gbo") pushGboOverdriveEffect(room, player, `heavy:${weapon}`, "heavy-use");
  const targets = [...room.players.values()].filter((target) => target.id !== player.id && target.alive && !target.ejected);
  if (weapon === "rpg") {
    for (const target of targets.filter((candidate) => distance(player, candidate) <= 300 * performanceMultiplier)) {
      try {
        killPlayer(room, player, target.id, {
          ranged: true, hitZone: "body", damage: 1 * performanceMultiplier, ignoreRange: true,
          allowAnyKiller: true, targetRole: target.role, magic: false,
          attackKind: "rpg", attackLabel: "RPG弾", slashGuardPhysical: true
        });
      } catch {}
    }
    pushMagicEffect(room, "gunner-rpg", player, { radius: 300 * performanceMultiplier, playerId: player.id, variant: power.mode });
  } else if (weapon === "missile") {
    const target = targets.sort((a, b) => distance(player, a) - distance(player, b))[0];
    if (target) {
      try {
        killPlayer(room, player, target.id, {
          ranged: true, hitZone: "head", damage: performanceMultiplier, ignoreRange: true,
          allowAnyKiller: true, targetRole: target.role, magic: false,
          attackKind: "missile", attackLabel: "ミサイル", slashGuardPhysical: true
        });
      } catch {}
      pushMagicEffect(room, "gunner-missile", player, { radius: 150 * performanceMultiplier, playerId: player.id, targetId: target.id, targetX: target.x, targetY: target.y, variant: power.mode });
    }
  }
  awardAbilityContribution(player, 1);
  pushSound(room, "heavyWeapon", player, { ownerId: player.id, sourceKind: "weapon", maxDistance: 10000, volume: 1.25, variant: weapon });
  pushEvent(room, `${player.name} が${HEAVY_WEAPON_DEFINITIONS[weapon].label}を使用しました${power.mode === "gbo" ? "（GBO・数値性能×10・武具破壊）" : power.enhanceLevel ? `（エンハンスLv${power.enhanceLevel}）` : ""}。`);
  checkWin(room);
  touch(room);
}

function reportBody(room, player, bodyId = "") {
  if (room.phase !== "playing") throw new ApiError(400, "いまは通報できません。");
  if (!player.alive || player.ejected || player.inVent) throw new ApiError(403, "通報できません。");
  ensureConscious(player);
  const map = getMap(room);
  const body = room.bodies
    .map((item) => ({ item, dist: distance(player, item) }))
    .filter(({ item, dist }) => dist <= map.reportRange && (!bodyId || item.id === bodyId))
    .sort((a, b) => a.dist - b.dist)[0]?.item;
  if (!body) throw new ApiError(404, "近くに通報対象がありません。");
  const visibleEvidenceTarget = player.isBot ? botKnownAttackerEvidence(room, player, now()) : null;
  const suspectId = visibleEvidenceTarget && botCanCommitLuminous(room, player, visibleEvidenceTarget.id)
    ? String(visibleEvidenceTarget.id)
    : "";
  if (player.isBot && !suspectId) throw new ApiError(403, "ルミナスを実行しないBOTは通報しません。");
  startMeeting(room, `${player.name} が ${body.name} を通報`, player.id, {
    suspectId,
    evidenceKind: suspectId ? String(player.botWitnessEvidenceKind || "witness") : ""
  });
}

function runAutomaticHumanBodyReports(room, timestamp = now()) {
  if (room.phase !== "playing" || !room.bodies.length) return false;
  const reportRange = getMap(room).reportRange;
  for (const player of room.players.values()) {
    if (player.isBot || !player.alive || player.ejected || player.inVent) continue;
    if (actionBlockedUntil(player) > timestamp) continue;
    const body = room.bodies
      .map((item) => ({ item, dist: distance(player, item) }))
      .filter(({ item, dist }) => (
        dist <= reportRange &&
        !(item.killerId === player.id && timestamp - (Number(item.at) || timestamp) < AUTO_REPORT_POST_KILL_GRACE_MS)
      ))
      .sort((a, b) => a.dist - b.dist)[0]?.item;
    if (!body) continue;
    try {
      reportBody(room, player, body.id);
      return true;
    } catch {}
  }
  return false;
}

function callEmergency(room, player, suspectId = "", evidenceKind = "") {
  if (room.phase !== "playing") throw new ApiError(400, "いまはEmergencyを押せません。");
  if (!player.alive || player.ejected || player.inVent) throw new ApiError(403, "Emergencyを押せません。");
  ensureConscious(player);
  if (player.emergenciesLeft <= 0) throw new ApiError(400, "Emergency回数を使い切っています。");
  player.emergenciesLeft -= 1;
  player.smartphoneAction = "emergency";
  player.smartphoneSuspectId = String(suspectId || "");
  player.smartphoneEvidenceKind = String(evidenceKind || "");
  player.smartphoneUntil = now() + SMARTPHONE_ACTION_MS;
  player.vx = 0;
  player.vy = 0;
  pushMagicEffect(room, "action-smartphone", player, { radius: 85, playerId: player.id, variant: "emergency" });
  pushEvent(room, `${player.name} がスマホで緊急会議を要請中です（${SMARTPHONE_ACTION_MS / 1000}秒行動不能）。`);
  touch(room);
}

function resolveSmartphoneAction(room, player, timestamp) {
  if (!player.smartphoneAction || player.smartphoneUntil > timestamp) return;
  const action = player.smartphoneAction;
  const suspectId = player.smartphoneSuspectId || "";
  const evidenceKind = player.smartphoneEvidenceKind || "";
  player.smartphoneAction = "";
  player.smartphoneUntil = 0;
  player.smartphoneSuspectId = "";
  player.smartphoneEvidenceKind = "";
  if (!player.alive || player.ejected || room.phase !== "playing") return;
  if (action === "emergency") {
    startMeeting(room, `${player.name} がスマホから緊急会議を招集`, player.id, { suspectId, evidenceKind });
    return;
  }
  if (action === "repair") {
    for (const door of activeDoors(room)) delete room.doorState[door.id];
    if (room.sabotage) clearSabotage(room, `${player.name} がスマホから ${sabotageLabel(room.sabotage.type)} を遠隔修復しました。`);
    pushMagicEffect(room, "action-smartphone-repair", player, { radius: 125, playerId: player.id });
    pushEvent(room, `${player.name} のスマホ遠隔修復が完了しました。`);
    touch(room);
  }
}

function startSabotage(room, player, type) {
  if (room.phase !== "playing") throw new ApiError(400, "いまはサボタージュを実行できません。");
  if (player.role !== "attacker" || !player.alive || player.ejected) throw new ApiError(403, "サボタージュを実行できません。");
  ensureAbilityAvailable(player);
  const timestamp = now();
  if ((Number(player.sabotageReadyAt) || 0) > timestamp) {
    const remainingSeconds = Math.ceil((player.sabotageReadyAt - timestamp) / 1000);
    throw new ApiError(400, `サボタージュ再充填中です（残り${remainingSeconds}秒）。`);
  }
  const map = getMap(room);
  const sabotageType = ["comms", "reactor", "oxygen", "doors"].includes(type) ? type : "comms";
  if (sabotageType !== "doors" && room.sabotage) throw new ApiError(400, "既にサボタージュが発生中です。");
  if (sabotageType === "doors") {
    for (const door of map.doors) room.doorState[door.id] = timestamp + 12000;
    player.sabotageReadyAt = timestamp + SABOTAGE_COOLDOWN_MS;
    grantCredits(room, player, SABOTAGE_CREDIT_REWARD, "sabotage");
    pushEvent(room, `${player.name} が全室を封鎖しました。`);
    pushEvent(room, `${player.name} がサボタージュ報酬 ${SABOTAGE_CREDIT_REWARD}Cを獲得しました。`);
    pushDoorLog(room, "複数ドアがロック");
    pushMagicEffect(room, "action-sabotage", player, { radius: 135, playerId: player.id });
    markSoloMissionAction(room, player, "sabotage");
    touch(room);
    return;
  }
  const critical = sabotageType === "reactor" || sabotageType === "oxygen";
  room.sabotage = {
    type: sabotageType,
    sourceId: player.id,
    startedAt: timestamp,
    endsAt: critical ? timestamp + 45_000 : timestamp + 70_000,
    repairedPoints: {}
  };
  player.sabotageReadyAt = timestamp + SABOTAGE_COOLDOWN_MS;
  grantCredits(room, player, SABOTAGE_CREDIT_REWARD, "sabotage");
  pushEvent(room, `${sabotageLabel(sabotageType)} サボタージュ発生。`);
  pushEvent(room, `${player.name} がサボタージュ報酬 ${SABOTAGE_CREDIT_REWARD}Cを獲得しました。`);
  pushMagicEffect(room, "action-sabotage", player, { radius: 135, playerId: player.id });
  markSoloMissionAction(room, player, "sabotage");
  touch(room);
}

function sabotageLabel(type) {
  return {
    lights: "Grid Blackout",
    comms: "Signal Jam",
    reactor: "Core Breach",
    oxygen: "Atmos Leak",
    doors: "Lockdown"
  }[type] || type;
}

function repair(room, player) {
  if (room.phase !== "playing") throw new ApiError(400, "いまはRepairできません。");
  if (player.ejected || player.inVent) throw new ApiError(403, "Repairできません。");
  ensureConscious(player);
  const map = getMap(room);
  const timestamp = now();
  replenishStamina(player, timestamp, Math.hypot(Number(player.vx) || 0, Number(player.vy) || 0) <= 0.01);

  const closedDoors = activeDoors(room);
  const closedDoor = closedDoors
    .map((door) => ({ door, dist: distance(player, doorCenter(door)) }))
    .filter((entry) => entry.dist <= map.taskRange)
    .sort((a, b) => a.dist - b.dist)[0]?.door;
  if (closedDoor) {
    delete room.doorState[closedDoor.id];
    pushMagicEffect(room, "action-repair", player, { radius: 105, playerId: player.id });
    pushEvent(room, `${player.name} がドア封鎖を解除しました。`);
    touch(room);
    return;
  }

  if (closedDoors.length) {
    if (player.special !== "alchemist") throw new ApiError(400, "修理地点へ近づいてください。遠隔修復はハッカー専用です。");
    if (!player.alive) throw new ApiError(403, "遠隔修復は生存中のみ使用できます。");
    if (player.stamina < REMOTE_REPAIR_STAMINA_COST) {
      throw new ApiError(400, `遠隔修復にはスタミナ ${REMOTE_REPAIR_STAMINA_COST} が必要です。`);
    }
    spendStamina(player, REMOTE_REPAIR_STAMINA_COST, room, "スマホ修復");
    player.smartphoneAction = "repair";
    player.smartphoneUntil = timestamp + SMARTPHONE_ACTION_MS;
    player.vx = 0;
    player.vy = 0;
    pushMagicEffect(room, "action-smartphone", player, { radius: 85, playerId: player.id, variant: "repair" });
    pushEvent(room, `${player.name} がスタミナ ${REMOTE_REPAIR_STAMINA_COST} を消費し、スマホで全ドアを遠隔修復中です。`);
    touch(room);
    return;
  }

  if (!room.sabotage) throw new ApiError(404, "修理対象がありません。");
  const type = room.sabotage.type;
  const near = nearestStation(room, player, (station) => station.type === "repair" && station.repair === type, map.taskRange);
  if (!near) {
    if (player.special !== "alchemist") throw new ApiError(400, "修理地点へ近づいてください。遠隔修復はハッカー専用です。");
    if (!player.alive) throw new ApiError(403, "遠隔修復は生存中のみ使用できます。");
    if (player.stamina < REMOTE_REPAIR_STAMINA_COST) {
      throw new ApiError(400, `遠隔修復にはスタミナ ${REMOTE_REPAIR_STAMINA_COST} が必要です。`);
    }
    spendStamina(player, REMOTE_REPAIR_STAMINA_COST, room, "スマホ修復");
    player.smartphoneAction = "repair";
    player.smartphoneUntil = timestamp + SMARTPHONE_ACTION_MS;
    player.vx = 0;
    player.vy = 0;
    pushMagicEffect(room, "action-smartphone", player, { radius: 85, playerId: player.id, variant: "repair" });
    pushEvent(room, `${player.name} がスマホで ${sabotageLabel(type)} を遠隔修復中です（${SMARTPHONE_ACTION_MS / 1000}秒行動不能）。`);
    touch(room);
    return;
  }

  if (type === "reactor" || type === "oxygen") {
    room.sabotage.repairedPoints[near.station.id] = player.id;
    const repaired = Object.keys(room.sabotage.repairedPoints).length;
    pushEvent(room, `${player.name} が修復ポイントを起動しました。`);
    if (repaired >= 2) clearSabotage(room, `${sabotageLabel(type)} を修理しました。`);
  } else {
    clearSabotage(room, `${player.name} が ${sabotageLabel(type)} を修理しました。`);
  }
  pushMagicEffect(room, "action-repair", player, { radius: 110, playerId: player.id });
  touch(room);
}

function startSmartphoneRepair(room, player) {
  if (room.phase !== "playing") throw new ApiError(400, "いまはスマホ修理できません。");
  if (!player.alive || player.ejected || player.inVent) throw new ApiError(403, "スマホ修理できません。");
  ensureConscious(player);
  const timestamp = now();
  if (player.special !== "alchemist") {
    repair(room, player);
    return;
  }
  ensureItemStorageAvailable(player, timestamp);
  if (!room.sabotage && !activeDoors(room).length) throw new ApiError(404, "修理対象がありません。");
  replenishStamina(player, timestamp, Math.hypot(Number(player.vx) || 0, Number(player.vy) || 0) <= 0.01);
  if (availableStamina(player) < REMOTE_REPAIR_STAMINA_COST) {
    throw new ApiError(400, `スマホ修理にはスタミナ ${REMOTE_REPAIR_STAMINA_COST} が必要です。`);
  }
  spendStamina(player, REMOTE_REPAIR_STAMINA_COST, room, "遠隔修復");
  player.smartphoneAction = "repair";
  player.smartphoneUntil = timestamp + SMARTPHONE_ACTION_MS;
  player.vx = 0;
  player.vy = 0;
  pushMagicEffect(room, "action-smartphone", player, { radius: 85, playerId: player.id, variant: "repair" });
  pushEvent(room, `${player.name} がスタミナ ${REMOTE_REPAIR_STAMINA_COST} を消費し、スマホ修理を開始しました。`);
  touch(room);
}

function doorCenter(door) {
  return { x: door.x + door.w / 2, y: door.y + door.h / 2 };
}

function makeUtility(room, player, type) {
  if (room.phase !== "playing") throw new ApiError(400, "会議中はUtilityを見られません。");
  if (player.ejected || player.inVent) throw new ApiError(403, "Utilityを見られません。");
  const utilityType = ["admin", "cameras", "vitals", "doorlog"].includes(type) ? type : "admin";
  const map = getMap(room);
  const near = nearestStation(room, player, (station) => station.type === "utility" && station.utility === utilityType, map.taskRange);
  if (!near) throw new ApiError(400, `${nearUtilityLabel(utilityType)} 端末に近づいてください。`);

  if (utilityType === "admin") {
    const counts = new Map();
    for (const other of room.players.values()) {
      if (other.ejected || other.inVent || !other.alive) continue;
      const roomName = whichRoom(map, other);
      counts.set(roomName, (counts.get(roomName) || 0) + 1);
    }
    return {
      type: utilityType,
      title: "Census Console",
      lines: [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([name, count]) => `${name}: ${count}`)
    };
  }

  if (utilityType === "vitals") {
    return {
      type: utilityType,
      title: "Biometrics",
      lines: [...room.players.values()].map((other) => {
        const status = other.ejected ? "追放" : other.alive ? "生存" : "死亡";
        return `${other.name}: ${status}`;
      })
    };
  }

  if (utilityType === "cameras") {
    const lines = map.cameras.map((camera) => {
      if (room.destroyedCameras[camera.id]) return `${camera.label}: OFFLINE (EMP)`;
      const seen = [...room.players.values()]
        .filter((other) => other.alive && !other.ejected && !other.inVent && distance(other, camera) <= camera.range)
        .map((other) => other.name);
      return `${camera.label}: ${seen.length ? seen.join(", ") : "反応なし"}`;
    });
    return { type: utilityType, title: "Optics", lines };
  }

  return {
    type: utilityType,
    title: "Transit Log",
    lines: room.doorLog.length ? room.doorLog.slice(-12).map((entry) => entry.text) : ["ログなし"]
  };
}

function nearUtilityLabel(type) {
  return {
    admin: "Census Console",
    cameras: "Optics",
    vitals: "Biometrics",
    doorlog: "Transit Log"
  }[type] || "Utility";
}

function vote(room, player, targetId) {
  if (room.phase !== "meeting" || !room.meeting) throw new ApiError(400, "投票中ではありません。");
  if (!player.alive || player.ejected) throw new ApiError(403, "投票できません。");
  if (now() < room.meeting.discussionEndsAt) throw new ApiError(400, "討論時間中です。");
  const target = targetId === "skip" ? "skip" : room.players.get(targetId)?.id;
  if (!target) throw new ApiError(404, "投票先がありません。");
  room.meeting.votes[player.id] = target;
  touch(room);
  maybeEndMeeting(room);
}

function removeDefeatedPlayerFromMeeting(meeting, playerId) {
  delete meeting.votes[playerId];
  for (const [voterId, targetId] of Object.entries(meeting.votes)) {
    if (targetId === playerId) meeting.votes[voterId] = "skip";
  }
}

function useLuminous(room, player, targetId) {
  if (room.phase !== "meeting" || !room.meeting) {
    throw new ApiError(400, "ルミナスは会議中のみ発動できます。");
  }
  if (player.role !== "defender") throw new ApiError(403, "ルミナスはディフェンダー専用です。");
  if (player.isBot && !botIsEnemyOfSoleHuman(room, player)) {
    throw new ApiError(403, "味方陣営のボットはルミナスを使用しません。");
  }
  if (!player.alive || player.ejected) throw new ApiError(403, "死亡または追放後は発動できません。");
  ensureConscious(player);
  if (player.luminousUsed) throw new ApiError(400, "ルミナスは1試合に1回だけ使用できます。");

  const target = room.players.get(targetId);
  if (!target || !target.alive || target.ejected || target.id === player.id) {
    throw new ApiError(404, "有効なルミナス対象がいません。");
  }

  const timestamp = now();
  player.luminousUsed = true;
  player.luminousActive = false;
  player.lastLuminousResultAt = timestamp;

  if (target.role === "attacker") {
    recordBotMatchElimination(room, target, player);
    target.alive = false;
    target.ejected = true;
    target.killCamera = null;
    target.inVent = false;
    target.ventId = "";
    target.bodyHits = 0;
    target.drone.active = false;
    clearAttackState(target);
    removeDefeatedPlayerFromMeeting(room.meeting, target.id);

    player.luminousActive = true;
    player.totalKills += 1;
    player.killsThisRound += 1;
    player.luminousContribution = 0;
    player.lastLuminousResult = "success";
    pushEvent(room, `${player.name} のルミナスが ${target.name} に的中。キルとして記録され、高速化を獲得しました。`);
  } else {
    recordBotMatchElimination(room, player, player);
    player.alive = false;
    recordKillCamera(room, player, player, {
      timestamp,
      actionLabel: "ルミナス失敗の代償",
      actionKind: "luminous-failure",
      sourceLabel: `対象: ${target.name}`
    });
    player.inVent = false;
    player.ventId = "";
    player.bodyHits = 0;
    player.drone.active = false;
    clearAttackState(player);
    completeTasksAfterDeath(room, player);
    removeDefeatedPlayerFromMeeting(room.meeting, player.id);
    player.lastLuminousResult = "failure";
    pushEvent(room, `${player.name} のルミナスは外れ、代償として死亡しました。`);
  }

  checkWin(room);
  if (room.phase === "meeting") maybeEndMeeting(room);
  touch(room);
}

function operatorState(room) {
  const operators = allOperators().map((operator) => ({
        id: operator.id,
        role: operator.role,
        originRole: operator.role,
        name: operator.name,
        special: operator.special,
        description: operator.description,
        details: operator.details,
        asset: operator.asset || "",
        limit: operator.limit,
        taken: operatorTakenCount(room, operator.id)
      }));
  return {
    defender: operators,
    attacker: operators
  };
}

function visibleStations(map) {
  return map.stations.filter((station) => {
    if (station.type === "repair" && station.repair === "lights") return false;
    if (station.type === "utility" && station.utility === "cameras") return false;
    return station.type !== "task" || station.task === "download" || station.task === "upload";
  });
}

function visibleBodies(room, viewer) {
  return room.bodies.map((body) => {
    const killer = room.players.get(body.killerId);
    const showKillCutin = Boolean(
      !body.noKillCutin &&
      killer &&
      killer.id !== body.playerId &&
      (viewer.id === killer.id || viewer.id === body.playerId)
    );
    return {
      ...body,
      showKillCutin,
      killerId: showKillCutin ? body.killerId : "",
      killerName: showKillCutin ? body.killerName : "",
      killerIsBot: showKillCutin ? body.killerIsBot : false,
      killerSkinId: showKillCutin ? body.killerSkinId || "hood" : ""
    };
  });
}

function clearStoredMovementInput(player, receivedAt = now()) {
  player.lastMovementClock = 0;
  player.lastMovementReceivedAt = receivedAt;
  player.lastMovementDx = 0;
  player.lastMovementDy = 0;
  player.lastMovementDash = false;
  player.lastMovementSlow = false;
}

function movementElapsedSeconds(player, movementClock, receivedAt) {
  const previousClock = Number(player.lastMovementClock) || 0;
  const previousReceivedAt = Number(player.lastMovementReceivedAt) || receivedAt;
  if (!Number.isFinite(movementClock) || previousClock <= 0 || movementClock <= previousClock) return 0;
  const clientElapsed = (movementClock - previousClock) / 1000;
  const serverElapsed = Math.max(0, (receivedAt - previousReceivedAt) / 1000);
  return Math.min(
    MOVEMENT_MAX_ELAPSED_SECONDS,
    Math.max(0, clientElapsed),
    serverElapsed + 0.05
  );
}

function advanceStoredMovement(room, player, elapsedSeconds) {
  const dx = Number(player.lastMovementDx) || 0;
  const dy = Number(player.lastMovementDy) || 0;
  if (Math.hypot(dx, dy) <= 0.0001 || elapsedSeconds <= 0) return;
  let remaining = elapsedSeconds;
  while (remaining > 0.00001) {
    const step = Math.min(MOVEMENT_INTEGRATION_STEP_SECONDS, remaining);
    movePlayer(room, player, dx, dy, step, Boolean(player.lastMovementDash), Boolean(player.lastMovementSlow));
    remaining -= step;
  }
}

function storeMovementInput(player, body) {
  let dx = clampNumber(body.dx, -1, 1, 0);
  let dy = clampNumber(body.dy, -1, 1, 0);
  const length = Math.hypot(dx, dy);
  if (length > 1) {
    dx /= length;
    dy /= length;
  }
  player.lastMovementDx = dx;
  player.lastMovementDy = dy;
  player.lastMovementDash = Boolean(body.dash);
  player.lastMovementSlow = Boolean(body.slow);
  return { dx, dy };
}

function processMovementInput(room, player, body) {
  const receivedAt = now();
  const movementSession = String(body.movementSession || "").slice(0, 96);
  const movementSessionStartedAtRaw = Number(body.movementSessionStartedAt);
  const movementSessionStartedAt = Number.isFinite(movementSessionStartedAtRaw)
    ? Math.min(movementSessionStartedAtRaw, receivedAt + 60_000)
    : receivedAt;
  const movementSeq = Number(body.movementSeq);
  if (movementSession && Number.isSafeInteger(movementSeq) && movementSeq >= 0) {
    if (player.movementSession !== movementSession) {
      if (movementSessionStartedAt < player.movementSessionStartedAt) {
        return serializeMovement(room, player, movementSeq);
      }
      player.movementSession = movementSession;
      player.movementSessionStartedAt = movementSessionStartedAt;
      player.lastMovementSeq = -1;
      clearStoredMovementInput(player, receivedAt);
    }
    if (movementSeq <= player.lastMovementSeq) return serializeMovement(room, player, movementSeq);
    player.lastMovementSeq = movementSeq;
  }
  const movementClock = Number(body.movementClock);
  const elapsed = movementElapsedSeconds(player, movementClock, receivedAt);
  advanceStoredMovement(room, player, elapsed);
  const input = storeMovementInput(player, body);
  player.lastMovementClock = Number.isFinite(movementClock) ? movementClock : 0;
  player.lastMovementReceivedAt = receivedAt;
  // Switch input state at the packet timestamp without assigning past time to
  // the new direction. The next packet integrates this stored input.
  movePlayer(room, player, input.dx, input.dy, 0, Boolean(body.dash), Boolean(body.slow));
  return serializeMovement(room, player, movementSeq, movementClock);
}

function clearJumpPreparation(player) {
  player.jumpPreparingAt = 0;
  player.jumpPrepareDx = 0;
  player.jumpPrepareDy = 1;
}

function finiteDirection(rawDx, rawDy, fallbackDx = 0, fallbackDy = 1) {
  const suppliedDx = Number(rawDx);
  const suppliedDy = Number(rawDy);
  const hasSuppliedDirection = Number.isFinite(suppliedDx) && Number.isFinite(suppliedDy) && Math.hypot(suppliedDx, suppliedDy) > 0.0001;
  const dx = hasSuppliedDirection ? suppliedDx : (Number.isFinite(Number(fallbackDx)) ? Number(fallbackDx) : 0);
  const dy = hasSuppliedDirection ? suppliedDy : (Number.isFinite(Number(fallbackDy)) ? Number(fallbackDy) : 1);
  const length = Math.hypot(dx, dy) || 1;
  return { dx: dx / length, dy: dy / length };
}

function hasFloorSupport(room, x, y, radius = 0) {
  const map = getMap(room);
  if (x < radius || y < radius || x > map.width - radius || y > map.height - radius) return false;
  return map.walkable.some((rect) => rectContains(rect, x, y, radius));
}

function jumpRayBoundaryDistance(map, origin, direction, radius) {
  const limits = [];
  if (direction.x > 0.0001) limits.push((map.width - radius - origin.x) / direction.x);
  else if (direction.x < -0.0001) limits.push((radius - origin.x) / direction.x);
  if (direction.y > 0.0001) limits.push((map.height - radius - origin.y) / direction.y);
  else if (direction.y < -0.0001) limits.push((radius - origin.y) / direction.y);
  return Math.max(0, Math.min(...limits.filter((value) => Number.isFinite(value) && value >= 0)));
}

function resolveJumpDestination(room, player, direction, requestedDistance) {
  const map = getMap(room);
  const radius = map.playerRadius;
  const boundaryDistance = jumpRayBoundaryDistance(map, player, direction, radius);
  const requested = Math.min(Math.max(0, requestedDistance), boundaryDistance);
  const step = Math.max(10, radius * 0.35);
  const pointAt = (distanceAlongRay) => ({
    x: player.x + direction.x * distanceAlongRay,
    y: player.y + direction.y * distanceAlongRay
  });

  let firstGapDistance = 0;
  const gapProbeDistance = Math.min(boundaryDistance, requested + Math.max(radius * 1.25, step * 2));
  for (let scan = step; scan <= gapProbeDistance + 0.001; scan += step) {
    const point = pointAt(Math.min(scan, gapProbeDistance));
    if (!hasFloorSupport(room, point.x, point.y, radius)) {
      firstGapDistance = scan;
      break;
    }
  }

  if (firstGapDistance > 0) {
    for (let scan = firstGapDistance + step; scan <= boundaryDistance + 0.001; scan += step) {
      const distanceAlongRay = Math.min(scan, boundaryDistance);
      const point = pointAt(distanceAlongRay);
      if (hasFloorSupport(room, point.x, point.y, radius) && isWalkable(room, point.x, point.y, radius)) {
        return { destination: point, distance: distanceAlongRay, crossedGap: true };
      }
    }
    return null;
  }

  for (let distanceAlongRay = requested; distanceAlongRay >= Math.max(step, radius * 0.6); distanceAlongRay -= step) {
    const point = pointAt(distanceAlongRay);
    if (isWalkable(room, point.x, point.y, radius)) {
      return { destination: point, distance: distanceAlongRay, crossedGap: false };
    }
  }
  return null;
}

function beginJumpPreparation(room, player, rawDx, rawDy) {
  if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "跳躍できません。");
  }
  ensureConscious(player);
  const direction = finiteDirection(rawDx, rawDy, player.aimX, player.aimY);
  player.jumpPreparingAt = now();
  player.jumpPrepareDx = direction.dx;
  player.jumpPrepareDy = direction.dy;
  player.vx = 0;
  player.vy = 0;
  player.movementMode = "jump-prepare";
  clearStoredMovementInput(player);
  touch(room);
}

function jumpPlayer(room, player, rawDx, rawDy) {
  if (room.phase !== "playing" || !player.alive || player.ejected || player.inVent) {
    throw new ApiError(403, "跳躍できません。");
  }
  ensureConscious(player);
  const timestamp = now();
  const preparedAt = Number(player.jumpPreparingAt) || timestamp;
  const holdMs = Math.max(0, timestamp - preparedAt);
  const preparedDx = Number(player.jumpPrepareDx);
  const preparedDy = Number(player.jumpPrepareDy);
  const directionSource = Number.isFinite(preparedDx) && Number.isFinite(preparedDy) && (preparedDx || preparedDy)
    ? { dx: preparedDx, dy: preparedDy }
    : { dx: rawDx, dy: rawDy };
  const finite = finiteDirection(directionSource.dx, directionSource.dy, player.aimX, player.aimY);
  const direction = { x: finite.dx, y: finite.dy };
  const requested = JUMP_BASE_DISTANCE + holdMs * JUMP_DISTANCE_PER_PREPARE_MS;
  const resolved = resolveJumpDestination(room, player, direction, requested);
  if (!resolved) {
    clearJumpPreparation(player);
    player.movementMode = "idle";
    throw new ApiError(400, "跳躍先に足場がありません。");
  }
  const destination = resolved.destination;
  const distanceToJump = resolved.distance;
  const cost = JUMP_BASE_COST + distanceToJump * JUMP_DISTANCE_COST;
  if (Number(player.stamina) < cost) {
    clearJumpPreparation(player);
    player.movementMode = "idle";
    throw new ApiError(400, `跳躍にはスタミナ ${Math.ceil(cost)} が必要です。`);
  }
  spendStamina(player, cost, room, "跳躍");
  const origin = { x: player.x, y: player.y };
  const baseMotionDuration = Math.max(320, Math.min(1800, 260 + distanceToJump * 0.72));
  const motionDuration = Math.max(120, baseMotionDuration / Math.max(0.1, effectiveAccelerationMultiplier(room, player, timestamp)));
  player.x = destination.x;
  player.y = destination.y;
  player.vx = direction.x;
  player.vy = direction.y;
  player.airborneUntil = timestamp + motionDuration;
  player.movementMode = "jump";
  player.jumpMotion = {
    startedAt: timestamp,
    endsAt: timestamp + motionDuration,
    fromX: origin.x,
    fromY: origin.y,
    toX: destination.x,
    toY: destination.y,
    distance: distanceToJump,
    crossedGap: resolved.crossedGap
  };
  clearJumpPreparation(player);
  pushMagicEffect(room, "action-jump", { ...player, x: origin.x, y: origin.y }, {
    radius: Math.max(120, distanceToJump * 0.8),
    playerId: player.id,
    targetX: destination.x,
    targetY: destination.y,
    variant: String(Math.round(distanceToJump))
  });
  pushSound(room, "jump", player, { ownerId: player.id, sourceKind: "player", maxDistance: 900, volume: 0.55 });
  touch(room);
}

function adoptMovementSession(player, body) {
  const receivedAt = now();
  const movementSession = String(body?.movementSession || "").slice(0, 96);
  if (!movementSession) return;
  const requestedStartedAt = Number(body?.movementSessionStartedAt);
  player.movementSession = movementSession;
  player.movementSessionStartedAt = Number.isFinite(requestedStartedAt)
    ? Math.min(requestedStartedAt, receivedAt + 60_000)
    : receivedAt;
  player.lastMovementSeq = -1;
  player.lastMovementClock = 0;
  clearStoredMovementInput(player, receivedAt);
}

function resyncMovementSession(room, player, body) {
  adoptMovementSession(player, body);
  player.vx = 0;
  player.vy = 0;
  if (actionBlockedUntil(player) <= now()) player.movementMode = "idle";
  player.lastMoveAt = now();
  touch(room);
  return serialize(room, player);
}

function serializeMovement(room, player, movementSeq = player.lastMovementSeq, movementClock = player.lastMovementClock) {
  const timestamp = now();
  const movementAcc = movementAccState(room, player, timestamp);
  return {
    ok: true,
    serverNow: timestamp,
    roomId: room.id,
    playerId: player.id,
    movementSession: String(player.movementSession || ""),
    movementSeq: Number.isSafeInteger(movementSeq) ? movementSeq : 0,
    movementClock: Number.isFinite(movementClock) ? movementClock : Number(player.lastMovementClock) || 0,
    x: player.x,
    y: player.y,
    moveX: player.vx,
    moveY: player.vy,
    movementMode: player.movementMode,
    speedMultiplier: effectiveMovementMultiplier(room, player, timestamp),
    accelerationMultiplier: effectiveAccelerationMultiplier(room, player, timestamp),
    movementAcc: movementAcc.selected,
    movementAccMax: movementAcc.maximum,
    movementAccEnabled: movementAcc.enabled,
    movementAccActive: movementAcc.active,
    movementAccAvailable: movementAcc.available,
    movementAccThreshold: movementAcc.threshold,
    slowedUntil: player.slowedUntil,
    taserSlowedUntil: player.taserSlowedUntil,
    shockSlowedUntil: player.shockSlowedUntil,
    gravityStormSlowUntil: player.gravityStormSlowUntil,
    gravityStormSlowMultiplier: player.gravityStormSlowMultiplier,
    lastGravityStormDamage: player.lastGravityStormDamage,
    alive: player.alive,
    ejected: player.ejected,
    inVent: player.inVent,
    stamina: player.stamina
  };
}

function victoryCreditFor(room, player, ideaWinnerIds = new Set(ideaWinnerIdsFor(room))) {
  if (room.winner === "defenders") return player.role === "defender" ? 1 : 0;
  if (room.winner === "attackers") return player.role === "attacker" ? 1 : 0;
  return room.winner === "idea" && ideaWinnerIds.has(player.id) ? 1 : 0;
}

function contributionRankingEntries(room) {
  const ideaWinnerIds = new Set(ideaWinnerIdsFor(room));
  const entries = [...room.players.values()]
    .map((player) => {
      // Only kills made by a Defender are a canonical result contribution.
      // Attackers still retain their ordinary profile KD accounting, but their
      // kills cannot alter this contribution ranking.
      const defenderKillContribution = player.role === "defender"
        ? Math.max(0, Number(player.totalKills) || 0)
        : 0;
      const victoryContribution = victoryCreditFor(room, player, ideaWinnerIds);
      const ideaContribution = ideaWinnerIds.has(player.id) ? 1 : 0;
      return {
      id: player.id,
      name: player.name,
      isBot: player.isBot,
      color: player.color,
      skinId: player.skinId || (player.isBot ? "operator" : "hood"),
      role: player.role,
      operatorId: player.operatorId,
      rank: profileFor(player)?.rank || "bronze",
      kd: profileFor(player) ? `${Number(profileFor(player).kills) || 0}/${Number(profileFor(player).deaths) || 0}` : "0/0",
      actualKills: Number(player.totalKills) || 0,
      luminousContribution: Number(player.luminousContribution) || 0,
      abilityContribution: Number(player.abilityContribution) || 0,
      taskContribution: Number(player.taskContribution) || 0,
      defenderKillContribution,
      victoryCredit: victoryContribution,
      ideaContribution,
      contributionScore: defenderKillContribution + victoryContribution + ideaContribution,
      luminousSuccess: Boolean(player.luminousActive),
      ideaWinner: ideaWinnerIds.has(player.id)
      };
    })
    .sort((a, b) => (
      b.contributionScore - a.contributionScore ||
      a.name.localeCompare(b.name, "ja")
    ));

  let rank = 0;
  let previousScore = null;
  const upperPlacementInclusive = Math.ceil(entries.length / 2);
  return entries.map((entry, index) => {
    if (entry.contributionScore !== previousScore) rank = index + 1;
    previousScore = entry.contributionScore;
    // Competition ranks keep equal contribution together.  A tie that touches
    // the midpoint is resolved as the upper group, so equal scores are never
    // split into opposite profile movements.
    const rankMovement = rank <= upperPlacementInclusive ? 1 : -1;
    return {
      ...entry,
      rank,
      rankingPosition: rank,
      rankingPopulation: entries.length,
      rankMovement,
      rankDelta: rankMovement
    };
  });
}

function resultRanking(room) {
  return contributionRankingEntries(room).map((entry) => {
    const profile = profileFor(room.players.get(entry.id));
    return {
      ...entry,
      rankTier: profile?.rank || "bronze",
      profileRank: profile?.rank || "bronze",
      profilePoints: Math.max(0, Number(profile?.points) || 0)
    };
  });
}

function serialize(room, viewer, options = {}) {
  if (!options.skipTick) tickRoom(room);
  const map = getMap(room);
  const timestamp = now();
  const activeDoorIds = new Set(activeDoors(room).map((door) => door.id));
  const revealRoles = room.phase === "ended";
  const meetingVotes = room.meeting
    ? buildVoteSummary(room, viewer)
    : null;
  const operatorTurnPlayer = room.phase === "selecting" ? currentOperatorPlayer(room) : null;
  const viewerObjectEffects = activeMapObjectEffects(room, viewer);

  const players = [...room.players.values()].map((player) => {
    const attackerAlly = viewer.role === "attacker" && player.role === "attacker" && player.id !== viewer.id;
    const roleVisible = player.id === viewer.id || attackerAlly || revealRoles || room.phase === "lobby" || room.phase === "selecting";
    const aromaSource = floraAromaSource(room, player);
    return {
      id: player.id,
      name: player.name,
      kd: profileFor(player) ? `${Number(profileFor(player).kills) || 0}/${Number(profileFor(player).deaths) || 0}` : "0/0",
      rank: profileFor(player)?.rank || "bronze",
      isBot: player.isBot,
      midJoinAvailable: player.midJoinAvailable,
      host: player.id === room.hostId,
      color: player.color,
      skinId: player.skinId || (player.isBot ? "operator" : "hood"),
      role: roleVisible ? player.role : "unknown",
      attackerAlly,
      special: player.id === viewer.id || room.phase === "ended" ? player.special : null,
      operatorId: roleVisible ? player.operatorId : "",
      operatorReady: roleVisible ? player.operatorReady : false,
      alive: player.alive,
      ejected: player.ejected,
      preparationBarrierActive: preparationBarrierProtects(room, player, timestamp),
      chatMuted: player.id === viewer.id ? player.chatMuted : false,
      x: Math.round(player.x),
      y: Math.round(player.y),
      moveX: player.vx,
      moveY: player.vy,
      moving: Math.hypot(player.vx, player.vy) > 0.01,
      movementMode: player.movementMode,
      movementSession: player.id === viewer.id ? String(player.movementSession || "") : "",
      movementSeq: player.id === viewer.id && Number.isSafeInteger(player.lastMovementSeq) ? player.lastMovementSeq : 0,
      movementClock: player.id === viewer.id && Number.isFinite(player.lastMovementClock) ? player.lastMovementClock : 0,
      gunnerWeapon: gunnerWeaponFor(player).id,
      gunFiring: Boolean(player.gunFiring),
      gunFiringWeapon: player.gunFiringWeapon || "",
      gunFiringSince: Number(player.gunFiringSince) || 0,
      gunnerBurstRoundsRemaining: Math.max(0, Math.floor(Number(player.gunnerBurstRoundsRemaining) || 0)),
      gunnerBurstEnhanceLevel: Math.max(0, Math.floor(Number(player.gunnerBurstEnhanceLevel) || 0)),
      enhanceChargeStartedAt: Number(player.enhanceChargeStartedAt) || 0,
      enhanceChargeKind: String(player.enhanceChargeKind || ""),
      enhanceChargeItemId: String(player.enhanceChargeItemId || ""),
      aimX: Number.isFinite(Number(player.aimX)) ? Number(player.aimX) : 0,
      aimY: Number.isFinite(Number(player.aimY)) ? Number(player.aimY) : 1,
      jumpPreparingAt: Number(player.jumpPreparingAt) || 0,
      jumpPrepareDx: Number.isFinite(Number(player.jumpPrepareDx)) ? Number(player.jumpPrepareDx) : 0,
      jumpPrepareDy: Number.isFinite(Number(player.jumpPrepareDy)) ? Number(player.jumpPrepareDy) : 1,
      jumpMotion: player.jumpMotion ? { ...player.jumpMotion } : null,
      slowedUntil: player.slowedUntil,
      taserSlowedUntil: player.taserSlowedUntil,
      shockSlowedUntil: player.shockSlowedUntil,
      gravityStormSlowUntil: player.gravityStormSlowUntil,
      gravityStormSlowMultiplier: player.gravityStormSlowMultiplier,
      speedMultiplier: effectiveMovementMultiplier(room, player),
      accelerationMultiplier: effectiveAccelerationMultiplier(room, player, timestamp),
      movementAcc: movementAccState(room, player, timestamp).selected,
      movementAccMax: movementAccState(room, player, timestamp).maximum,
      movementAccEnabled: movementAccState(room, player, timestamp).enabled,
      movementAccActive: movementAccState(room, player, timestamp).active,
      movementAccAvailable: movementAccState(room, player, timestamp).available,
      movementAccThreshold: movementAccState(room, player, timestamp).threshold,
      levitationActive: canLevitate(player),
      statusAte: persistentStatusAteState(room, player, timestamp),
      accelerationPhasing: Number(player.hsgUntil) > timestamp,
      hackerRootActive: hackerRootEligible(player),
      gunnerSnipingActive: Boolean(player.gunnerSnipingActive),
      aromaActive: Boolean(aromaSource),
      aromaSource: aromaSource?.id === player.id,
      aromaRegenMultiplier: floraAromaMultiplier(room, player),
      luminousActive: player.luminousActive,
      poisoned: Boolean(player.poisonStatus),
      burning: Boolean(player.burnStatus),
      ideaStage: Number(player.ideaStage) || 0,
      goodActive: Boolean(player.goodActive),
      ascensionStartedAt: Number(player.ascensionStartedAt) || 0,
      ascensionUntil: Number(player.ascensionUntil) || 0,
      bodyHits: player.id === viewer.id ? player.bodyHits : 0,
      overheal: player.id === viewer.id ? player.overheal : 0,
      inVent: player.id === viewer.id ? player.inVent : player.inVent && viewer.role === "attacker",
      ventId: player.id === viewer.id || viewer.role === "attacker" ? player.ventId : ""
    };
  });

  return {
    ok: true,
    serverNow: timestamp,
    roomId: room.id,
    phase: room.phase,
    round: room.round,
    battleStartedAt: room.battleStartedAt,
    preparationEndsAt: Number(room.preparationEndsAt) || 0,
    preparationActive: preparationBarrierActive(room, timestamp),
    hostId: room.hostId,
    settings: room.settings,
    operatorSelectSecondsLeft: room.phase === "selecting"
      ? Math.max(0, Math.ceil((room.operatorSelectEndsAt - timestamp) / 1000))
      : 0,
    operatorTurnPlayerId: operatorTurnPlayer?.id || "",
    operatorTurnName: operatorTurnPlayer?.name || "",
    operatorTurnPosition: operatorTurnPlayer ? room.operatorTurnIndex + 1 : 0,
    operatorTurnTotal: room.phase === "selecting" ? room.operatorTurnOrder.length : 0,
    operators: operatorState(room),
    map: {
      id: map.id,
      label: map.label,
      width: map.width,
      height: map.height,
      speed: map.speed,
      ghostSpeed: map.ghostSpeed,
      playerRadius: map.playerRadius,
      reportRange: map.reportRange,
      taskRange: map.taskRange,
      ventRange: map.ventRange,
      rooms: map.rooms,
      corridors: map.corridors,
      stations: visibleStations(map),
      objects: (map.objects || []).map((object) => ({
        ...object,
        readyAt: Number(viewer.objectCooldowns?.[object.id] || 0)
      })),
      alchemyObjects: room.alchemyObjects || [],
      resolvePoint: room.resolvePoint ? { ...room.resolvePoint } : null,
      vents: map.vents,
      cameras: map.cameras.map((camera) => ({ ...camera, destroyed: Boolean(room.destroyedCameras[camera.id]) })),
      portals: map.portals,
      doors: map.doors,
      environmentContractVersion: map.environmentContractVersion || ""
    },
    activeDoorIds: [...activeDoorIds],
    selfId: viewer.id,
    self: {
      id: viewer.id,
      skinId: viewer.skinId || "hood",
      role: viewer.role,
      special: isHackerOperator(viewer) ? "alchemist" : viewer.special,
      operatorId: viewer.operatorId,
      operatorReady: viewer.operatorReady,
      alive: viewer.alive,
      ejected: viewer.ejected,
      preparationBarrierActive: preparationBarrierProtects(room, viewer, timestamp),
      chatMuted: viewer.chatMuted,
      tasks: viewer.taskList,
      taskAutoReadyAt: Number(viewer.taskAutoReadyAt) || 0,
      taskPresenceTaskId: viewer.taskPresenceTaskId || "",
      taskPresenceSince: Number(viewer.taskPresenceSince) || 0,
      taskPresenceDurationMs: AUTO_TASK_PRESENCE_MS / effectiveAccelerationMultiplier(room, viewer, timestamp),
      killReadyAt: viewer.killReadyAt,
      attackTargetId: viewer.attackTargetId,
      attackResolveAt: viewer.attackResolveAt,
      aimTargetId: viewer.aimTargetId,
      aimStartedAt: viewer.aimStartedAt,
      aimReadyAt: viewer.aimReadyAt,
      aimExpiresAt: viewer.aimExpiresAt,
      lastAttackResult: viewer.lastAttackResult,
      lastAttackResultAt: viewer.lastAttackResultAt,
      luminousUsed: viewer.luminousUsed,
      luminousActive: viewer.luminousActive,
      luminousContribution: viewer.luminousContribution,
      totalKills: viewer.totalKills,
      lastLuminousResult: viewer.lastLuminousResult,
      lastLuminousResultAt: viewer.lastLuminousResultAt,
      gunReadyAt: viewer.gunReadyAt,
      gunnerWeapon: gunnerWeaponFor(viewer).id,
      gunnerAmmo: { ...viewer.gunnerAmmo },
      gunnerWeapons: gunnerWeaponState(viewer),
      gunFiring: Boolean(viewer.gunFiring),
      gunFiringWeapon: viewer.gunFiringWeapon || "",
      gunFiringSince: Number(viewer.gunFiringSince) || 0,
      gunnerBurstRoundsRemaining: Math.max(0, Math.floor(Number(viewer.gunnerBurstRoundsRemaining) || 0)),
      gunnerBurstEnhanceLevel: Math.max(0, Math.floor(Number(viewer.gunnerBurstEnhanceLevel) || 0)),
      gunnerEnhanceDamagePerLevel: GUNNER_ENHANCE_DAMAGE_PER_LEVEL,
      enhanceChargeStartedAt: Number(viewer.enhanceChargeStartedAt) || 0,
      enhanceChargeKind: String(viewer.enhanceChargeKind || ""),
      enhanceChargeItemId: String(viewer.enhanceChargeItemId || ""),
      enhanceChargeId: String(viewer.enhanceChargeId || ""),
      enhanceChargeReleasedAt: Number(viewer.enhanceChargeReleasedAt) || 0,
      enhanceHoldStepMs: ENHANCE_HOLD_STEP_MS,
      enhanceMaxLevel: ENHANCE_MAX_LEVEL,
      gboHoldMs: GBO_HOLD_MS,
      enhanceManaCost: ENHANCE_FIXED_MANA_COST,
      gboManaCost: GBO_FIXED_MANA_COST,
      gunnerReloadUntil: Number(viewer.gunnerReloadUntil) || 0,
      gunnerReloadWeapon: String(viewer.gunnerReloadWeapon || ""),
      gunnerSpecialAmmoType: String(viewer.gunnerSpecialAmmoType || ""),
      gunnerSpecialAmmoWeapon: String(viewer.gunnerSpecialAmmoWeapon || ""),
      gunnerSpecialAmmoRounds: Math.max(0, Number(viewer.gunnerSpecialAmmoRounds) || 0),
      gunnerSpecialAmmoInventory: { ...ensureGunnerSpecialAmmoInventory(viewer) },
      gunnerSpecialAmmoReadyAt: Number(viewer.gunnerSpecialAmmoReadyAt) || 0,
      gunnerSpecialAmmoIntervalMs: GUNNER_SPECIAL_AMMO_INTERVAL_MS,
      hsgOwned: itemCount(viewer, "hsg") > 0,
      hsgUntil: Number(viewer.hsgUntil) || 0,
      hsgReadyAt: Number(viewer.hsgReadyAt) || 0,
      hsgPreparedMode: String(viewer.hsgPreparedMode || ""),
      hsgPreparedEnhanceLevel: Math.max(0, Math.floor(Number(viewer.hsgPreparedEnhanceLevel) || 0)),
      hsgDurationMs: HSG_BASE_DURATION_MS,
      hsgCooldownMs: HSG_ACTIVATION_COOLDOWN_MS,
      accelerationPhasing: Number(viewer.hsgUntil) > timestamp,
      gunnerSnipingActive: Boolean(viewer.gunnerSnipingActive),
      gunnerAimTargetId: String(viewer.gunnerAimTargetId || ""),
      gunnerAimAvailable: Boolean(
        room.phase === "playing" &&
        viewer.alive &&
        !viewer.ejected &&
        !viewer.inVent &&
        !viewer.drone?.active &&
        hasOperatorAccess(viewer, "gunner") &&
        passivesEnabled(viewer) &&
        gunnerAimMovementAllowed(viewer)
      ),
      statusAte: persistentStatusAteState(room, viewer, timestamp),
      aromaActive: Boolean(floraAromaSource(room, viewer)),
      aromaRegenMultiplier: floraAromaMultiplier(room, viewer),
      heavyWeapons: [...(viewer.heavyWeapons || [])],
      aimX: viewer.aimX,
      aimY: viewer.aimY,
      sabotageReadyAt: viewer.sabotageReadyAt,
      dodgeReadyAt: viewer.dodgeReadyAt,
      dodgeActiveUntil: viewer.dodgeActiveUntil,
      slashActiveUntil: Number(viewer.slashActiveUntil) || 0,
      slashPerfectUntil: Number(viewer.slashPerfectUntil) || 0,
      slashPerfectReadyAt: Number(viewer.slashPerfectReadyAt) || 0,
      slashGuardDurationMs: FIGHTER_SLASH_GUARD_DURATION_MS,
      slashPerfectGuardMs: FIGHTER_SLASH_PERFECT_GUARD_MS,
      slashPerfectRearmMs: FIGHTER_SLASH_PERFECT_REARM_MS,
      teleportReadyAt: viewer.teleportReadyAt,
      floraReadyAt: viewer.floraReadyAt,
      limitBreakActive: viewer.limitBreakActive,
      limitBreakEndsAt: Number(viewer.limitBreakEndsAt) || 0,
      limitBreakDurationMs: 0,
      limitBreakStacks: limitBreakStackCount(viewer),
      limitBreakMultiplier: limitBreakMultiplier(viewer),
      fighterEnergyCharge: Math.max(0, Math.floor(Number(viewer.fighterEnergyCharge) || 0)),
      fighterEnergyPeak: fighterEnergyPeak(viewer),
      fighterEnergyChargeReadyAt: Number(viewer.fighterEnergyChargeReadyAt) || 0,
      fighterEnergyChargeIntervalMs: FIGHTER_ENERGY_PASSIVE_INTERVAL_MS,
      fighterInfiniteResources: hasFighterInfiniteResources(viewer),
      fighterDestructionSlash: hasFighterInfiniteResources(viewer),
      empReadyAt: viewer.empReadyAt,
      empCooldownMs: room.soloMission?.id === "emp" ? 3000 : EMP_COOLDOWN_MS,
      slowedUntil: viewer.slowedUntil,
      taserSlowedUntil: viewer.taserSlowedUntil,
      shockSlowedUntil: viewer.shockSlowedUntil,
      gravityStormSlowUntil: viewer.gravityStormSlowUntil,
      gravityStormSlowMultiplier: viewer.gravityStormSlowMultiplier,
      lastGravityStormDamage: viewer.lastGravityStormDamage,
      sleepingUntil: viewer.sleepingUntil,
      resting: Boolean(viewer.resting),
      meditatingUntil: viewer.meditatingUntil,
      unconsciousUntil: viewer.unconsciousUntil,
      actionBlockedUntil: actionBlockedUntil(viewer),
      abilityDisabledUntil: viewer.abilityDisabledUntil,
      overhealSpeedUntil: viewer.overhealSpeedUntil,
      floraMode: viewer.floraMode || "heal",
      sensoryBlockedUntil: sensoryBlockedUntil(viewer),
      lastMysteryResult: viewer.lastMysteryResult,
      lastMysteryResultAt: viewer.lastMysteryResultAt,
      lastImmediateFeedback: viewer.lastImmediateFeedback || null,
      movementMode: viewer.movementMode,
      jumpPreparingAt: Number(viewer.jumpPreparingAt) || 0,
      jumpPrepareDx: Number.isFinite(Number(viewer.jumpPrepareDx)) ? Number(viewer.jumpPrepareDx) : 0,
      jumpPrepareDy: Number.isFinite(Number(viewer.jumpPrepareDy)) ? Number(viewer.jumpPrepareDy) : 1,
      jumpMotion: viewer.jumpMotion ? { ...viewer.jumpMotion } : null,
      bodyHits: viewer.bodyHits,
      overheal: viewer.overheal,
      killCamera: viewer.killCamera ? { ...viewer.killCamera } : null,
      credits: viewer.credits,
      mana: Math.round((Number(viewer.mana) || 0) * 10) / 10,
      rationalManaThreshold: RATIONAL_MANA_THRESHOLD,
      manaState: manaStateLabel(viewer.mana),
      staminaState: staminaStateLabel(viewer.stamina),
      desireBias: viewer.desireBias || "",
      desireBiasLabel: desireBiasDefinition(viewer)?.label || "",
      desireBiasDetail: desireBiasDefinition(viewer)?.detail || "",
      desireIdeaForfeited: Boolean(viewer.desireIdeaForfeited),
      ideaBlockedByDesire: Boolean(viewer.desireIdeaForfeited || isDesireState(viewer) || viewer.desireBias),
      luck: luckValueFor(viewer),
      passivesEnabled: passivesEnabled(viewer),
      rationalFreeAbilityReadyAt: Number(viewer.rationalFreeAbilityReadyAt) || 0,
      rationalFreeAbilityReady: Number(viewer.mana) >= RATIONAL_MANA_THRESHOLD &&
        (Number(viewer.rationalFreeAbilityReadyAt) || Infinity) <= timestamp,
      rationalFreeAbilityIntervalMs: RATIONAL_FREE_ABILITY_INTERVAL_MS,
      taskStaminaRequirement: taskStaminaCostFor(viewer),
      fighterSlashStaminaCost: FIGHTER_SLASH_STAMINA_COST,
      ideaStage: Number(viewer.ideaStage) || 0,
      ideaFirstAspect: viewer.ideaFirstAspect || "",
      ideaProgressStartedAt: Number(viewer.ideaProgressStartedAt) || 0,
      ideaProgressMs: Math.max(0, Number(viewer.ideaProgressMs) || 0),
      ideaProgressUpdatedAt: Number(viewer.ideaProgressUpdatedAt) || 0,
      ideaProgressRate: ideaProgressRateFor(viewer),
      ideaNextThresholdMs: [IDEA_FIRST_ASPECT_MS, IDEA_SECOND_ASPECT_MS, IDEA_GOOD_MS, IDEA_ASCENSION_MS][Math.min(3, Number(viewer.ideaStage) || 0)],
      ideaThresholdsMs: {
        firstAspect: IDEA_FIRST_ASPECT_MS,
        secondAspect: IDEA_SECOND_ASPECT_MS,
        good: IDEA_GOOD_MS,
        ascension: IDEA_ASCENSION_MS
      },
      truthCharges: Number(viewer.truthCharges) || 0,
      beautyCharges: Number(viewer.beautyCharges) || 0,
      gravityPinnedUntil: Number(viewer.gravityPinnedUntil) || 0,
      goodActive: Boolean(viewer.goodActive),
      ascensionStartedAt: Number(viewer.ascensionStartedAt) || 0,
      ascensionUntil: Number(viewer.ascensionUntil) || 0,
      abilityCosts: {
        dodge: DODGE_MANA_COST,
        teleport: TELEPORT_MANA_COST,
        heartTeleport: HEART_TELEPORT_MANA_COST,
        gravityStorm: GRAVITY_STORM_MANA_COST,
        timeKeeper: GRAVITY_TIME_KEEPER_MANA_COST,
        emp: EMP_MANA_COST,
        shoot: GUNNER_MANA_COST,
        flora: FLORA_MANA_COST,
        alchemy: ALCHEMY_MANA_COST,
        fighterCharge: FIGHTER_ENERGY_CHARGE_MANA_COST,
        quantumNuclear: QUANTUM_NUCLEAR_MANA_COST,
        sabotage: SABOTAGE_MANA_COST
      },
      stamina: Math.round(viewer.stamina * 10) / 10,
      maxStamina: MAX_STAMINA,
      maxStoredStamina: staminaCapacityFor(viewer),
      statusImmunityActive: hasNaturalRecovery(room, viewer),
      sleepRegenPerSecond: STAMINA_REGEN_PER_SECOND * SLEEP_REGEN_MULTIPLIER,
      abilityContribution: viewer.abilityContribution,
      taskContribution: viewer.taskContribution,
      speedMultiplier: effectiveMovementMultiplier(room, viewer),
      accelerationMultiplier: effectiveAccelerationMultiplier(room, viewer, timestamp),
      movementAcc: movementAccState(room, viewer, timestamp).selected,
      movementAccMax: movementAccState(room, viewer, timestamp).maximum,
      movementAccEnabled: movementAccState(room, viewer, timestamp).enabled,
      movementAccActive: movementAccState(room, viewer, timestamp).active,
      movementAccAvailable: movementAccState(room, viewer, timestamp).available,
      movementAccThreshold: movementAccState(room, viewer, timestamp).threshold,
      timedAccelerationStacks: timedAccelerationSummary(viewer, timestamp).bySource,
      mapObjectEffects: viewerObjectEffects,
      dodgeDurationBonusMs: viewer.dodgeDurationBonusMs,
      warpCharges: viewer.warpCharges,
      fireJutsuCharges: viewer.fireJutsuCharges,
      fireJutsuKillChance: 0,
      itemInventory: transferableItemsFor(viewer),
      poisonStatus: viewer.poisonStatus ? { ...viewer.poisonStatus } : null,
      burnStatus: viewer.burnStatus ? { ...viewer.burnStatus } : null,
      quantumMode: normalizeQuantumMode(viewer.quantumMode || "nuclear-transmutation"),
      substitutionCharges: viewer.substitutionCharges,
      gritCharges: viewer.gritCharges,
      reasonCharges: viewer.reasonCharges,
      iaiCharges: Math.max(0, Math.floor(Number(viewer.iaiCharges) || 0)),
      standFirmCharges: viewer.gritCharges,
      pushCharges: viewer.reasonCharges,
      smartphoneUntil: Number(viewer.smartphoneUntil) || 0,
      smartphoneAction: viewer.smartphoneAction || "",
      routePartnerCount: (viewer.routePartnerIds || []).length,
      routeSharedSince: Number(viewer.routeSharedSince) || 0,
      gravityMode: viewer.gravityMode || "accelerate",
      gravityTimeMode: viewer.gravityTimeMode || "",
      gravityTimeTargetId: viewer.gravityTimeTargetId || "",
      gravityTimeEndsAt: Number(viewer.gravityTimeEndsAt) || 0,
      timeKeeperEndsAt: Number(viewer.timeKeeperEndsAt) || 0,
      timeStoppedUntil: Number(viewer.timeStoppedUntil) || 0,
      levitationActive: canLevitate(viewer),
      clairvoyanceActive: Boolean(viewer.clairvoyanceActive),
      clairvoyanceManaPerSecond: CLAIRVOYANCE_MANA_DRAIN_PER_SECOND,
      alchemyReviveUsed: Boolean(viewer.alchemyReviveUsed),
      vibeCodingReadyAt: Number(viewer.vibeCodingReadyAt) || 0,
      vibeCodingCooldownMs: Number(viewer.vibeCodingCooldownMs) || 0,
      manaGpuActive: room.phase === "playing" && isHackerOperator(viewer) && viewer.alive && !viewer.ejected && Number(viewer.mana) > 0,
      manaGpuDrainPerSecond: HACKER_MANA_GPU_DRAIN_PER_SECOND,
      manaGpuCooldownReductionMsPerMana: HACKER_MANA_GPU_COOLDOWN_REDUCTION_MS_PER_MANA,
      manaGpuCooldownCreditMs: Math.max(0, Number(viewer.manaGpuCooldownCreditMs) || 0),
      alchemyRecipeIds: isHackerOperator(viewer) ? Object.keys(ALCHEMY_RECIPES).filter((recipeId) => {
        const product = DVA_ECONOMY.productForRecipe(recipeId);
        return product?.hackerAccess !== "root" || hackerRootEligible(viewer);
      }) : [],
      inventions: [...(viewer.inventions || [])],
      computerActive: Boolean(viewer.computerActive),
      computerEffective: Boolean(viewer.computerActive && itemStorageAvailable(viewer, timestamp)),
      exiled: Boolean(viewer.exiled),
      hackTracking: room.phase === "playing" && isHackerOperator(viewer) && viewer.alive && !viewer.ejected,
      hackerRootActive: hackerRootEligible(viewer),
      hackerRootOperators: hackerRootEligible(viewer) ? [...HACKER_ROOT_OPERATOR_TYPES] : [],
      particleCannonUntil: Number(viewer.particleCannonUntil) || 0,
      emergenciesLeft: viewer.emergenciesLeft,
      inVent: viewer.inVent,
      ventId: viewer.ventId,
      killsThisRound: viewer.killsThisRound
    },
    players,
    bodies: visibleBodies(room, viewer),
    hitEffects: room.hitEffects,
    magicEffects: room.magicEffects.filter((effect) => !effect.viewerId || effect.viewerId === viewer.id),
    hazardFields: (room.hazardFields || []).map((field) => ({ ...field })),
    groundItems: (room.groundItems || []).map((groundItem) => ({
      id: groundItem.id,
      itemId: groundItem.itemId,
      label: groundItem.label,
      asset: groundItem.asset,
      kind: groundItem.kind,
      x: groundItem.x,
      y: groundItem.y,
      angle: groundItem.angle,
      pickupRange: groundItem.pickupRange,
      createdAt: groundItem.createdAt,
      impact: groundItem.impact ? {
        targetId: groundItem.impact.targetId,
        damage: groundItem.impact.damage,
        certainKill: Boolean(groundItem.impact.certainKill),
        contact: groundItem.impact.contact,
        luck: groundItem.impact.luck,
        severity: groundItem.impact.severity,
        outcome: groundItem.impact.outcome
      } : null
    })),
    gravityZones: room.gravityZones || [],
    sabotage: room.sabotage
      ? {
          ...room.sabotage,
          secondsLeft: room.sabotage.endsAt ? Math.max(0, Math.ceil((room.sabotage.endsAt - timestamp) / 1000)) : null
        }
      : null,
    meeting: room.meeting
      ? {
          id: room.meeting.id,
          reason: room.meeting.reason,
          reporterId: room.meeting.reporterId,
          discussionSecondsLeft: Math.max(0, Math.ceil((room.meeting.discussionEndsAt - timestamp) / 1000)),
          secondsLeft: Math.max(0, Math.ceil((room.meeting.endsAt - timestamp) / 1000)),
          votes: meetingVotes
        }
      : null,
    chat: room.chat,
    events: room.events,
    sounds: room.sounds,
    utility: room.utilityViews.get(viewer.id) || null,
    soloMission: (() => {
      const mission = soloMissionDefinition(room);
      if (!mission || !room.soloMission) return null;
      return {
        id: mission.id,
        name: mission.name,
        objective: mission.objective,
        completed: Boolean(room.soloMission.completed),
        progress: soloMissionProgress(room, timestamp),
        hintUnlocked: Boolean(room.soloMission.hintUnlocked),
        hint: room.soloMission.hintUnlocked
          ? "CPUは自分へアクセラレート→練気4回→再度アクセラレート→練気4回→心臓転移を繰り返します。練気中の行動不能時間か、心臓転移に必要な10MPを確保する前を狙って妨害してください。"
          : ""
      };
    })(),
    winner: room.winner,
    ideaWinnerId: room.ideaWinnerId,
    ideaWinnerIds: ideaWinnerIdsFor(room),
    pendingIdeaVictoryAt: room.pendingIdeaVictoryAt,
    finishReason: room.finishReason,
    results: room.phase === "ended" ? resultRanking(room) : [],
    availableMaps: Object.values(MAPS).map((item) => ({ id: item.id, label: item.label }))
  };
}

function buildVoteSummary(room, viewer) {
  const votes = room.meeting.votes;
  if (!room.settings.anonymousVotes || room.phase === "ended") return votes;
  const summary = {};
  for (const [voter, target] of Object.entries(votes)) {
    summary[voter === viewer.id ? voter : `anon_${Object.keys(summary).length}`] = target;
  }
  return summary;
}

function publicRooms() {
  const timestamp = now();
  return [...rooms.values()]
    .filter((room) => !room.soloMission && timestamp - room.updatedAt < ROOM_TTL_MS)
    .map((room) => {
      const availableSlots = [...room.players.values()].filter((entry) => (
        entry.midJoinAvailable && entry.alive && !entry.ejected
      )).length;
      const humans = [...room.players.values()].filter((entry) => !entry.isBot).length;
      return {
        id: room.id,
        phase: room.phase,
        players: room.players.size,
        humans,
        map: getMap(room).label,
        host: room.players.get(room.hostId)?.name || "ホスト待ち",
        hostKillRate: profileKillRate(profileFor(room.players.get(room.hostId))),
        availableSlots,
        midJoinAvailable: room.phase !== "lobby" && availableSlots > 0,
        joinable: room.phase === "lobby" || availableSlots > 0
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));
}

function requireRoomPlayer(body) {
  const room = getRoom(body.roomId);
  if (!room) throw new ApiError(404, "ルームが見つかりません。");
  const player = room.players.get(String(body.playerId || ""));
  if (!player) throw new ApiError(404, "プレイヤーが見つかりません。再入室してください。");
  player.lastSeenAt = now();
  return { room, player };
}

function requireLegacyRoomTestFixture(req, body) {
  if (body._offlineDeveloper === true && isDeveloperProfileId(playerProfileId(req))) return;
  throw new ApiError(410, "部屋作成・部屋設定機能は廃止されました。マッチングを使用してください。");
}

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new ApiError(413, "リクエストが大きすぎます。"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new ApiError(400, "JSONを解析できません。"));
      }
    });
    req.on("error", reject);
  });
}

async function handleApi(req, res) {
  const body = req.method === "GET" ? Object.fromEntries(new URL(req.url, `http://${req.headers.host}`).searchParams) : await parseBody(req);
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
  const identityKey = moderationKey(req, body.clientId);
  if (moderationRecord(identityKey).banned) {
    throw new ApiError(403, "この端末からの参加は永久停止されています。");
  }
  let payload;

  switch (pathname) {
    case "/api/checkpoint":
      {
        const profileId = playerProfileId(req);
        const profile = playerProfiles[canonicalProfileId(profileId)] || migrateLegacyProfile(profileId, legacyPlayerProfileId(body.clientId));
      payload = body.exclude === true || body.exclude === "true"
        ? { ok: true, excluded: true }
        : {
            ok: true,
            checkpoint: String(body.checkpoint || ""),
            count: recordCheckpoint(
              body.checkpoint,
              profileId,
              body.event,
              profile?.name || body.userName,
              body.id,
              body.occurredAt
            )
          };
      }
      break;

    case "/api/checkpoints": {
      if (ANALYTICS_REMOTE_URL && now() - (Number(checkpointHydrationStatus.checkedAt) || 0) > 15_000) {
        await hydrateCheckpointArchive();
      }
      payload = {
        ok: true,
        analyticsVersion: 3,
        checkpoints: checkpointReport(playerProfileId(req)),
        archiveStatus: checkpointHydrationStatus
      };
      break;
    }

    case "/api/checkpoints/exclude": {
      excludeCheckpointProfile(playerProfileId(req));
      payload = { ok: true, excluded: true };
      break;
    }

    case "/api/checkpoints/archive": {
      payload = { ok: true, archive: checkpointArchiveSnapshot() };
      break;
    }

    case "/api/online-capacity":
      payload = { ok: true, ...renderCapacityStatus() };
      break;

    case "/api/profile": {
      const profileId = playerProfileId(req);
      const profile = playerProfiles[canonicalProfileId(profileId)] || migrateLegacyProfile(profileId, legacyPlayerProfileId(body.clientId));
      const developer = isDeveloperProfileId(profileId);
      if (profile?.name && Number(profile.identityVersion) < 2) {
        profile.identityVersion = 2;
        profile.updatedAt = now();
        savePlayerProfiles();
      }
      payload = {
        ok: true,
        profile: profile
          ? { name: profile.name, locked: Boolean(profile.name), developer }
          : { name: "", locked: false, developer },
        policy: "名前はIPアドレス単位で保存され、初回確定後は変更できません。",
        profileStatus: profileHydrationStatus
      };
      break;
    }

    case "/api/solo/start": {
      const profileId = playerProfileId(req);
      const playerName = reservePlayerName(body.name, profileId, legacyPlayerProfileId(body.clientId));
      const { room, player } = createSoloMissionRoom(String(body.missionId || ""), playerName, body.skinId, profileId);
      player.moderationKey = identityKey;
      payload = {
        ...serialize(room, player),
        roomId: room.id,
        playerId: player.id,
        profile: { name: playerName, locked: true }
      };
      break;
    }

    case "/api/matchmake": {
      const profileId = playerProfileId(req);
      const requestedName = reservePlayerName(body.name, profileId, legacyPlayerProfileId(body.clientId));
      const requestedMapId = normalizeMapId(body.mapId);
      if (body.offlineFallback === true) {
        const room = createRoom(roomCode());
        room.settings.mapId = requestedMapId;
        const player = createMatchedPlayer(room, requestedName, body.skinId, profileId, identityKey);
        room.matchmaking = { status: "offline" };
        addDefaultOnlineBots(room);
        startGame(room);
        payload = {
          ...serialize(room, player),
          roomId: room.id,
          playerId: player.id,
          matchmaking: { status: "offline" },
          profile: { name: requestedName, locked: true }
        };
        break;
      }

      const waitingRoom = waitingMatchmakingRoom(identityKey, requestedMapId);
      if (waitingRoom) {
        const player = createMatchedPlayer(waitingRoom, requestedName, body.skinId, profileId, identityKey);
        waitingRoom.matchmaking = { status: "matched", matchedAt: now() };
        addDefaultOnlineBots(waitingRoom);
        startGame(waitingRoom);
        payload = {
          ...serialize(waitingRoom, player),
          roomId: waitingRoom.id,
          playerId: player.id,
          matchmaking: { status: "online" },
          profile: { name: requestedName, locked: true }
        };
        break;
      }

      const room = createRoom(roomCode());
      room.settings.mapId = requestedMapId;
      const player = createMatchedPlayer(room, requestedName, body.skinId, profileId, identityKey);
      room.matchmaking = {
        status: "waiting",
        createdAt: now(),
        expiresAt: now() + MATCHMAKING_WAIT_MS
      };
      payload = {
        ...serialize(room, player),
        roomId: room.id,
        playerId: player.id,
        matchmaking: { ...room.matchmaking },
        profile: { name: requestedName, locked: true }
      };
      break;
    }

    case "/api/matchmake/cancel": {
      const { room, player } = requireRoomPlayer(body);
      if (room.phase !== "lobby") {
        payload = {
          ...serialize(room, player),
          matchmaking: { status: "online" }
        };
        break;
      }
      const humans = [...room.players.values()].filter((entry) => !entry.isBot);
      if (room.matchmaking?.status === "waiting" && humans.length === 1 && humans[0].id === player.id) {
        rooms.delete(room.id);
        payload = { ok: true, cancelled: true };
        break;
      }
      throw new ApiError(409, "マッチング待機を解除できませんでした。");
    }

    // Regression fixtures only. These routes are unavailable to normal clients
    // and are retained solely so the established offline simulation suite can
    // construct exact combat states without reintroducing player-facing rooms.
    case "/api/join": {
      requireLegacyRoomTestFixture(req, body);
      const profileId = playerProfileId(req);
      const requestedName = reservePlayerName(body.name, profileId, legacyPlayerProfileId(body.clientId));
      const requested = cleanRoomId(body.roomId);
      const room = requested ? getRoom(requested) || createRoom(requested) : createRoom(roomCode());
      const shouldAddDefaultBots = room.phase === "lobby" && room.players.size === 0;
      const existing = body.playerId ? room.players.get(String(body.playerId)) : null;
      const player = existing || addPlayer(room, requestedName, false, body.skinId, profileId);
      player.moderationKey = identityKey;
      if (existing) {
        player.name = requestedName || player.name;
        player.profileId ||= profileId;
        player.isBot = false;
        player.skinId = cleanSkinId(body.skinId || player.skinId);
        player.lastSeenAt = now();
      }
      if (shouldAddDefaultBots) addDefaultOnlineBots(room);
      payload = {
        ...serialize(room, player),
        roomId: room.id,
        playerId: player.id,
        profile: { name: requestedName, locked: true }
      };
      break;
    }

    case "/api/settings": {
      requireLegacyRoomTestFixture(req, body);
      const { room, player } = requireRoomPlayer(body);
      if (room.hostId !== player.id || room.phase !== "lobby") throw new ApiError(400, "テスト用設定を変更できません。");
      const next = { ...room.settings };
      if (MAPS[body.mapId]) next.mapId = body.mapId;
      if (["random", "attacker", "defender"].includes(body.hostTeam)) next.hostTeam = body.hostTeam;
      next.attackerCount = Math.floor(clampNumber(body.attackerCount, 1, 3, next.attackerCount));
      next.taskCount = Math.floor(clampNumber(body.taskCount, 6, 30, next.taskCount));
      next.killCooldown = Math.floor(clampNumber(body.killCooldown, 8, 45, next.killCooldown));
      next.killRange = Math.floor(clampNumber(body.killRange, 60, 180, next.killRange));
      next.discussionTime = Math.floor(clampNumber(body.discussionTime, 0, 45, next.discussionTime));
      next.votingTime = Math.floor(clampNumber(body.votingTime, 20, 600, next.votingTime));
      next.anonymousVotes = Boolean(body.anonymousVotes);
      next.confirmEjects = Boolean(body.confirmEjects);
      next.emergencyLimit = Math.floor(clampNumber(body.emergencyLimit, 0, 5, next.emergencyLimit));
      room.settings = next;
      touch(room);
      payload = serialize(room, player);
      break;
    }

    case "/api/add-bot": {
      requireLegacyRoomTestFixture(req, body);
      const { room, player } = requireRoomPlayer(body);
      if (room.hostId !== player.id || room.phase !== "lobby") throw new ApiError(400, "テスト用Botを追加できません。");
      addPlayer(room, `Bot ${room.players.size + 1}`, true);
      payload = serialize(room, player);
      break;
    }

    case "/api/start": {
      requireLegacyRoomTestFixture(req, body);
      const { room, player } = requireRoomPlayer(body);
      if (room.hostId !== player.id) throw new ApiError(403, "テスト用開始権限がありません。");
      startGame(room);
      payload = serialize(room, player);
      break;
    }

    case "/api/kick": {
      requireLegacyRoomTestFixture(req, body);
      const { room, player } = requireRoomPlayer(body);
      if (room.hostId !== player.id) throw new ApiError(403, "テスト用退出権限がありません。");
      const target = room.players.get(String(body.targetId || ""));
      if (!target || target.id === player.id) throw new ApiError(400, "退出対象を選択してください。");
      leaveRoom(room, target);
      payload = serialize(room, player);
      break;
    }

    case "/api/skin": {
      const { room, player } = requireRoomPlayer(body);
      player.skinId = cleanSkinId(body.skinId);
      touch(room);
      payload = serialize(room, player);
      break;
    }

    case "/api/state": {
      const { room, player } = requireRoomPlayer(body);
      payload = serialize(room, player);
      break;
    }

    case "/api/leave": {
      const room = rooms.get(String(body.roomId || ""));
      const player = room?.players.get(String(body.playerId || ""));
      if (!room || !player) {
        payload = {
          ok: true,
          left: true,
          alreadyGone: true,
          roomId: String(body.roomId || ""),
          roomDeleted: !room,
          newHostId: room?.hostId || null,
          midJoinOpen: Boolean(room?.midJoinOpen)
        };
        break;
      }
      const result = leaveRoom(room, player);
      payload = {
        ok: true,
        left: true,
        roomId: room.id,
        roomDeleted: result.roomDeleted,
        newHostId: result.newHostId,
        midJoinOpen: result.midJoinOpen
      };
      break;
    }

    case "/api/operator": {
      const { room, player } = requireRoomPlayer(body);
      selectOperator(room, player, String(body.operatorId || ""), String(body.operatorSpecial || ""));
      payload = serialize(room, player);
      break;
    }

    case "/api/operator-reselect": {
      const { room, player } = requireRoomPlayer(body);
      if (body.localOffline !== true || room.matchmaking?.status !== "offline") {
        throw new ApiError(403, "オフライン対戦だけがオペレーターを選び直せます。");
      }
      if (room.soloMission || room.phase !== "playing") {
        throw new ApiError(409, "いまはオペレーター選択へ戻れません。");
      }
      const roles = new Map([...room.players.values()].map((entry) => [entry.id, entry.role]));
      startGame(room);
      for (const entry of room.players.values()) entry.role = roles.get(entry.id) || entry.role;
      payload = serialize(room, player);
      break;
    }

    case "/api/offline-team": {
      const { room, player } = requireRoomPlayer(body);
      const role = String(body.role || "");
      if (body.localOffline !== true || room.matchmaking?.status !== "offline") {
        throw new ApiError(403, "オフライン対戦だけが陣営を選択できます。");
      }
      if (room.phase !== "selecting" || !["defender", "attacker"].includes(role)) {
        throw new ApiError(409, "いまは陣営を選択できません。");
      }
      player.role = role;
      const bots = [...room.players.values()].filter((entry) => entry.isBot);
      if (role === "attacker") {
        bots.forEach((entry) => { entry.role = "defender"; });
      } else {
        bots.forEach((entry, index) => { entry.role = index === 0 ? "attacker" : "defender"; });
      }
      const attackerCount = [...room.players.values()].filter((entry) => entry.role === "attacker").length;
      const defenderCount = [...room.players.values()].filter((entry) => entry.role === "defender").length;
      room.killRateAttackerTarget = Math.max(1, Math.ceil(defenderCount / Math.max(1, attackerCount)));
      touch(room);
      payload = serialize(room, player);
      break;
    }

    case "/api/force-end": {
      const { room, player } = requireRoomPlayer(body);
      forceEnd(room, player);
      payload = serialize(room, player);
      break;
    }

    case "/api/move": {
      const { room, player } = requireRoomPlayer(body);
      payload = processMovementInput(room, player, body);
      break;
    }

    case "/api/movement-acc": {
      const { room, player } = requireRoomPlayer(body);
      setMovementAccEnabled(room, player, body.enabled);
      payload = serialize(room, player);
      break;
    }

    case "/api/movement/resync": {
      const { room, player } = requireRoomPlayer(body);
      payload = resyncMovementSession(room, player, body);
      break;
    }

    case "/api/jump/prepare": {
      const { room, player } = requireRoomPlayer(body);
      beginJumpPreparation(room, player, body.dx, body.dy);
      payload = serialize(room, player);
      break;
    }

    case "/api/jump/cancel": {
      const { room, player } = requireRoomPlayer(body);
      clearJumpPreparation(player);
      player.movementMode = "idle";
      touch(room);
      payload = serialize(room, player);
      break;
    }

    case "/api/jump": {
      const { room, player } = requireRoomPlayer(body);
      jumpPlayer(room, player, body.dx, body.dy);
      adoptMovementSession(player, body);
      payload = serialize(room, player);
      break;
    }

    case "/api/clairvoyance": {
      const { room, player } = requireRoomPlayer(body);
      setClairvoyanceActive(room, player, body.active);
      payload = serialize(room, player);
      break;
    }

    case "/api/emp": {
      const { room, player } = requireRoomPlayer(body);
      activateEmp(room, player, body.phase);
      payload = serialize(room, player);
      break;
    }

    case "/api/task": {
      const { room, player } = requireRoomPlayer(body);
      completeTask(room, player, String(body.taskId || "nearest"));
      payload = serialize(room, player);
      break;
    }

    case "/api/ninjutsu": {
      const { room, player } = requireRoomPlayer(body);
      startNinjutsu(room, player, String(body.targetId || ""));
      payload = serialize(room, player);
      break;
    }

    case "/api/kill": {
      throw new ApiError(410, "通常キルは廃止されました。忍殺を使用してください。");
    }

    case "/api/shoot": {
      const { room, player } = requireRoomPlayer(body);
      shootGunner(room, player, body.dx, body.dy, String(body.action || "start"), body.holdMs, String(body.chargeId || ""));
      payload = serialize(room, player);
      break;
    }

    case "/api/enhance-charge": {
      const { room, player } = requireRoomPlayer(body);
      if (!body.active && body.finalize) {
        finalizeEnhanceChargeState(room, player, body.holdMs, String(body.chargeId || ""));
      } else {
        setEnhanceChargeState(room, player, Boolean(body.active), String(body.kind || ""), String(body.itemId || ""));
      }
      payload = serialize(room, player);
      break;
    }

    case "/api/gunner-weapon": {
      const { room, player } = requireRoomPlayer(body);
      switchGunnerWeapon(room, player, String(body.weaponId || ""), Number(body.direction) || 1);
      payload = serialize(room, player);
      break;
    }

    case "/api/gunner-reload": {
      const { room, player } = requireRoomPlayer(body);
      reloadGunner(room, player);
      payload = serialize(room, player);
      break;
    }

    case "/api/gunner-heavy": {
      const { room, player } = requireRoomPlayer(body);
      useHeavyWeapon(room, player, body.weapon, body.holdMs, String(body.chargeId || ""));
      payload = serialize(room, player);
      break;
    }

    case "/api/dodge": {
      const { room, player } = requireRoomPlayer(body);
      activateDodge(room, player);
      payload = serialize(room, player);
      break;
    }

    case "/api/fighter-slash": {
      const { room, player } = requireRoomPlayer(body);
      fighterSlash(room, player, String(body.targetId || ""), Boolean(body.perfectGuardIntent));
      payload = serialize(room, player);
      break;
    }

    case "/api/fighter-slash-release": {
      const { room, player } = requireRoomPlayer(body);
      releaseFighterSlashGuardInput(player);
      payload = serialize(room, player);
      break;
    }

    case "/api/limit-break": {
      const { room, player } = requireRoomPlayer(body);
      toggleLimitBreak(room, player);
      payload = serialize(room, player);
      break;
    }

    case "/api/hacker-root": {
      const { room, player } = requireRoomPlayer(body);
      toggleHackerRoot(room, player);
      payload = serialize(room, player);
      break;
    }

    case "/api/sleep": {
      const { room, player } = requireRoomPlayer(body);
      startRest(room, player);
      payload = serialize(room, player);
      break;
    }

    case "/api/renki": {
      const { room, player } = requireRoomPlayer(body);
      practiceRenki(room, player);
      payload = serialize(room, player);
      break;
    }

    case "/api/donate": {
      const { room, player } = requireRoomPlayer(body);
      donateCredits(room, player);
      payload = serialize(room, player);
      break;
    }

    case "/api/teleport": {
      const { room, player } = requireRoomPlayer(body);
      teleportPlayer(room, player, body.x, body.y, String(body.targetId || ""), String(body.mode || "move"));
      payload = serialize(room, player);
      break;
    }

    case "/api/gravity-time": {
      const { room, player } = requireRoomPlayer(body);
      toggleGravityTime(room, player, String(body.mode || "accelerate"), String(body.targetId || player.id));
      payload = serialize(room, player);
      break;
    }

    case "/api/gravity-time-keeper": {
      const { room, player } = requireRoomPlayer(body);
      useTimeKeeper(room, player);
      payload = serialize(room, player);
      break;
    }

    case "/api/gravity-storm": {
      const { room, player } = requireRoomPlayer(body);
      useGravityStorm(room, player, String(body.targetId || player.id));
      payload = serialize(room, player);
      break;
    }

    case "/api/instant-warp": {
      const { room, player } = requireRoomPlayer(body);
      useTeleportMapScroll(room, player, body.x, body.y);
      payload = serialize(room, player);
      break;
    }

    case "/api/purchase": {
      const { room, player } = requireRoomPlayer(body);
      purchaseDrink(room, player, String(body.itemId || ""));
      payload = serialize(room, player);
      break;
    }

    case "/api/object": {
      const { room, player } = requireRoomPlayer(body);
      useMapObject(room, player, String(body.objectId || ""));
      payload = serialize(room, player);
      break;
    }

    case "/api/fire-jutsu": {
      const { room, player } = requireRoomPlayer(body);
      useFireJutsu(room, player, body.holdMs, String(body.chargeId || ""));
      payload = serialize(room, player);
      break;
    }

    case "/api/quantum-control": {
      const { room, player } = requireRoomPlayer(body);
      const actionApplied = useQuantumControl(room, player, body.mode);
      payload = serialize(room, player);
      payload.actionApplied = actionApplied;
      break;
    }

    case "/api/item-use": {
      const { room, player } = requireRoomPlayer(body);
      useOwnedItem(room, player, String(body.itemId || ""), body.holdMs, String(body.chargeId || ""));
      payload = serialize(room, player);
      break;
    }

    case "/api/item-throw": {
      const { room, player } = requireRoomPlayer(body);
      throwOwnedItem(room, player, String(body.itemId || ""), body.holdMs, body.targetX, body.targetY, String(body.chargeId || ""));
      payload = serialize(room, player);
      break;
    }

    case "/api/item-pickup": {
      const { room, player } = requireRoomPlayer(body);
      pickupGroundItem(room, player, String(body.groundItemId || ""));
      payload = serialize(room, player);
      break;
    }

    case "/api/transfer": {
      const { room, player } = requireRoomPlayer(body);
      transferOwnedResource(room, player, body.targetId, body.itemId, body.amount, Boolean(body.credits));
      payload = serialize(room, player);
      break;
    }

    case "/api/flora-heal": {
      const { room, player } = requireRoomPlayer(body);
      useFloraAbility(room, player, String(body.mode || "heal"), body);
      payload = serialize(room, player);
      break;
    }

    case "/api/alchemy": {
      const { room, player } = requireRoomPlayer(body);
      useAlchemy(room, player, body.conversion, body.targetId);
      payload = serialize(room, player);
      break;
    }

    case "/api/alchemist-invention": {
      const { room, player } = requireRoomPlayer(body);
      useAlchemistInvention(room, player, body.invention, body.holdMs, String(body.chargeId || ""));
      payload = serialize(room, player);
      break;
    }

    case "/api/borrowed-ability": {
      const { room, player } = requireRoomPlayer(body);
      const actionApplied = useBorrowedAbility(room, player, body.ability, body);
      payload = serialize(room, player);
      if (typeof actionApplied === "boolean") payload.actionApplied = actionApplied;
      break;
    }

    case "/api/report": {
      const { room, player } = requireRoomPlayer(body);
      reportBody(room, player);
      payload = serialize(room, player);
      break;
    }

    case "/api/emergency": {
      const { room, player } = requireRoomPlayer(body);
      callEmergency(room, player);
      payload = serialize(room, player);
      break;
    }

    case "/api/vote": {
      const { room, player } = requireRoomPlayer(body);
      ensureConscious(player);
      vote(room, player, String(body.targetId || "skip"));
      payload = serialize(room, player);
      break;
    }

    case "/api/luminous": {
      const { room, player } = requireRoomPlayer(body);
      useLuminous(room, player, String(body.targetId || ""));
      payload = serialize(room, player);
      break;
    }

    case "/api/chat": {
      const { room, player } = requireRoomPlayer(body);
      ensureConscious(player);
      if (room.phase !== "meeting") throw new ApiError(400, "チャットは会議中のみ使えます。");
      if (player.chatMuted) throw new ApiError(403, "復活後はチャットできません。");
      if (!player.alive || player.ejected) throw new ApiError(403, "死亡または追放後はチャットできません。");
      if (isBlockedComment(body.message)) {
        const record = registerModerationStrike(player.moderationKey || identityKey);
        leaveRoom(room, player);
        payload = {
          ok: true,
          moderated: true,
          left: true,
          strikes: record.strikes,
          banned: record.banned,
          error: record.banned
            ? "禁止コメントが5回に達したため永久停止されました。"
            : `禁止コメントを検出したため退出しました（${record.strikes}/5）。`
        };
      } else {
        pushChat(room, player, body.message);
        payload = serialize(room, player);
      }
      break;
    }

    case "/api/sabotage": {
      const { room, player } = requireRoomPlayer(body);
      startSabotage(room, player, String(body.type || "comms"));
      payload = serialize(room, player);
      break;
    }

    case "/api/repair": {
      const { room, player } = requireRoomPlayer(body);
      startSmartphoneRepair(room, player);
      payload = serialize(room, player);
      break;
    }

    case "/api/utility": {
      const { room, player } = requireRoomPlayer(body);
      const utility = makeUtility(room, player, String(body.type || "admin"));
      room.utilityViews.set(player.id, utility);
      payload = serialize(room, player);
      break;
    }

    case "/api/reset": {
      throw new ApiError(410, "ロビーへの復帰機能は廃止されました。再マッチングしてください。");
      const { room, player } = requireRoomPlayer(body);
      if (room.hostId !== player.id) throw new ApiError(403, "ホストだけがオンラインロビーへ戻せます。");
      if (room.soloMission) throw new ApiError(400, "ソロ訓練からオンラインロビーへ移動することはできません。");
      room.phase = "lobby";
      room.round = 0;
      room.bodies = [];
      room.hitEffects = [];
      room.magicEffects = [];
      room.hazardFields = [];
      room.thrownItems = [];
      room.groundItems = [];
      room.chat = [];
      room.events = [];
      room.sounds = [];
      room.meeting = null;
      room.battleStartedAt = 0;
      room.preparationEndsAt = 0;
      room.operatorSelectEndsAt = 0;
      room.operatorTurnOrder = [];
      room.operatorTurnIndex = 0;
      room.winner = null;
      room.finishReason = "";
      setIdeaWinnerIds(room, []);
      room.pendingIdeaVictoryAt = 0;
      room.sabotage = null;
      room.activeEmps = [];
      room.doorState = {};
      room.destroyedCameras = {};
      room.doorLog = [];
      room.utilityViews.clear();
      for (const entry of room.players.values()) {
        entry.role = "unassigned";
        entry.midJoinAvailable = false;
        entry.special = null;
        entry.operatorId = "";
        entry.operatorReady = false;
        entry.alive = true;
        entry.ejected = false;
        entry.botMatchEliminatedById = "";
        entry.chatMuted = false;
        entry.taskList = [];
        entry.taskAutoReadyAt = 0;
        entry.taskPresenceTaskId = "";
        entry.taskPresenceSince = 0;
        entry.killsThisRound = 0;
        entry.totalKills = 0;
        entry.luminousUsed = false;
        entry.luminousActive = false;
        entry.luminousContribution = 0;
        entry.abilityContribution = 0;
        entry.lastLuminousResult = "";
        entry.lastLuminousResultAt = 0;
        entry.killReadyAt = 0;
        clearAttackState(entry);
        entry.lastAttackResult = "";
        entry.lastAttackResultAt = 0;
        entry.gunReadyAt = 0;
        entry.gunnerWeapon = DEFAULT_GUNNER_WEAPON;
        entry.gunnerAmmo = createGunnerAmmo();
        entry.gunFiring = false;
        entry.gunFiringWeapon = "";
        entry.gunFiringSince = 0;
        entry.gunnerBurstRoundsRemaining = 0;
        entry.gunnerBurstEnhanceLevel = 0;
        entry.gunnerBurstGbo = false;
        entry.gunnerBurstGboWeapon = "";
        entry.gunnerLastShotAt = 0;
        entry.gunnerReloadUntil = 0;
        entry.gunnerReloadWeapon = "";
        entry.unavailableGunnerWeapons = [];
        entry.sabotageReadyAt = 0;
        entry.dodgeReadyAt = 0;
        entry.dodgeActiveUntil = 0;
        entry.slashActiveUntil = 0;
        entry.slashPerfectUntil = 0;
        entry.slashPerfectReadyAt = 0;
        entry.slashDetachedGuardUntil = 0;
        entry.slashGuardInputReleased = true;
        entry.teleportReadyAt = 0;
        entry.floraReadyAt = 0;
        entry.limitBreakActive = false;
        entry.limitBreakEndsAt = 0;
        entry.limitBreakStacks = 0;
        entry.fighterEnergyCharge = 0;
        entry.fighterEnergyPeak = 0;
        entry.fighterEnergyChargeReadyAt = 0;
        entry.manaGpuCooldownCreditMs = 0;
        entry.empReadyAt = 0;
        entry.itemDisabledUntil = 0;
        entry.slowedUntil = 0;
        entry.taserSlowedUntil = 0;
        entry.shockSlowedUntil = 0;
        entry.sleepingUntil = 0;
        entry.resting = false;
        entry.meditatingUntil = 0;
        entry.renkiTargetMana = null;
        entry.unconsciousUntil = 0;
        entry.abilityDisabledUntil = 0;
        entry.overhealSpeedUntil = 0;
        entry.hsgUntil = 0;
        entry.hsgReadyAt = 0;
        entry.hsgPreparedMode = "";
        entry.hsgPreparedEnhanceLevel = 0;
        entry.killCamera = null;
        entry.gunnerSnipingActive = false;
        entry.gunnerAimTargetId = "";
        entry.timedAccelerationEffects = [];
        entry.particleCannonPerformanceMultiplier = 1;
        entry.lastMysteryResult = "";
        entry.lastMysteryResultAt = 0;
        entry.movementMode = "idle";
        entry.movementAccEnabled = true;
        entry.bodyHits = 0;
        entry.overheal = 0;
        entry.credits = 0;
        entry.lastPassiveCreditAt = now();
        entry.mana = STARTING_MANA;
        entry.manaStateEnteredAt = now();
        entry.rationalFreeAbilityReadyAt = 0;
        entry.gritCharges = 0;
        entry.reasonCharges = 0;
        entry.iaiCharges = 0;
        entry.ideaProgressStartedAt = 0;
        entry.ideaProgressMs = 0;
        entry.ideaProgressUpdatedAt = 0;
        entry.ideaStage = 0;
        entry.ideaFirstAspect = "";
        entry.desireBias = "";
        entry.desireIdeaForfeited = false;
        entry.truthCharges = 0;
        entry.beautyCharges = 0;
        entry.goodActive = false;
        entry.ascensionStartedAt = 0;
        entry.ascensionUntil = 0;
        entry.objectCooldowns = {};
        entry.objectContactUsedIds = [];
        entry.objectLuckBonus = 0;
        entry.objectLuckUntil = 0;
        entry.donationLuckBonus = 0;
        entry.stamina = MAX_STAMINA;
        entry.staminaUpdatedAt = now();
        entry.autoManaToStaminaFeedbackAt = 0;
        entry.staminaManaOverflow = 0;
        entry.speedMultiplier = 1;
        entry.dodgeDurationBonusMs = 0;
        entry.warpCharges = 0;
        entry.fireJutsuCharges = 0;
        entry.substitutionCharges = 0;
        entry.itemInventory = {};
        entry.poisonStatus = null;
        entry.burnStatus = null;
        entry.statusImmunityFeedbackAt = 0;
        entry.quantumMode = "nuclear-transmutation";
        entry.drone.active = false;
        entry.drone.x = entry.x;
        entry.drone.y = entry.y;
        entry.drone.vx = 0;
        entry.drone.vy = 0;
        entry.drone.readyAt = 0;
        entry.drone.altitude = DRONE_ALTITUDE_MAX;
        entry.drone.destroyed = false;
        entry.drone.movementMode = "idle";
        entry.emergenciesLeft = room.settings.emergencyLimit;
        entry.inVent = false;
        entry.ventId = "";
        entry.vx = 0;
        entry.vy = 0;
        entry.aimX = 0;
        entry.aimY = 1;
        entry.heardSoundAt = 0;
        entry.heardWaypointUntil = 0;
        entry.heardWaypointX = 0;
        entry.heardWaypointY = 0;
        entry.nextBotDefenseDecisionAt = now() + 1800 + Math.floor(Math.random() * 1800);
        entry.botDefensePlannedAt = 0;
        entry.botDefenseKind = "";
        entry.botDefenseTargetId = "";
        entry.botWitnessTargetId = "";
        entry.botWitnessUntil = 0;
        entry.botWitnessEvidenceKind = "";
        entry.botVisibleThrowObservations = [];
        entry.botKillDecision = null;
        entry.movementSession = "";
        entry.movementSessionStartedAt = 0;
        entry.lastMovementSeq = -1;
        entry.lastMovementClock = 0;
        entry.lastMovementReceivedAt = 0;
        entry.lastMovementDx = 0;
        entry.lastMovementDy = 0;
        entry.lastMovementDash = false;
        entry.lastMovementSlow = false;
        entry.lastMoveAt = now();
      }
      pushEvent(room, "オンラインロビーに戻りました。");
      touch(room);
      payload = serialize(room, player);
      break;
    }

    default:
      throw new ApiError(404, "APIが見つかりません。");
  }

  sendJson(res, 200, payload);
}

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  res.end(JSON.stringify(payload));
}

function allowedCorsOrigin(origin) {
  if (!origin) return "";
  try {
    const url = new URL(origin);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:") return "";
    if (
      host === "plicy.net" ||
      host === "html5.plicy.net" ||
      host === "game.plicy.net" ||
      host.endsWith(".game.plicy.net")
    ) return origin;
  } catch {}
  return "";
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const rawPath = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const safePath = path.normalize(rawPath).replace(/^(\.\.[/\\])+/, "");
  const fullPath = path.join(PUBLIC_DIR, safePath);
  if (!fullPath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.stat(fullPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const ext = path.extname(fullPath);
    const baseHeaders = {
      "content-type": MIME[ext] || "application/octet-stream",
      "cache-control": ext === ".html" ? "no-store" : "public, max-age=60",
      "accept-ranges": "bytes"
    };
    const rangeMatch = typeof req.headers.range === "string"
      ? req.headers.range.match(/^bytes=(\d*)-(\d*)$/i)
      : null;

    if (req.headers.range && !rangeMatch) {
      res.writeHead(416, { ...baseHeaders, "content-range": `bytes */${stats.size}` });
      res.end();
      return;
    }

    if (rangeMatch) {
      const [, rawStart, rawEnd] = rangeMatch;
      let start;
      let end;
      if (!rawStart) {
        const suffixLength = Number(rawEnd);
        if (!Number.isInteger(suffixLength) || suffixLength <= 0) {
          res.writeHead(416, { ...baseHeaders, "content-range": `bytes */${stats.size}` });
          res.end();
          return;
        }
        start = Math.max(0, stats.size - suffixLength);
        end = stats.size - 1;
      } else {
        start = Number(rawStart);
        end = rawEnd ? Math.min(Number(rawEnd), stats.size - 1) : stats.size - 1;
      }
      if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || start >= stats.size || end < start) {
        res.writeHead(416, { ...baseHeaders, "content-range": `bytes */${stats.size}` });
        res.end();
        return;
      }
      const contentLength = end - start + 1;
      res.writeHead(206, {
        ...baseHeaders,
        "content-length": contentLength,
        "content-range": `bytes ${start}-${end}/${stats.size}`
      });
      if (req.method === "HEAD") {
        res.end();
        return;
      }
      fs.createReadStream(fullPath, { start, end }).pipe(res);
      return;
    }

    res.writeHead(200, { ...baseHeaders, "content-length": stats.size });
    if (req.method === "HEAD") {
      res.end();
      return;
    }
    fs.createReadStream(fullPath).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const corsOrigin = allowedCorsOrigin(req.headers.origin);
    if (corsOrigin) {
      res.setHeader("access-control-allow-origin", corsOrigin);
      res.setHeader("vary", "Origin");
      res.setHeader("access-control-allow-methods", "GET, POST, OPTIONS");
      res.setHeader("access-control-allow-headers", "Content-Type");
    }
    if (req.method === "OPTIONS") {
      res.writeHead(corsOrigin ? 204 : 403);
      res.end();
      return;
    }
    if (new URL(req.url, `http://${req.headers.host}`).pathname === "/health") {
      sendJson(res, 200, { ok: true, service: "defenders-vs-attackers", apiVersion: 2, soloTraining: true });
      return;
    }
    if (req.url.startsWith("/api/")) {
      await handleApi(req, res);
      return;
    }
    serveStatic(req, res);
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    if (!(error instanceof ApiError)) console.error(error);
    sendJson(res, status, { ok: false, error: error.message || "Server error" });
  }
});

const realtimeServer = new WebSocketServer({ noServer: true, maxPayload: 4096 });
const realtimePeers = new Set();

function realtimeOriginAllowed(origin) {
  if (!origin) return true;
  try {
    const url = new URL(origin);
    const local = ["localhost", "127.0.0.1", "::1"].includes(url.hostname.toLowerCase());
    if (local && ["http:", "https:"].includes(url.protocol)) return true;
  } catch {
    return false;
  }
  return Boolean(allowedCorsOrigin(origin));
}

server.on("upgrade", (req, socket, head) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname !== "/ws" || !realtimeOriginAllowed(req.headers.origin)) {
      socket.destroy();
      return;
    }
    const room = getRoom(url.searchParams.get("roomId"));
    const player = room?.players.get(String(url.searchParams.get("playerId") || ""));
    if (!room || !player) {
      socket.destroy();
      return;
    }
    realtimeServer.handleUpgrade(req, socket, head, (websocket) => {
      realtimeServer.emit("connection", websocket, req, {
        roomId: room.id,
        playerId: player.id,
        performanceMode: url.searchParams.get("performanceMode") === "plicy" ? "plicy" : "standard"
      });
    });
  } catch {
    socket.destroy();
  }
});

realtimeServer.on("connection", (socket, _request, identity) => {
  const peer = {
    socket,
    roomId: identity.roomId,
    playerId: identity.playerId,
    stateIntervalMs: identity.performanceMode === "plicy" ? PLICY_REALTIME_STATE_INTERVAL_MS : REALTIME_STATE_INTERVAL_MS,
    lastStateSentAt: 0
  };
  realtimePeers.add(peer);
  socket.on("message", (raw) => {
    let message;
    try {
      message = JSON.parse(String(raw));
    } catch {
      return;
    }
    if (message.type !== "move") return;
    const room = getRoom(peer.roomId);
    const player = room?.players.get(peer.playerId);
    if (!room || !player) {
      socket.close(1008, "session-ended");
      return;
    }
    player.lastSeenAt = now();
    const movement = processMovementInput(room, player, message);
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "movement", data: movement }));
    }
  });
  socket.on("close", () => realtimePeers.delete(peer));
  socket.on("error", () => realtimePeers.delete(peer));
});

function pushRealtimeStates() {
  const timestamp = now();
  const peersByRoom = new Map();
  for (const peer of realtimePeers) {
    if (peer.socket.readyState !== WebSocket.OPEN) continue;
    const peers = peersByRoom.get(peer.roomId) || [];
    peers.push(peer);
    peersByRoom.set(peer.roomId, peers);
  }
  for (const [roomId, peers] of peersByRoom) {
    const room = getRoom(roomId);
    if (!room) {
      for (const peer of peers) peer.socket.close(1008, "room-ended");
      continue;
    }
    tickRoom(room);
    for (const peer of peers) {
      if (timestamp - peer.lastStateSentAt < peer.stateIntervalMs) continue;
      const player = room.players.get(peer.playerId);
      if (!player) {
        peer.socket.close(1008, "player-ended");
        continue;
      }
      try {
        peer.socket.send(JSON.stringify({ type: "state", data: serialize(room, player, { skipTick: true }) }));
        peer.lastStateSentAt = timestamp;
      } catch {
        peer.socket.close();
      }
    }
  }
}

function botTick() {
  for (const room of rooms.values()) {
    if (
      room.phase === "lobby" &&
      room.matchmaking?.status === "waiting" &&
      now() > Number(room.matchmaking.expiresAt || 0) + 15_000
    ) {
      rooms.delete(room.id);
      continue;
    }
    if (now() - room.updatedAt > ROOM_TTL_MS) {
      rooms.delete(room.id);
      continue;
    }
    tickRoom(room);
    if (room.phase === "meeting") {
      runMeetingBots(room);
    } else if (room.phase === "playing") {
      runPlayingBots(room);
    }
  }
}

function runMeetingBots(room) {
  if (!room.meeting) return;
  for (const bot of room.players.values()) {
    if (!bot.isBot || !bot.alive || bot.ejected) continue;
    const suspect = room.players.get(room.meeting.suspectId);
    const knownAttacker = botKnownAttackerEvidence(room, bot, now());
    if (
      bot.role === "defender" &&
      botIsEnemyOfSoleHuman(room, bot) &&
      !bot.luminousUsed &&
      suspect?.alive &&
      !suspect.ejected &&
      knownAttacker?.id === suspect.id
    ) {
      try {
        useLuminous(room, bot, suspect.id);
      } catch {}
      if (!room.meeting || room.phase !== "meeting") return;
    }
    if (!room.meeting.votes[bot.id]) {
      const livingHumanOpponent = botOpposesLivingHuman(room, bot)
        ? [...room.players.values()]
          .filter((player) => !player.isBot && player.alive && !player.ejected && player.role !== bot.role)
          .sort((a, b) => a.id.localeCompare(b.id))[0]
        : null;
      const evidenceTarget = bot.role === "defender" ? knownAttacker : null;
      room.meeting.votes[bot.id] = evidenceTarget?.id ||
        (bot.role === "attacker" ? livingHumanOpponent?.id : "") ||
        "skip";
    }
  }
  maybeEndMeeting(room);
}

function runBotStandFirmRetaliation(room, bot, timestamp = now()) {
  if (!botIsEnemyOfSoleHuman(room, bot)) return false;
  if (!bot.botRetaliationTargetId || Number(bot.botRetaliationUntil) <= timestamp) {
    bot.botRetaliationTargetId = "";
    bot.botRetaliationUntil = 0;
    return false;
  }
  const target = room.players.get(bot.botRetaliationTargetId);
  if (!target?.alive || target.ejected || target.inVent) {
    bot.botRetaliationTargetId = "";
    bot.botRetaliationUntil = 0;
    return false;
  }
  if (distance(bot, target) > room.settings.killRange * 1.35) {
    moveBotToward(room, bot, target);
    return true;
  }
  if (bot.killReadyAt > timestamp) return true;
  try {
    rememberBotKillDecision(room, bot, target, {
      code: "stand-firm-visible-retaliation",
      actionLabel: "踏ん張り反撃の頭部命中（確殺）",
      reasons: ["踏ん張りで耐えた直前の攻撃者が反撃射程内に入り、反撃クールタイムも完了"]
    }, timestamp);
    killPlayer(room, bot, target.id, {
      hitZone: "head",
      lockedAim: true,
      allowAnyKiller: true,
      targetRole: target.role,
      ignorePush: true,
      attackKind: "stand-firm-retaliation",
      attackLabel: "踏ん張り反撃の頭部命中（確殺）"
    });
    bot.botRetaliationTargetId = "";
    bot.botRetaliationUntil = 0;
  } catch {}
  return true;
}

function runBotBodyReport(room, bot) {
  if (!botIsEnemyOfSoleHuman(room, bot) || !bot.alive || bot.ejected || bot.inVent || room.phase !== "playing") return false;
  const reportRange = getMap(room).reportRange;
  const body = [...(room.bodies || [])].sort((a, b) => distance(bot, a) - distance(bot, b))[0];
  if (!body) return false;
  const bodyDistance = distance(bot, body);
  if (bodyDistance > reportRange) {
    if (bodyDistance > BOT_BODY_NOTICE_RANGE) return false;
    const dx = body.x - bot.x;
    const dy = body.y - bot.y;
    const length = Math.hypot(dx, dy) || 1;
    if (!clearShotPath(room, bot, body, dx / length, dy / length)) return false;
    moveBotToward(room, bot, body);
    return true;
  }
  try {
    reportBody(room, bot);
    return true;
  } catch {
    return false;
  }
}

function teleportBotToward(room, bot, target) {
  if (!target || bot.special !== "teleport" || bot.teleportReadyAt > now() || distance(bot, target) < 650) {
    return false;
  }
  try {
    teleportPlayer(room, bot, target.x, target.y);
    return true;
  } catch {
    return false;
  }
}

function heardMovementWaypoint(room, bot, timestamp = now()) {
  for (let index = room.sounds.length - 1; index >= 0; index -= 1) {
    const sound = room.sounds[index];
    if (sound.at <= bot.heardSoundAt || timestamp - sound.at > BOT_HEARING_MEMORY_MS) break;
    if (!["walk", "dash"].includes(sound.type) || sound.sourceKind !== "player") continue;
    if (distance(bot, sound) > Math.max(1, Number(sound.maxDistance) || 0)) continue;
    bot.heardSoundAt = sound.at;
    bot.heardWaypointUntil = sound.at + BOT_HEARING_MEMORY_MS;
    bot.heardWaypointX = sound.x;
    bot.heardWaypointY = sound.y;
    bot.navPath = [];
    break;
  }

  if (Number(bot.heardWaypointUntil) <= timestamp) {
    bot.heardWaypointUntil = 0;
    return null;
  }
  return {
    x: Number(bot.heardWaypointX) || 0,
    y: Number(bot.heardWaypointY) || 0,
    observedAt: Number(bot.heardSoundAt) || 0
  };
}

function botHasHumanOpponent(room, bot) {
  return botOpposesLivingHuman(room, bot);
}

function stableBotHash(value) {
  let hash = 2166136261;
  for (const character of String(value || "")) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function activeBotClaimCount(room, bot, targetId, targetField, untilField, timestamp = now()) {
  return [...room.players.values()].filter((other) => (
    other.isBot &&
    other.id !== bot.id &&
    other.role === bot.role &&
    other.alive &&
    !other.ejected &&
    String(other[targetField] || "") === String(targetId || "") &&
    Number(other[untilField]) > timestamp
  )).length;
}

function botTargetAffinity(bot, target, cycle = 0) {
  return stableBotHash(`${bot?.id || "bot"}:${target?.id || "target"}:${cycle}`);
}

function clearBotClairvoyanceContact(bot) {
  bot.botClairvoyanceUntil = 0;
  bot.botClairvoyanceObservedUntil = 0;
  bot.botClairvoyanceTargetId = "";
  bot.botClairvoyanceTargetX = 0;
  bot.botClairvoyanceTargetY = 0;
}

function botClairvoyanceContact(room, bot, timestamp = now()) {
  const hadTarget = Boolean(bot?.botClairvoyanceTargetId);
  const target = room.players.get(String(bot?.botClairvoyanceTargetId || ""));
  if (!target?.alive || target.ejected) {
    clearBotClairvoyanceContact(bot);
    if (hadTarget && bot?.role === "attacker") {
      const scheduled = Number(bot.nextBotClairvoyanceAt) || Infinity;
      bot.nextBotClairvoyanceAt = Math.min(scheduled, timestamp + BOT_TICK_MS);
    }
    return null;
  }
  if (bot.clairvoyanceActive && Number(bot.botClairvoyanceUntil) > timestamp) {
    bot.botClairvoyanceTargetX = target.x;
    bot.botClairvoyanceTargetY = target.y;
    bot.botClairvoyanceObservedUntil = Math.max(
      Number(bot.botClairvoyanceObservedUntil) || 0,
      timestamp + BOT_CLAIRVOYANCE_MEMORY_MS
    );
    return target;
  }
  if (Number(bot.botClairvoyanceObservedUntil) <= timestamp) {
    clearBotClairvoyanceContact(bot);
    return null;
  }
  return {
    ...target,
    x: Number(bot.botClairvoyanceTargetX) || target.x,
    y: Number(bot.botClairvoyanceTargetY) || target.y
  };
}

function runBotClairvoyanceSearch(room, bot, timestamp = now()) {
  const maximumStrength = botHasHumanOpponent(room, bot);
  if (!maximumStrength || !bot.alive || bot.ejected || bot.inVent) {
    if (bot.clairvoyanceActive) setClairvoyanceActive(room, bot, false);
    clearBotClairvoyanceContact(bot);
    return null;
  }

  if (bot.clairvoyanceActive) {
    const contact = botClairvoyanceContact(room, bot, timestamp);
    if (Number(bot.botClairvoyanceUntil) > timestamp && Number(bot.mana) > 0) return contact;
    setClairvoyanceActive(room, bot, false);
  }

  const remembered = botClairvoyanceContact(room, bot, timestamp);
  if (remembered) return remembered;
  if (Number(bot.nextBotClairvoyanceAt) > timestamp) return null;

  const minimumMana = CLAIRVOYANCE_MANA_DRAIN_PER_SECOND * BOT_CLAIRVOYANCE_DURATION_MS / 1000;
  if (Number(bot.mana) + 1e-9 < minimumMana) {
    bot.nextBotClairvoyanceAt = timestamp + 3000;
    return null;
  }
  const observableCandidates = [...room.players.values()].filter((target) => (
    target.id !== bot.id &&
    (bot.role !== "attacker" || target.role !== bot.role) &&
    target.alive &&
    !target.ejected &&
    !target.inVent
  ));
  if (!observableCandidates.length) {
    bot.nextBotClairvoyanceAt = timestamp + 3000;
    return null;
  }
  const target = observableCandidates.sort((a, b) => {
    const claimsA = activeBotClaimCount(room, bot, a.id, "botClairvoyanceTargetId", "botClairvoyanceObservedUntil", timestamp);
    const claimsB = activeBotClaimCount(room, bot, b.id, "botClairvoyanceTargetId", "botClairvoyanceObservedUntil", timestamp);
    const scoutCycle = Math.floor(timestamp / Math.max(1, BOT_CLAIRVOYANCE_INTERVAL_MIN_MS));
    if (bot.role === "attacker" && a.role === "defender" && b.role === "defender") {
      return defenderIdeaVisibleThreatStage(b) - defenderIdeaVisibleThreatStage(a) ||
        claimsA - claimsB ||
        botTargetAffinity(bot, a, scoutCycle) - botTargetAffinity(bot, b, scoutCycle) ||
        a.id.localeCompare(b.id);
    }
    return claimsA - claimsB ||
      botTargetAffinity(bot, a, scoutCycle) - botTargetAffinity(bot, b, scoutCycle) ||
      a.id.localeCompare(b.id);
  })[0];
  bot.botClairvoyanceTargetId = target.id;
  bot.botClairvoyanceTargetX = target.x;
  bot.botClairvoyanceTargetY = target.y;
  bot.botClairvoyanceUntil = timestamp + BOT_CLAIRVOYANCE_DURATION_MS;
  bot.botClairvoyanceObservedUntil = bot.botClairvoyanceUntil + BOT_CLAIRVOYANCE_MEMORY_MS;
  const intervalMinimum = bot.role === "attacker"
    ? BOT_ATTACKER_CLAIRVOYANCE_INTERVAL_MIN_MS
    : BOT_CLAIRVOYANCE_INTERVAL_MIN_MS;
  const intervalJitterRange = bot.role === "attacker"
    ? BOT_ATTACKER_CLAIRVOYANCE_INTERVAL_JITTER_MS
    : BOT_CLAIRVOYANCE_INTERVAL_JITTER_MS;
  const intervalJitter = intervalJitterRange > 0
    ? stableBotHash(`${bot.id}:${target.id}:${Math.floor(timestamp / BOT_CLAIRVOYANCE_DURATION_MS)}`) % intervalJitterRange
    : 0;
  bot.nextBotClairvoyanceAt = bot.botClairvoyanceUntil + intervalMinimum + intervalJitter;
  setClairvoyanceActive(room, bot, true);
  pushEvent(room, `${bot.name} が千里眼で敵陣営を索敵しました。`);
  return target;
}

function attackerBotKillUrgencyState(room, bot, timestamp = now()) {
  if (
    room?.phase !== "playing" ||
    !bot?.isBot ||
    bot.role !== "attacker" ||
    !bot.alive ||
    bot.ejected
  ) return { level: "none", ideaThreatStage: 0, urgent: false, critical: false };
  const ideaThreatStage = alivePlayers(room, "defender").reduce(
    (maximum, defender) => Math.max(maximum, defenderIdeaVisibleThreatStage(defender)),
    0
  );
  const critical = ideaThreatStage >= 3;
  const urgent = critical || ideaThreatStage >= 2;
  return {
    level: critical ? "critical" : urgent ? "urgent" : "comfortable",
    ideaThreatStage,
    urgent,
    critical
  };
}

function defenderIdeaVisibleThreatStage(defender) {
  if (!defender?.alive || defender.ejected || defender.role !== "defender") return 0;
  // ideaStage/goodActive/ascension are serialized to every ordinary player and
  // have field ATEs. Exact ideaProgressMs, resources and thresholds are self-only
  // and must never be read by a bot for target selection.
  return Math.max(
    0,
    Math.min(4, Number(defender.ideaStage) || 0),
    defender.goodActive ? 3 : 0,
    Number(defender.ascensionUntil) > 0 ? 4 : 0
  );
}

function botKillOpportunityProfile(room, bot, target) {
  if (!target?.alive || target.ejected || target.inVent || target.role !== "defender") {
    return { witnesses: [], thirdParties: [], witnessCount: Infinity, thirdPartyCount: Infinity, isolated: false, hidden: false };
  }
  const thirdParties = [...room.players.values()].filter((candidate) => (
    candidate.id !== bot.id &&
    candidate.id !== target.id &&
    candidate.alive &&
    !candidate.ejected &&
    !candidate.inVent &&
    botCanDirectlyObservePlayer(room, bot, candidate) &&
    (
      distance(candidate, target) <= BOT_ATTACKER_ISOLATION_RANGE ||
      distance(candidate, bot) <= BOT_ATTACKER_ISOLATION_RANGE
    )
  ));
  const witnesses = thirdParties.filter((candidate) => {
    const sees = (subject) => {
      if (distance(candidate, subject) > BOT_KILL_WITNESS_RANGE) return false;
      const dx = subject.x - candidate.x;
      const dy = subject.y - candidate.y;
      const length = Math.hypot(dx, dy) || 1;
      return clearShotPath(room, candidate, subject, dx / length, dy / length);
    };
    return sees(bot) || sees(target);
  });
  return {
    witnesses,
    thirdParties,
    witnessCount: witnesses.length,
    thirdPartyCount: thirdParties.length,
    isolated: thirdParties.length === 0,
    hidden: witnesses.length === 0
  };
}

function compareAttackerDefenderPriority(room, bot, a, b, timestamp = now(), claimsA = 0, claimsB = 0) {
  const ideaA = defenderIdeaVisibleThreatStage(a);
  const ideaB = defenderIdeaVisibleThreatStage(b);
  const opportunityA = botKillOpportunityProfile(room, bot, a);
  const opportunityB = botKillOpportunityProfile(room, bot, b);
  const immediateA = botHasImmediateLethalOpportunity(room, bot, a, timestamp) ? 1 : 0;
  const immediateB = botHasImmediateLethalOpportunity(room, bot, b, timestamp) ? 1 : 0;
  return ideaB - ideaA ||
    immediateB - immediateA ||
    claimsA - claimsB ||
    opportunityA.witnessCount - opportunityB.witnessCount ||
    opportunityA.thirdPartyCount - opportunityB.thirdPartyCount ||
    distance(bot, a) - distance(bot, b) ||
    botTargetAffinity(bot, a, Math.floor(timestamp / 12_000)) - botTargetAffinity(bot, b, Math.floor(timestamp / 12_000)) ||
    a.id.localeCompare(b.id);
}

function botCanDirectlyObservePosition(room, bot, target, maximumRange = BOT_BODY_NOTICE_RANGE) {
  if (!bot?.alive || bot.ejected || bot.inVent || !Number.isFinite(Number(target?.x)) || !Number.isFinite(Number(target?.y))) return false;
  const targetDistance = distance(bot, target);
  if (targetDistance > Math.max(1, Number(maximumRange) || BOT_BODY_NOTICE_RANGE)) return false;
  const dx = Number(target.x) - Number(bot.x);
  const dy = Number(target.y) - Number(bot.y);
  const length = Math.hypot(dx, dy) || 1;
  return clearShotPath(room, bot, target, dx / length, dy / length);
}

function botCanDirectlyObservePlayer(room, bot, target) {
  if (!target?.alive || target.ejected || target.inVent || target.id === bot?.id) return false;
  return botCanDirectlyObservePosition(room, bot, target);
}

function visibleDefenderCandidates(room, bot, timestamp = now()) {
  return alivePlayers(room, "defender").filter((target) => botCanDirectlyObservePlayer(room, bot, target)).sort((a, b) => {
    const claimsA = activeBotClaimCount(room, bot, a.id, "botTarget", "botTargetUntil", timestamp);
    const claimsB = activeBotClaimCount(room, bot, b.id, "botTarget", "botTargetUntil", timestamp);
    return compareAttackerDefenderPriority(room, bot, a, b, timestamp, claimsA, claimsB);
  });
}

function visibleDefenderTarget(room, bot, timestamp = now()) {
  return visibleDefenderCandidates(room, bot, timestamp)[0] || null;
}

function preferredDefenderTarget(room, bot, timestamp = now()) {
  const pendingTarget = room.players.get(String(bot.attackTargetId || ""));
  if (pendingTarget?.alive && !pendingTarget.ejected && pendingTarget.role === "defender") return pendingTarget;
  const scouted = botClairvoyanceContact(room, bot, timestamp);
  if (scouted?.role === "defender") {
    bot.botTarget = scouted.id;
    bot.botTargetUntil = Math.max(timestamp + 2000, Number(bot.botClairvoyanceObservedUntil) || 0);
    return scouted;
  }
  const visible = visibleDefenderTarget(room, bot, timestamp);
  if (visible) {
    bot.botTarget = visible.id;
    bot.botTargetUntil = timestamp + BOT_HEARING_MEMORY_MS;
    return visible;
  }
  bot.botTarget = "";
  bot.botTargetUntil = 0;
  return null;
}

function defenderBotOwnsPursuitSlot(room, bot, target, timestamp = now()) {
  if (!bot?.isBot || bot.role !== "defender" || !target) return false;
  const eligible = [...room.players.values()].filter((candidate) => {
    if (!candidate.isBot || candidate.role !== "defender" || !candidate.alive || candidate.ejected || candidate.inVent) return false;
    return botKnownAttackerEvidence(room, candidate, timestamp)?.id === target.id;
  }).sort((a, b) => {
    const distanceBandA = Math.floor(distance(a, target) / 160);
    const distanceBandB = Math.floor(distance(b, target) / 160);
    return distanceBandA - distanceBandB ||
      botTargetAffinity(a, target, 0) - botTargetAffinity(b, target, 0) ||
      distance(a, target) - distance(b, target) ||
      a.id.localeCompare(b.id);
  });
  return eligible[0]?.id === bot.id;
}

function clearBotAttackerDeception(bot) {
  bot.botDeceptionPhase = "";
  bot.botDeceptionUntil = 0;
  bot.botDeceptionTargetId = "";
  bot.botDeceptionStationId = "";
  bot.botDeceptionPresenceSince = 0;
}

function botHasImmediateLethalOpportunity(room, bot, target, timestamp = now()) {
  if (!target?.alive || target.ejected || target.role !== "defender") return false;
  const targetDistance = distance(bot, target);
  if (bot.attackResolveAt > timestamp) return true;
  if (bot.killReadyAt <= timestamp && targetDistance <= Math.max(72, room.settings.killRange * 0.58)) return true;
  if (bot.special !== "gunner" || !bot.gunnerSnipingActive || bot.gunnerReloadUntil > timestamp || bot.gunReadyAt > timestamp) return false;
  const loadedWeapon = Object.values(GUNNER_WEAPONS)
    .filter((weapon) => gunnerWeaponAvailable(bot, weapon.id))
    .filter((weapon) => (Number(bot.gunnerAmmo?.[weapon.id]) || 0) >= weapon.ammoPerShot)
    .filter((weapon) => targetDistance <= weapon.range)
    .sort((a, b) => a.cooldownMs - b.cooldownMs || b.range - a.range)[0];
  if (!loadedWeapon) return false;
  const dx = target.x - bot.x;
  const dy = target.y - bot.y;
  const length = Math.hypot(dx, dy) || 1;
  return clearShotPath(room, bot, target, dx / length, dy / length);
}

function attackerFakeTaskStation(room, bot, map, actualTarget, timestamp = now()) {
  const cycle = Math.max(0, Number(bot.botDeceptionCycle) || 0);
  return (map.stations || [])
    .filter((station) => station.type === "task" && isWalkable(room, station.x, station.y, map.playerRadius))
    .sort((a, b) => {
      const claimsA = [...room.players.values()].filter((other) => (
        other.isBot && other.id !== bot.id && other.role === "attacker" && other.alive && !other.ejected &&
        other.botDeceptionPhase === "fake-task" && other.botDeceptionStationId === a.id && Number(other.botDeceptionUntil) > timestamp
      )).length;
      const claimsB = [...room.players.values()].filter((other) => (
        other.isBot && other.id !== bot.id && other.role === "attacker" && other.alive && !other.ejected &&
        other.botDeceptionPhase === "fake-task" && other.botDeceptionStationId === b.id && Number(other.botDeceptionUntil) > timestamp
      )).length;
      const actualSeparationA = actualTarget ? distance(a, actualTarget) : 0;
      const actualSeparationB = actualTarget ? distance(b, actualTarget) : 0;
      return claimsA - claimsB ||
        actualSeparationB - actualSeparationA ||
        botTargetAffinity(bot, a, cycle) - botTargetAffinity(bot, b, cycle) ||
        distance(bot, a) - distance(bot, b) ||
        a.id.localeCompare(b.id);
    })[0] || null;
}

function beginBotAttackerCommit(bot, timestamp = now()) {
  const cycle = Math.max(0, Number(bot.botDeceptionCycle) || 0);
  bot.botDeceptionPhase = "commit";
  bot.botDeceptionUntil = timestamp + BOT_ATTACKER_COMMIT_MS + stableBotHash(`${bot.id}:commit:${cycle}`) % 1_400;
  bot.botDeceptionTargetId = "";
  bot.botDeceptionStationId = "";
  bot.botDeceptionPresenceSince = 0;
}

function beginBotAttackerDecoy(room, bot, actualTarget, timestamp = now()) {
  const cycle = Math.max(0, Number(bot.botDeceptionCycle) || 0);
  const decoy = visibleDefenderCandidates(room, bot, timestamp)
    .filter((candidate) => candidate.id !== actualTarget?.id)
    .sort((a, b) => {
      const claimsA = activeBotClaimCount(room, bot, a.id, "botDeceptionTargetId", "botDeceptionUntil", timestamp);
      const claimsB = activeBotClaimCount(room, bot, b.id, "botDeceptionTargetId", "botDeceptionUntil", timestamp);
      return claimsA - claimsB ||
        botTargetAffinity(bot, a, cycle) - botTargetAffinity(bot, b, cycle) ||
        distance(bot, a) - distance(bot, b) ||
        a.id.localeCompare(b.id);
    })[0] || null;
  if (!decoy) {
    beginBotAttackerCommit(bot, timestamp);
    return null;
  }
  bot.botDeceptionPhase = "decoy";
  bot.botDeceptionTargetId = decoy.id;
  bot.botDeceptionStationId = "";
  bot.botDeceptionPresenceSince = 0;
  bot.botDeceptionUntil = timestamp + BOT_ATTACKER_DECOY_PURSUIT_MS + stableBotHash(`${bot.id}:decoy:${cycle}`) % 900;
  bot.navPath = [];
  bot.navCalculatedAt = 0;
  return decoy;
}

function beginBotAttackerFakeTask(room, bot, map, actualTarget, timestamp = now()) {
  bot.botDeceptionCycle = Math.max(0, Number(bot.botDeceptionCycle) || 0) + 1;
  const station = attackerFakeTaskStation(room, bot, map, actualTarget, timestamp);
  if (!station) {
    beginBotAttackerDecoy(room, bot, actualTarget, timestamp);
    return null;
  }
  bot.botDeceptionPhase = "fake-task";
  bot.botDeceptionTargetId = "";
  bot.botDeceptionStationId = station.id;
  bot.botDeceptionPresenceSince = 0;
  bot.botDeceptionUntil = timestamp + BOT_ATTACKER_FAKE_TASK_TRAVEL_MS + stableBotHash(`${bot.id}:task:${bot.botDeceptionCycle}`) % 1_600;
  bot.navPath = [];
  bot.navCalculatedAt = 0;
  return station;
}

function runBotAttackerDeception(room, bot, map, actualTarget, timestamp = now()) {
  if (bot.role !== "attacker" || !botHasHumanOpponent(room, bot) || !bot.alive || bot.ejected || bot.inVent) {
    clearBotAttackerDeception(bot);
    return false;
  }
  const urgency = attackerBotKillUrgencyState(room, bot, timestamp);
  const opportunity = botKillOpportunityProfile(room, bot, actualTarget);
  if (
    urgency.urgent ||
    opportunity.isolated ||
    (opportunity.hidden && distance(bot, actualTarget) <= Math.max(BOT_ATTACKER_ISOLATION_RANGE, room.settings.killRange * 2)) ||
    bot.attackResolveAt > timestamp ||
    botHasImmediateLethalOpportunity(room, bot, actualTarget, timestamp)
  ) {
    beginBotAttackerCommit(bot, timestamp);
    return false;
  }
  if (bot.botDeceptionPhase === "commit" && Number(bot.botDeceptionUntil) > timestamp) return false;
  if (!bot.botDeceptionPhase || Number(bot.botDeceptionUntil) <= timestamp) {
    if (bot.botDeceptionPhase === "fake-task") beginBotAttackerDecoy(room, bot, actualTarget, timestamp);
    else if (bot.botDeceptionPhase === "decoy") beginBotAttackerCommit(bot, timestamp);
    else beginBotAttackerFakeTask(room, bot, map, actualTarget, timestamp);
  }
  if (bot.botDeceptionPhase === "commit") return false;

  if (bot.gunFiring) stopGunnerFire(room, bot, { reason: "偽装行動" });
  if (bot.botDeceptionPhase === "fake-task") {
    const station = (map.stations || []).find((entry) => entry.id === bot.botDeceptionStationId);
    if (!station) {
      beginBotAttackerDecoy(room, bot, actualTarget, timestamp);
      return bot.botDeceptionPhase !== "commit";
    }
    if (distance(bot, station) > Math.max(56, map.taskRange * 0.72)) {
      moveBotToward(room, bot, station);
      return true;
    }
    stopBotForInteraction(bot, timestamp);
    if (!Number(bot.botDeceptionPresenceSince)) {
      bot.botDeceptionPresenceSince = timestamp;
      pushMagicEffect(room, "action-task", bot, { radius: 82, playerId: bot.id, variant: "attendance" });
    }
    if (timestamp - Number(bot.botDeceptionPresenceSince) >= BOT_ATTACKER_FAKE_TASK_PRESENCE_MS) {
      beginBotAttackerDecoy(room, bot, actualTarget, timestamp);
    }
    return bot.botDeceptionPhase !== "commit";
  }

  if (bot.botDeceptionPhase === "decoy") {
    const decoy = room.players.get(String(bot.botDeceptionTargetId || ""));
    if (!decoy?.alive || decoy.ejected || decoy.role !== "defender") {
      beginBotAttackerCommit(bot, timestamp);
      return false;
    }
    // A fresh target evaluation may promote the apparent target to the real
    // target. From that point it is no longer a feint and normal combat resumes.
    if (decoy.id === actualTarget?.id) {
      beginBotAttackerCommit(bot, timestamp);
      return false;
    }
    const dx = decoy.x - bot.x;
    const dy = decoy.y - bot.y;
    const length = Math.hypot(dx, dy) || 1;
    bot.aimX = dx / length;
    bot.aimY = dy / length;
    if (distance(bot, decoy) <= Math.max(115, room.settings.killRange * 0.78)) stopBotForInteraction(bot, timestamp);
    else moveBotToward(room, bot, decoy);
    return true;
  }
  return false;
}

function useBotSabotage(room, bot, timestamp) {
  const human = soleHumanBotMatchPlayer(room);
  if (human && bot.role === human.role) return false;
  if (bot.sabotageReadyAt > timestamp || bot.nextBotSabotageAt > timestamp || room.sabotage) return false;
  const maximumStrength = botHasHumanOpponent(room, bot);
  const types = room.round % 2 === 0 ? ["oxygen", "reactor", "comms"] : ["reactor", "oxygen", "comms"];
  try {
    startSabotage(room, bot, maximumStrength ? types[0] : types[Math.floor(Math.random() * types.length)]);
    bot.nextBotSabotageAt = maximumStrength ? timestamp + BOT_TICK_MS : timestamp + 18_000 + Math.floor(Math.random() * 7000);
    return true;
  } catch {
    bot.nextBotSabotageAt = timestamp + 3000;
    return false;
  }
}

function botManaTarget(bot) {
  if (bot.special === "fighter") return FIGHTER_ENERGY_CHARGE_MANA_COST;
  if (bot.special === "teleport") return TELEPORT_MANA_COST;
  if (bot.special === "flora") return FLORA_MANA_COST;
  if (bot.special === "gunner") return 0;
  if (bot.special === "alchemist") return ALCHEMY_MANA_COST;
  return bot.role === "attacker" ? SABOTAGE_MANA_COST : DODGE_MANA_COST;
}

function refillBotMana(room, bot) {
  if ((Number(bot.mana) || 0) >= botManaTarget(bot)) return false;
  try {
    practiceRenki(room, bot);
    return true;
  } catch {
    return false;
  }
}

function runBotDefenseDecision(room, bot, nearbyAttacker, timestamp) {
  if (botHasHumanOpponent(room, bot)) {
    bot.botDefensePlannedAt = 0;
    bot.botDefenseKind = "";
    bot.botDefenseTargetId = "";
    bot.nextBotDefenseDecisionAt = timestamp + BOT_TICK_MS;
    if (!nearbyAttacker || distance(bot, nearbyAttacker) > room.settings.killRange * 1.35) return;
    if (bot.dodgeActiveUntil > timestamp) return;
    try { activateDodge(room, bot); } catch {}
    return;
  }
  if (bot.botDefensePlannedAt > 0 && bot.botDefensePlannedAt <= timestamp) {
    const plannedTarget = room.players.get(bot.botDefenseTargetId);
    const canReact = plannedTarget && plannedTarget.alive && !plannedTarget.ejected &&
      distance(bot, plannedTarget) <= room.settings.killRange * 1.35;
    const kind = bot.botDefenseKind;
    bot.botDefensePlannedAt = 0;
    bot.botDefenseKind = "";
    bot.botDefenseTargetId = "";
    if (!canReact) return;
    // The bot predicts danger from proximity alone. It must sometimes misread
    // that cue instead of turning every nearby attack into a guaranteed counter.
    if (Math.random() < 0.38) return;
    try {
      if (kind === "dodge") activateDodge(room, bot);
    } catch {}
    return;
  }

  if (timestamp < (bot.nextBotDefenseDecisionAt || 0)) return;
  bot.nextBotDefenseDecisionAt = timestamp + 4200 + Math.floor(Math.random() * 5000);
  if (!nearbyAttacker || distance(bot, nearbyAttacker) > room.settings.killRange * 1.35) return;
  if (Math.random() >= 0.16) return;

  const canDodge = bot.dodgeReadyAt <= timestamp;
  const kind = canDodge ? "dodge" : "";
  if (!kind) return;
  bot.botDefenseKind = kind;
  bot.botDefenseTargetId = nearbyAttacker.id;
  bot.botDefensePlannedAt = timestamp + 500 + Math.floor(Math.random() * 1000);
}

function selectBotGunnerWeapon(bot, targetDistance, maximumStrength = false) {
  if (!bot.gunnerAmmo || typeof bot.gunnerAmmo !== "object") bot.gunnerAmmo = createGunnerAmmo();
  if (bot.gunFiring && GUNNER_WEAPONS[bot.gunFiringWeapon]) return GUNNER_WEAPONS[bot.gunFiringWeapon];
  const preferred = targetDistance > 700
    ? ["sniper", "assault", "handgun", "smg", "taser"]
    : targetDistance > 430
      ? ["assault", "sniper", "handgun", "smg", "taser"]
      : targetDistance < 260
        ? ["smg", "taser", "handgun", "assault", "sniper"]
        : ["handgun", "taser", "smg", "assault", "sniper"];
  const usable = preferred.filter((id) => {
    const weapon = GUNNER_WEAPONS[id];
    return targetDistance <= weapon.range && (Number(bot.gunnerAmmo[id]) || 0) >= weapon.ammoPerShot;
  });
  const weaponId = maximumStrength
    ? usable.sort((a, b) => {
      const weaponA = GUNNER_WEAPONS[a];
      const weaponB = GUNNER_WEAPONS[b];
      const scoreA = bot.gunnerSnipingActive
        ? 1_000_000 / Math.max(1, weaponA.cooldownMs)
        : weaponA.damage * Math.max(weaponA.minDamageRatio, 1 - targetDistance / Math.max(1, weaponA.range) * (1 - weaponA.minDamageRatio)) * 1000 / weaponA.cooldownMs;
      const scoreB = bot.gunnerSnipingActive
        ? 1_000_000 / Math.max(1, weaponB.cooldownMs)
        : weaponB.damage * Math.max(weaponB.minDamageRatio, 1 - targetDistance / Math.max(1, weaponB.range) * (1 - weaponB.minDamageRatio)) * 1000 / weaponB.cooldownMs;
      return scoreB - scoreA || GUNNER_WEAPON_ORDER.indexOf(a) - GUNNER_WEAPON_ORDER.indexOf(b);
    })[0]
    : usable[0];
  if (!weaponId) return null;
  bot.gunnerWeapon = weaponId;
  return GUNNER_WEAPONS[weaponId];
}

function runCpuGravityScript(room, bot, timestamp) {
  const state = room.soloMission;
  if (!state || state.id !== "cpu-gravity" || state.cpuBotId !== bot.id || !bot.alive || bot.ejected) return false;
  bot.vx = 0;
  bot.vy = 0;
  bot.movementMode = "idle";
  if (bot.meditatingUntil > timestamp) return true;
  try {
    if (state.cpuPhase === "accelerate-1" || state.cpuPhase === "accelerate-2") {
      toggleGravityTime(room, bot, "accelerate", bot.id);
      state.cpuRenkiCount = 0;
      state.cpuPhase = state.cpuPhase === "accelerate-1" ? "renki-1" : "renki-2";
      return true;
    }
    if (state.cpuPhase === "renki-1" || state.cpuPhase === "renki-2") {
      if (state.cpuRenkiCount < 4) {
        practiceRenki(room, bot);
        state.cpuRenkiCount += 1;
      } else {
        state.cpuPhase = state.cpuPhase === "renki-1" ? "accelerate-2" : "heart";
      }
      return true;
    }
    if (state.cpuPhase === "heart") {
      const target = [...room.players.values()].find((candidate) => candidate.role === "defender" && candidate.alive && !candidate.ejected);
      if (!target) return true;
      if ((Number(bot.mana) || 0) < HEART_TELEPORT_MANA_COST) {
        state.cpuPhase = "accelerate-1";
        state.cpuRenkiCount = 0;
        return true;
      }
      rememberBotKillDecision(room, bot, target, {
        code: "cpu-gravity-public-training-script",
        actionLabel: "心臓転移",
        evidence: ["CPU訓練画面で公開された対戦対象"],
        reasons: ["訓練課題で指定された心臓転移フェーズに到達し、必要MPを保持"]
      }, timestamp);
      teleportPlayer(room, bot, undefined, undefined, target.id, "heart");
      if (room.phase === "playing" && !alivePlayers(room, "defender").length) checkWin(room);
      return true;
    }
  } catch {
    state.cpuPhase = "accelerate-1";
    state.cpuRenkiCount = 0;
  }
  return true;
}

function runCpuStage2Script(room, bot, timestamp) {
  const state = room.soloMission;
  if (!state || state.id !== "cpu-stage2" || state.cpuBotId !== bot.id || !bot.alive || bot.ejected) return false;
  const target = [...room.players.values()]
    .filter((candidate) => candidate.role === "defender" && candidate.alive && !candidate.ejected)
    .sort((a, b) => distance(bot, a) - distance(bot, b))[0];
  if (!target) return true;
  if ((Number(bot.vibeCodingReadyAt) || 0) > timestamp || availableStamina(bot) < 6) return false;
  bot.vx = 0;
  bot.vy = 0;
  bot.movementMode = "idle";
  try {
    rememberBotKillDecision(room, bot, target, {
      code: "cpu-hacker-public-training-script",
      actionLabel: "バイブコーディング: HP削除",
      evidence: ["CPU訓練画面で公開された対戦対象"],
      reasons: ["訓練課題で指定されたハック行動のクールタイムとSP条件を満たした"]
    }, timestamp);
    useAlchemy(room, bot, "hack-hp-delete", target.id);
    return true;
  } catch {
    return false;
  }
}

function stopBotForInteraction(bot, timestamp = now()) {
  bot.vx = 0;
  bot.vy = 0;
  bot.movementMode = "idle";
  bot.lastMoveAt = timestamp;
  clearStoredMovementInput(bot, timestamp);
}

function runFriendlyDefenderPatrol(room, bot, map) {
  if (bot.role !== "defender" || botIsEnemyOfSoleHuman(room, bot)) return false;
  const roomCenters = [...(map.rooms || []), ...(map.corridors || [])].map((rect, index) => ({
    id: `patrol-area-${rect.id || index}`,
    x: Number(rect.x) + Number(rect.w) / 2,
    y: Number(rect.y) + Number(rect.h) / 2
  }));
  const patrolPoints = [
    ...(map.objects || []),
    ...(map.stations || []),
    ...(map.spawns || []),
    ...roomCenters
  ].filter((point) => Number.isFinite(point?.x) && Number.isFinite(point?.y) &&
    isWalkable(room, Number(point.x), Number(point.y), map.playerRadius));
  if (!patrolPoints.length) return true;
  for (let attempt = 0; attempt < Math.min(6, patrolPoints.length); attempt += 1) {
    let target = patrolPoints.find((point) => point.id === bot.botPatrolTargetId);
    if (!target || distance(bot, target) <= Math.max(70, map.taskRange * 0.55)) {
      const alternatives = patrolPoints.filter((point) => point.id !== bot.botPatrolTargetId);
      target = alternatives[Math.floor(Math.random() * alternatives.length)] || patrolPoints[0];
      bot.botPatrolTargetId = target.id || `${Math.round(target.x)}:${Math.round(target.y)}`;
    }
    if (moveBotToward(room, bot, target)) {
      bot.botPatrolPathFailures = 0;
      return true;
    }
    bot.botPatrolTargetId = "";
    bot.navPath = [];
    bot.navCalculatedAt = 0;
  }
  bot.botPatrolPathFailures = (Number(bot.botPatrolPathFailures) || 0) + 1;
  stopBotForInteraction(bot);
  return true;
}

function clearBotTaskInteraction(bot, { clearTarget = false } = {}) {
  if (!bot) return;
  bot.botTaskPresenceSince = 0;
  bot.botTaskPresenceLastTickAt = 0;
  if (clearTarget) bot.botTaskTargetId = "";
}

function runEnemyDefenderTask(room, bot, map, timestamp = now()) {
  if (
    bot?.role !== "defender" ||
    !bot.alive ||
    bot.ejected ||
    !botIsEnemyOfSoleHuman(room, bot)
  ) {
    clearBotTaskInteraction(bot, { clearTarget: true });
    return false;
  }

  const pending = (Array.isArray(bot.taskList) ? bot.taskList : []).filter((item) => !item.done);
  const pendingDownloads = pending.filter((item) => item.type === "download");
  const candidates = pendingDownloads.length ? pendingDownloads : pending;
  bot.botTaskBlockedUntilById ||= {};
  for (const [taskId, blockedUntil] of Object.entries(bot.botTaskBlockedUntilById)) {
    if (Number(blockedUntil) <= timestamp) delete bot.botTaskBlockedUntilById[taskId];
  }

  const entries = candidates
    .map((task) => ({ task, station: findStation(map, task.stationId) }))
    .filter((entry) => entry.station);
  let taskTarget = entries.find(({ task }) => (
    task.id === bot.botTaskTargetId &&
    Number(bot.botTaskBlockedUntilById[task.id] || 0) <= timestamp
  ));
  if (!taskTarget) {
    taskTarget = entries
      .filter(({ task }) => Number(bot.botTaskBlockedUntilById[task.id] || 0) <= timestamp)
      .sort((a, b) => distance(bot, a.station) - distance(bot, b.station))[0];
    bot.botTaskTargetId = taskTarget?.task.id || "";
    clearBotTaskInteraction(bot);
  }
  if (!taskTarget) {
    clearBotTaskInteraction(bot, { clearTarget: true });
    return false;
  }

  const { task, station } = taskTarget;
  if (distance(bot, station) > map.taskRange) {
    clearBotTaskInteraction(bot);
    if (!teleportBotToward(room, bot, station)) {
      const moved = moveBotToward(room, bot, station);
      bot.botTaskPathFailures = moved ? 0 : (Number(bot.botTaskPathFailures) || 0) + 1;
      if (bot.botTaskPathFailures >= 3) {
        bot.botTaskBlockedUntilById[task.id] = timestamp + 5000;
        bot.botTaskPathFailures = 0;
        bot.navPath = [];
        bot.navCalculatedAt = 0;
        clearBotTaskInteraction(bot, { clearTarget: true });
      }
    }
    return true;
  }

  bot.botTaskPathFailures = 0;
  stopBotForInteraction(bot, timestamp);
  const interactionWasInterrupted = (
    bot.botTaskTargetId !== task.id ||
    !Number(bot.botTaskPresenceSince) ||
    timestamp - Number(bot.botTaskPresenceLastTickAt || 0) > BOT_TICK_MS * 2.5
  );
  bot.botTaskTargetId = task.id;
  bot.botTaskPresenceLastTickAt = timestamp;
  if (interactionWasInterrupted) {
    bot.botTaskPresenceSince = timestamp;
    return true;
  }

  const requiredPresenceMs = Math.min(900, AUTO_TASK_PRESENCE_MS / effectiveAccelerationMultiplier(room, bot, timestamp));
  if (timestamp - Number(bot.botTaskPresenceSince) < requiredPresenceMs || Number(bot.taskAutoReadyAt) > timestamp) return true;
  try {
    completeTask(room, bot, task.id);
    clearBotTaskInteraction(bot, { clearTarget: true });
  } catch (error) {
    bot.botTaskPresenceSince = timestamp;
    bot.botTaskPresenceLastTickAt = timestamp;
    if (error instanceof ApiError && error.status === 404) {
      bot.botTaskBlockedUntilById[task.id] = timestamp + 5000;
      clearBotTaskInteraction(bot, { clearTarget: true });
    }
  }
  return true;
}

function runBotGroundItemPickup(room, bot) {
  if (!bot?.alive || bot.ejected || bot.inVent || !itemStorageAvailable(bot)) return false;
  const nearby = (room.groundItems || [])
    .map((groundItem) => ({ groundItem, distance: distance(bot, groundItem) }))
    .filter(({ groundItem, distance: itemDistance }) => itemDistance <= Number(groundItem.pickupRange || GROUND_ITEM_PICKUP_RANGE))
    .sort((a, b) => a.distance - b.distance)[0]?.groundItem;
  if (!nearby) return false;
  try {
    pickupGroundItem(room, bot, nearby.id);
    stopBotForInteraction(bot);
    return true;
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    return false;
  }
}

function runPlayingBots(room) {
  const timestamp = now();
  const map = getMap(room);
  for (const bot of room.players.values()) {
    if (!bot.isBot || bot.ejected || bot.inVent || timeKeeperStops(bot, timestamp) || timestamp < bot.nextBotActionAt) continue;
    bot.nextBotActionAt = timestamp + BOT_TICK_MS - 5;
    const maximumStrength = botHasHumanOpponent(room, bot);
    const attackerUrgency = attackerBotKillUrgencyState(room, bot, timestamp);

    if (runCpuStage2Script(room, bot, timestamp)) continue;
    if (runCpuGravityScript(room, bot, timestamp)) continue;

    if (room.soloMission?.id === "emp" && bot.alive) {
      bot.vx = 0;
      bot.vy = 0;
      bot.movementMode = "idle";
      if (bot.empReadyAt <= timestamp) {
        try {
          activateEmp(room, bot, Math.floor(timestamp / 3000) % 2 ? "negative" : "positive");
          bot.empReadyAt = timestamp + 3000;
        } catch {}
      }
      continue;
    }

    if (!attackerUrgency.urgent && runBotBodyReport(room, bot)) return;
    if (bot.alive && runBotStandFirmRetaliation(room, bot, timestamp)) continue;
    if (!attackerUrgency.urgent && bot.alive && runBotGroundItemPickup(room, bot)) continue;

    if (bot.alive) runBotClairvoyanceSearch(room, bot, timestamp);

    if (!attackerUrgency.urgent && bot.alive && refillBotMana(room, bot)) continue;

    if (bot.role === "attacker" && bot.alive) {
      if (bot.special === "alchemist" && Number(bot.mana) >= RATIONAL_MANA_THRESHOLD && (bot.stamina < MAX_STAMINA || bot.substitutionCharges < 1)) {
        try { useAlchemy(room, bot, bot.substitutionCharges < 1 ? "substitution" : "stamina"); } catch {}
      }
      const heardWaypoint = heardMovementWaypoint(room, bot, timestamp);
      const target = preferredDefenderTarget(room, bot, timestamp);
      if (runBotAttackerDeception(room, bot, map, target, timestamp)) continue;
      if (bot.gunFiring && (!target || distance(bot, target) > gunnerWeaponFor(bot).range)) stopGunnerFire(room, bot, { reason: "対象喪失" });
      if (target && distance(bot, target) <= EMP_RANGE && bot.empReadyAt <= timestamp && (maximumStrength || Math.random() < 0.08)) {
        try {
          rememberBotKillDecision(room, bot, target, {
            code: "observable-target-in-emp-range",
            actionLabel: "EMP",
            reasons: ["直接観測または千里眼の観測記憶上の対象がEMP有効範囲内に入り、自分のEMPが使用可能"]
          }, timestamp);
          activateEmp(room, bot);
        } catch {}
      }
      const targetDistance = target ? distance(bot, target) : Infinity;
      const killOpportunity = botKillOpportunityProfile(room, bot, target);
      if (
        target &&
        bot.special === "teleport" &&
        bot.teleportReadyAt <= timestamp &&
        Number(bot.mana) >= HEART_TELEPORT_MANA_COST &&
        (attackerUrgency.urgent || killOpportunity.hidden || killOpportunity.isolated)
      ) {
        try {
          rememberBotKillDecision(room, bot, target, {
            code: "observable-target-heart-teleport-opportunity",
            actionLabel: "心臓転移",
            reasons: [
              attackerUrgency.urgent
                ? "公開ATEで対象側の善への進行脅威を確認"
                : killOpportunity.hidden
                  ? "自分の視界内に攻撃現場を見届ける第三者を確認できない"
                  : "自分の視界内で対象が孤立",
              "心臓転移に必要なMPとクールタイム条件を満たした"
            ]
          }, timestamp);
          teleportPlayer(room, bot, undefined, undefined, target.id, "heart");
          continue;
        } catch {}
      }
      const botGunnerWeapon = target && bot.special === "gunner"
        ? selectBotGunnerWeapon(bot, targetDistance, maximumStrength)
        : null;
      if (target && bot.special === "gunner" && !botGunnerWeapon && bot.gunnerReloadUntil <= timestamp) {
        try { reloadGunner(room, bot); } catch {}
      }
      if (
        target &&
        bot.special === "gunner" &&
        botGunnerWeapon &&
        bot.gunReadyAt <= timestamp &&
        targetDistance <= botGunnerWeapon.range &&
        (() => {
          const dx = target.x - bot.x;
          const dy = target.y - bot.y;
          const length = Math.hypot(dx, dy) || 1;
          return clearShotPath(room, bot, target, dx / length, dy / length);
        })()
      ) {
        try {
          rememberBotKillDecision(room, bot, target, {
            code: "observable-target-clear-gun-line",
            actionLabel: `${botGunnerWeapon.name}射撃`,
            reasons: [
              "対象が選択中の銃の射程内に入り、遮蔽物のない射線を確認",
              "弾薬と射撃クールタイムの条件を満たした"
            ]
          }, timestamp);
          shootGunner(room, bot, target.x - bot.x, target.y - bot.y, "start", 0, "", true);
        } catch {}
      } else if (bot.aimTargetId) {
        stopBotForInteraction(bot, timestamp);
      } else if (
        target &&
        distance(bot, target) <= Math.max(72, room.settings.killRange * 0.58) &&
        bot.killReadyAt <= timestamp &&
        !bot.aimTargetId
      ) {
        try {
          rememberBotKillDecision(room, bot, target, {
            code: "observable-target-ninjutsu-range",
            actionLabel: ninjutsuEliminationProfile(bot).attackLabel,
            reasons: ["観測記憶上の対象が忍殺の開始距離に入り、キルクールタイムが完了"]
          }, timestamp);
          startNinjutsu(room, bot, target.id);
        } catch {}
      } else if (target) {
        if (!attackerUrgency.urgent) useBotSabotage(room, bot, timestamp);
        moveBotToward(room, bot, target);
      } else {
        if (!attackerUrgency.urgent) useBotSabotage(room, bot, timestamp);
        if (heardWaypoint) {
          moveBotToward(room, bot, heardWaypoint);
        } else {
          const patrol = map.stations[(Math.floor(timestamp / 2500) + Number.parseInt(bot.id.replace(/\D/g, "") || "0", 10)) % map.stations.length];
          if (patrol) moveBotToward(room, bot, patrol);
        }
      }
      continue;
    }

    if (bot.role !== "defender" || bot.ejected) continue;

    if (bot.alive) {
      if (bot.special === "flora" && (bot.bodyHits > 0 || bot.overheal < 1) && bot.floraReadyAt <= timestamp) {
        try { healFlora(room, bot); } catch {}
      }
      const nearbyAttacker = botKnownAttackerEvidence(room, bot, timestamp);
      runBotDefenseDecision(room, bot, nearbyAttacker, timestamp);
    }

    if (room.sabotage && bot.alive) {
      const station = nearestRepairStation(room, bot, room.sabotage.type);
      if (station) {
        if (distance(bot, station) <= map.taskRange) {
          try {
            repair(room, bot);
          } catch {}
        } else if (!teleportBotToward(room, bot, station)) {
          moveBotToward(room, bot, station);
        }
        continue;
      }
    }

    const defenderEvidenceTarget = botKnownAttackerEvidence(room, bot, timestamp);
    if (
      defenderEvidenceTarget &&
      defenderBotOwnsPursuitSlot(room, bot, defenderEvidenceTarget, timestamp)
    ) {
      moveBotToward(room, bot, defenderEvidenceTarget);
      continue;
    }

    if (runFriendlyDefenderPatrol(room, bot, map)) continue;

    runEnemyDefenderTask(room, bot, map, timestamp);
  }
}

function nearestRepairStation(room, player, repairType) {
  const map = getMap(room);
  const stations = map.stations.filter((station) => station.type === "repair" && station.repair === repairType);
  const unrepaired = stations.filter((station) => !room.sabotage?.repairedPoints?.[station.id]);
  return (unrepaired.length ? unrepaired : stations)
    .sort((a, b) => distance(player, a) - distance(player, b))[0];
}

setInterval(botTick, BOT_TICK_MS);
setInterval(pushRealtimeStates, REALTIME_STATE_INTERVAL_MS);

Promise.allSettled([hydrateCheckpointArchive(), hydratePlayerProfiles()]).finally(() => {
  server.listen(PORT, () => {
    console.log(`Defenders vs Attackers server: http://localhost:${PORT}`);
  });
});

function offlineApiRequest(pathname, body = {}) {
  return new Promise((resolve) => {
    const text = JSON.stringify(body || {});
    let status = 200;
    const req = {
      method: "POST",
      url: pathname,
      headers: { host: "offline.local" },
      socket: { remoteAddress: body._offlineDeveloper ? "127.0.0.1" : `offline:${String(body.clientId || "anonymous").slice(0, 96)}` },
      destroyed: false,
      destroy() { this.destroyed = true; },
      on(event, callback) {
        if (event === "data") callback(text);
        else if (event === "end") queueMicrotask(callback);
        return this;
      }
    };
    const res = {
      setHeader() {},
      writeHead(nextStatus) { status = Number(nextStatus) || 200; },
      end(payloadText = "") {
        let payload;
        try { payload = payloadText ? JSON.parse(payloadText) : {}; }
        catch { payload = { ok: false, error: "offline-response-parse-failed" }; }
        payload.offline = true;
        payload.status = status;
        resolve(payload);
      }
    };
    Promise.resolve(handleApi(req, res)).catch((error) => {
      res.writeHead(error instanceof ApiError ? error.status : 500);
      res.end(JSON.stringify({ ok: false, error: error?.message || "offline-request-failed" }));
    });
  });
}
self.addEventListener("message", async (event) => {
  const message = event.data || {};
  if (message.type !== "request" || !message.id) return;
  const result = await offlineApiRequest(String(message.path || "/"), message.body || {});
  self.postMessage({ type: "response", id: message.id, result });
});
self.postMessage({ type: "ready", version: "physical-hsg-contribution-ranking-v514" });
})();