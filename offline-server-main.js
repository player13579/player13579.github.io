/* Generated from server.js by scripts/build-offline-worker.ps1. Do not edit directly. */
(() => {
const module = undefined;
const exports = undefined;
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;"undefined"!=typeof window?e=window:"undefined"!=typeof global?e=global:"undefined"!=typeof self&&(e=self),e.PF=t()}}(function(){return function t(e,r,i){function n(s,a){if(!r[s]){if(!e[s]){var u="function"==typeof require&&require;if(!a&&u)return u(s,!0);if(o)return o(s,!0);var h=new Error("Cannot find module '"+s+"'");throw h.code="MODULE_NOT_FOUND",h}var l=r[s]={exports:{}};e[s][0].call(l.exports,function(t){var r=e[s][1][t];return n(r?r:t)},l,l.exports,t,e,r,i)}return r[s].exports}for(var o="function"==typeof require&&require,s=0;s<i.length;s++)n(i[s]);return n}({1:[function(t,e){e.exports=t("./lib/heap")},{"./lib/heap":2}],2:[function(t,e){!function(){var t,r,i,n,o,s,a,u,h,l,p,c,f,d,g;i=Math.floor,l=Math.min,r=function(t,e){return e>t?-1:t>e?1:0},h=function(t,e,n,o,s){var a;if(null==n&&(n=0),null==s&&(s=r),0>n)throw new Error("lo must be non-negative");for(null==o&&(o=t.length);o>n;)a=i((n+o)/2),s(e,t[a])<0?o=a:n=a+1;return[].splice.apply(t,[n,n-n].concat(e)),e},s=function(t,e,i){return null==i&&(i=r),t.push(e),d(t,0,t.length-1,i)},o=function(t,e){var i,n;return null==e&&(e=r),i=t.pop(),t.length?(n=t[0],t[0]=i,g(t,0,e)):n=i,n},u=function(t,e,i){var n;return null==i&&(i=r),n=t[0],t[0]=e,g(t,0,i),n},a=function(t,e,i){var n;return null==i&&(i=r),t.length&&i(t[0],e)<0&&(n=[t[0],e],e=n[0],t[0]=n[1],g(t,0,i)),e},n=function(t,e){var n,o,s,a,u,h;for(null==e&&(e=r),a=function(){h=[];for(var e=0,r=i(t.length/2);r>=0?r>e:e>r;r>=0?e++:e--)h.push(e);return h}.apply(this).reverse(),u=[],o=0,s=a.length;s>o;o++)n=a[o],u.push(g(t,n,e));return u},f=function(t,e,i){var n;return null==i&&(i=r),n=t.indexOf(e),-1!==n?(d(t,0,n,i),g(t,n,i)):void 0},p=function(t,e,i){var o,s,u,h,l;if(null==i&&(i=r),s=t.slice(0,e),!s.length)return s;for(n(s,i),l=t.slice(e),u=0,h=l.length;h>u;u++)o=l[u],a(s,o,i);return s.sort(i).reverse()},c=function(t,e,i){var s,a,u,p,c,f,d,g,b,y;if(null==i&&(i=r),10*e<=t.length){if(p=t.slice(0,e).sort(i),!p.length)return p;for(u=p[p.length-1],g=t.slice(e),c=0,d=g.length;d>c;c++)s=g[c],i(s,u)<0&&(h(p,s,0,null,i),p.pop(),u=p[p.length-1]);return p}for(n(t,i),y=[],a=f=0,b=l(e,t.length);b>=0?b>f:f>b;a=b>=0?++f:--f)y.push(o(t,i));return y},d=function(t,e,i,n){var o,s,a;for(null==n&&(n=r),o=t[i];i>e&&(a=i-1>>1,s=t[a],n(o,s)<0);)t[i]=s,i=a;return t[i]=o},g=function(t,e,i){var n,o,s,a,u;for(null==i&&(i=r),o=t.length,u=e,s=t[e],n=2*e+1;o>n;)a=n+1,o>a&&!(i(t[n],t[a])<0)&&(n=a),t[e]=t[n],e=n,n=2*e+1;return t[e]=s,d(t,u,e,i)},t=function(){function t(t){this.cmp=null!=t?t:r,this.nodes=[]}return t.push=s,t.pop=o,t.replace=u,t.pushpop=a,t.heapify=n,t.nlargest=p,t.nsmallest=c,t.prototype.push=function(t){return s(this.nodes,t,this.cmp)},t.prototype.pop=function(){return o(this.nodes,this.cmp)},t.prototype.peek=function(){return this.nodes[0]},t.prototype.contains=function(t){return-1!==this.nodes.indexOf(t)},t.prototype.replace=function(t){return u(this.nodes,t,this.cmp)},t.prototype.pushpop=function(t){return a(this.nodes,t,this.cmp)},t.prototype.heapify=function(){return n(this.nodes,this.cmp)},t.prototype.updateItem=function(t){return f(this.nodes,t,this.cmp)},t.prototype.clear=function(){return this.nodes=[]},t.prototype.empty=function(){return 0===this.nodes.length},t.prototype.size=function(){return this.nodes.length},t.prototype.clone=function(){var e;return e=new t,e.nodes=this.nodes.slice(0),e},t.prototype.toArray=function(){return this.nodes.slice(0)},t.prototype.insert=t.prototype.push,t.prototype.remove=t.prototype.pop,t.prototype.top=t.prototype.peek,t.prototype.front=t.prototype.peek,t.prototype.has=t.prototype.contains,t.prototype.copy=t.prototype.clone,t}(),("undefined"!=typeof e&&null!==e?e.exports:void 0)?e.exports=t:window.Heap=t}.call(this)},{}],3:[function(t,e){function r(t,e,r){this.width=t,this.height=e,this.nodes=this._buildNodes(t,e,r)}var i=t("./Node");r.prototype._buildNodes=function(t,e,r){var n,o,s=new Array(e);for(n=0;e>n;++n)for(s[n]=new Array(t),o=0;t>o;++o)s[n][o]=new i(o,n);if(void 0===r)return s;if(r.length!==e||r[0].length!==t)throw new Error("Matrix size does not fit");for(n=0;e>n;++n)for(o=0;t>o;++o)r[n][o]&&(s[n][o].walkable=!1);return s},r.prototype.getNodeAt=function(t,e){return this.nodes[e][t]},r.prototype.isWalkableAt=function(t,e){return this.isInside(t,e)&&this.nodes[e][t].walkable},r.prototype.isInside=function(t,e){return t>=0&&t<this.width&&e>=0&&e<this.height},r.prototype.setWalkableAt=function(t,e,r){this.nodes[e][t].walkable=r},r.prototype.getNeighbors=function(t,e,r){var i=t.x,n=t.y,o=[],s=!1,a=!1,u=!1,h=!1,l=!1,p=!1,c=!1,f=!1,d=this.nodes;return this.isWalkableAt(i,n-1)&&(o.push(d[n-1][i]),s=!0),this.isWalkableAt(i+1,n)&&(o.push(d[n][i+1]),u=!0),this.isWalkableAt(i,n+1)&&(o.push(d[n+1][i]),l=!0),this.isWalkableAt(i-1,n)&&(o.push(d[n][i-1]),c=!0),e?(r?(a=c&&s,h=s&&u,p=u&&l,f=l&&c):(a=c||s,h=s||u,p=u||l,f=l||c),a&&this.isWalkableAt(i-1,n-1)&&o.push(d[n-1][i-1]),h&&this.isWalkableAt(i+1,n-1)&&o.push(d[n-1][i+1]),p&&this.isWalkableAt(i+1,n+1)&&o.push(d[n+1][i+1]),f&&this.isWalkableAt(i-1,n+1)&&o.push(d[n+1][i-1]),o):o},r.prototype.clone=function(){var t,e,n=this.width,o=this.height,s=this.nodes,a=new r(n,o),u=new Array(o);for(t=0;o>t;++t)for(u[t]=new Array(n),e=0;n>e;++e)u[t][e]=new i(e,t,s[t][e].walkable);return a.nodes=u,a},e.exports=r},{"./Node":5}],4:[function(t,e){e.exports={manhattan:function(t,e){return t+e},euclidean:function(t,e){return Math.sqrt(t*t+e*e)},octile:function(t,e){var r=Math.SQRT2-1;return e>t?r*t+e:r*e+t},chebyshev:function(t,e){return Math.max(t,e)}}},{}],5:[function(t,e){function r(t,e,r){this.x=t,this.y=e,this.walkable=void 0===r?!0:r}e.exports=r},{}],6:[function(t,e,r){function i(t){for(var e=[[t.x,t.y]];t.parent;)t=t.parent,e.push([t.x,t.y]);return e.reverse()}function n(t,e){var r=i(t),n=i(e);return r.concat(n.reverse())}function o(t){var e,r,i,n,o,s=0;for(e=1;e<t.length;++e)r=t[e-1],i=t[e],n=r[0]-i[0],o=r[1]-i[1],s+=Math.sqrt(n*n+o*o);return s}function s(t,e,r,i){var n,o,s,a,u,h,l=Math.abs,p=[];for(s=l(r-t),a=l(i-e),n=r>t?1:-1,o=i>e?1:-1,u=s-a;;){if(p.push([t,e]),t===r&&e===i)break;h=2*u,h>-a&&(u-=a,t+=n),s>h&&(u+=s,e+=o)}return p}function a(t){var e,r,i,n,o,a,u=[],h=t.length;if(2>h)return u;for(o=0;h-1>o;++o)for(e=t[o],r=t[o+1],i=s(e[0],e[1],r[0],r[1]),n=i.length,a=0;n-1>a;++a)u.push(i[a]);return u.push(t[h-1]),u}function u(t,e){var r,i,n,o,a,u,h,l,p,c,f,d=e.length,g=e[0][0],b=e[0][1],y=e[d-1][0],A=e[d-1][1];for(r=g,i=b,a=[[r,i]],u=2;d>u;++u){for(l=e[u],n=l[0],o=l[1],p=s(r,i,n,o),f=!1,h=1;h<p.length;++h)if(c=p[h],!t.isWalkableAt(c[0],c[1])){f=!0;break}f&&(lastValidCoord=e[u-1],a.push(lastValidCoord),r=lastValidCoord[0],i=lastValidCoord[1])}return a.push([y,A]),a}function h(t){if(t.length<3)return t;var e,r,i,n,o,s,a=[],u=t[0][0],h=t[0][1],l=t[1][0],p=t[1][1],c=l-u,f=p-h;for(o=Math.sqrt(c*c+f*f),c/=o,f/=o,a.push([u,h]),s=2;s<t.length;s++)e=l,r=p,i=c,n=f,l=t[s][0],p=t[s][1],c=l-e,f=p-r,o=Math.sqrt(c*c+f*f),c/=o,f/=o,(c!==i||f!==n)&&a.push([e,r]);return a.push([l,p]),a}r.backtrace=i,r.biBacktrace=n,r.pathLength=o,r.interpolate=s,r.expandPath=a,r.smoothenPath=u,r.compressPath=h},{}],7:[function(t,e){function r(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.heuristic=t.heuristic||o.manhattan,this.weight=t.weight||1}var i=t("heap"),n=t("../core/Util"),o=t("../core/Heuristic");r.prototype.findPath=function(t,e,r,o,s){var a,u,h,l,p,c,f,d,g=new i(function(t,e){return t.f-e.f}),b=s.getNodeAt(t,e),y=s.getNodeAt(r,o),A=this.heuristic,k=this.allowDiagonal,m=this.dontCrossCorners,v=this.weight,w=Math.abs,x=Math.SQRT2;for(b.g=0,b.f=0,g.push(b),b.opened=!0;!g.empty();){if(a=g.pop(),a.closed=!0,a===y)return n.backtrace(y);for(u=s.getNeighbors(a,k,m),l=0,p=u.length;p>l;++l)h=u[l],h.closed||(c=h.x,f=h.y,d=a.g+(0===c-a.x||0===f-a.y?1:x),(!h.opened||d<h.g)&&(h.g=d,h.h=h.h||v*A(w(c-r),w(f-o)),h.f=h.g+h.h,h.parent=a,h.opened?g.updateItem(h):(g.push(h),h.opened=!0)))}return[]},e.exports=r},{"../core/Heuristic":4,"../core/Util":6,heap:1}],8:[function(t,e){function r(t){i.call(this,t);var e=this.heuristic;this.heuristic=function(t,r){return 1e6*e(t,r)}}var i=t("./AStarFinder");r.prototype=new i,r.prototype.constructor=r,e.exports=r},{"./AStarFinder":7}],9:[function(t,e){function r(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.heuristic=t.heuristic||o.manhattan,this.weight=t.weight||1}var i=t("heap"),n=t("../core/Util"),o=t("../core/Heuristic");r.prototype.findPath=function(t,e,r,o,s){var a,u,h,l,p,c,f,d,g=function(t,e){return t.f-e.f},b=new i(g),y=new i(g),A=s.getNodeAt(t,e),k=s.getNodeAt(r,o),m=this.heuristic,v=this.allowDiagonal,w=this.dontCrossCorners,x=this.weight,F=Math.abs,W=Math.SQRT2,N=1,C=2;for(A.g=0,A.f=0,b.push(A),A.opened=N,k.g=0,k.f=0,y.push(k),k.opened=C;!b.empty()&&!y.empty();){for(a=b.pop(),a.closed=!0,u=s.getNeighbors(a,v,w),l=0,p=u.length;p>l;++l)if(h=u[l],!h.closed){if(h.opened===C)return n.biBacktrace(a,h);c=h.x,f=h.y,d=a.g+(0===c-a.x||0===f-a.y?1:W),(!h.opened||d<h.g)&&(h.g=d,h.h=h.h||x*m(F(c-r),F(f-o)),h.f=h.g+h.h,h.parent=a,h.opened?b.updateItem(h):(b.push(h),h.opened=N))}for(a=y.pop(),a.closed=!0,u=s.getNeighbors(a,v,w),l=0,p=u.length;p>l;++l)if(h=u[l],!h.closed){if(h.opened===N)return n.biBacktrace(h,a);c=h.x,f=h.y,d=a.g+(0===c-a.x||0===f-a.y?1:W),(!h.opened||d<h.g)&&(h.g=d,h.h=h.h||x*m(F(c-t),F(f-e)),h.f=h.g+h.h,h.parent=a,h.opened?y.updateItem(h):(y.push(h),h.opened=C))}}return[]},e.exports=r},{"../core/Heuristic":4,"../core/Util":6,heap:1}],10:[function(t,e){function r(t){i.call(this,t);var e=this.heuristic;this.heuristic=function(t,r){return 1e6*e(t,r)}}var i=t("./BiAStarFinder");r.prototype=new i,r.prototype.constructor=r,e.exports=r},{"./BiAStarFinder":9}],11:[function(t,e){function r(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners}var i=t("../core/Util");r.prototype.findPath=function(t,e,r,n,o){var s,a,u,h,l,p=o.getNodeAt(t,e),c=o.getNodeAt(r,n),f=[],d=[],g=this.allowDiagonal,b=this.dontCrossCorners,y=0,A=1;for(f.push(p),p.opened=!0,p.by=y,d.push(c),c.opened=!0,c.by=A;f.length&&d.length;){for(u=f.shift(),u.closed=!0,s=o.getNeighbors(u,g,b),h=0,l=s.length;l>h;++h)if(a=s[h],!a.closed)if(a.opened){if(a.by===A)return i.biBacktrace(u,a)}else f.push(a),a.parent=u,a.opened=!0,a.by=y;for(u=d.shift(),u.closed=!0,s=o.getNeighbors(u,g,b),h=0,l=s.length;l>h;++h)if(a=s[h],!a.closed)if(a.opened){if(a.by===y)return i.biBacktrace(a,u)}else d.push(a),a.parent=u,a.opened=!0,a.by=A}return[]},e.exports=r},{"../core/Util":6}],12:[function(t,e){function r(t){i.call(this,t),this.heuristic=function(){return 0}}var i=t("./BiAStarFinder");r.prototype=new i,r.prototype.constructor=r,e.exports=r},{"./BiAStarFinder":9}],13:[function(t,e){function r(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners}var i=t("../core/Util");r.prototype.findPath=function(t,e,r,n,o){var s,a,u,h,l,p=[],c=this.allowDiagonal,f=this.dontCrossCorners,d=o.getNodeAt(t,e),g=o.getNodeAt(r,n);for(p.push(d),d.opened=!0;p.length;){if(u=p.shift(),u.closed=!0,u===g)return i.backtrace(g);for(s=o.getNeighbors(u,c,f),h=0,l=s.length;l>h;++h)a=s[h],a.closed||a.opened||(p.push(a),a.opened=!0,a.parent=u)}return[]},e.exports=r},{"../core/Util":6}],14:[function(t,e){function r(t){i.call(this,t),this.heuristic=function(){return 0}}var i=t("./AStarFinder");r.prototype=new i,r.prototype.constructor=r,e.exports=r},{"./AStarFinder":7}],15:[function(t,e){function r(t){t=t||{},this.allowDiagonal=t.allowDiagonal,this.dontCrossCorners=t.dontCrossCorners,this.heuristic=t.heuristic||i.manhattan,this.weight=t.weight||1,this.trackRecursion=t.trackRecursion||!1,this.timeLimit=t.timeLimit||1/0}t("../core/Util");var i=t("../core/Heuristic"),n=t("../core/Node");r.prototype.findPath=function(t,e,r,i,o){var s,a,u,h=0,l=(new Date).getTime(),p=function(t,e){return this.heuristic(Math.abs(e.x-t.x),Math.abs(e.y-t.y))}.bind(this),c=function(t,e){return t.x===e.x||t.y===e.y?1:Math.SQRT2},f=function(t,e,r,i,s){if(h++,this.timeLimit>0&&(new Date).getTime()-l>1e3*this.timeLimit)return 1/0;var a=e+p(t,g)*this.weight;if(a>r)return a;if(t==g)return i[s]=[t.x,t.y],t;var u,d,b,y,A=o.getNeighbors(t,this.allowDiagonal,this.dontCrossCorners);for(b=0,u=1/0;y=A[b];++b){if(this.trackRecursion&&(y.retainCount=y.retainCount+1||1,y.tested!==!0&&(y.tested=!0)),d=f(y,e+c(t,y),r,i,s+1),d instanceof n)return i[s]=[t.x,t.y],d;this.trackRecursion&&0===--y.retainCount&&(y.tested=!1),u>d&&(u=d)}return u}.bind(this),d=o.getNodeAt(t,e),g=o.getNodeAt(r,i),b=p(d,g);for(s=0;!0;++s){if(a=[],u=f(d,0,b,a,0),1/0===u)return[];if(u instanceof n)return a;b=u}return[]},e.exports=r},{"../core/Heuristic":4,"../core/Node":5,"../core/Util":6}],16:[function(t,e){function r(t){t=t||{},this.heuristic=t.heuristic||o.manhattan,this.trackJumpRecursion=t.trackJumpRecursion||!1}var i=t("heap"),n=t("../core/Util"),o=t("../core/Heuristic");r.prototype.findPath=function(t,e,r,o,s){var a,u=this.openList=new i(function(t,e){return t.f-e.f}),h=this.startNode=s.getNodeAt(t,e),l=this.endNode=s.getNodeAt(r,o);for(this.grid=s,h.g=0,h.f=0,u.push(h),h.opened=!0;!u.empty();){if(a=u.pop(),a.closed=!0,a===l)return n.expandPath(n.backtrace(l));this._identifySuccessors(a)}return[]},r.prototype._identifySuccessors=function(t){var e,r,i,n,s,a,u,h,l,p,c=this.grid,f=this.heuristic,d=this.openList,g=this.endNode.x,b=this.endNode.y,y=t.x,A=t.y,k=Math.abs;for(Math.max,e=this._findNeighbors(t),n=0,s=e.length;s>n;++n)if(r=e[n],i=this._jump(r[0],r[1],y,A)){if(a=i[0],u=i[1],p=c.getNodeAt(a,u),p.closed)continue;h=o.octile(k(a-y),k(u-A)),l=t.g+h,(!p.opened||l<p.g)&&(p.g=l,p.h=p.h||f(k(a-g),k(u-b)),p.f=p.g+p.h,p.parent=t,p.opened?d.updateItem(p):(d.push(p),p.opened=!0))}},r.prototype._jump=function(t,e,r,i){var n=this.grid,o=t-r,s=e-i;if(!n.isWalkableAt(t,e))return null;if(this.trackJumpRecursion===!0&&(n.getNodeAt(t,e).tested=!0),n.getNodeAt(t,e)===this.endNode)return[t,e];if(0!==o&&0!==s){if(n.isWalkableAt(t-o,e+s)&&!n.isWalkableAt(t-o,e)||n.isWalkableAt(t+o,e-s)&&!n.isWalkableAt(t,e-s))return[t,e]}else if(0!==o){if(n.isWalkableAt(t+o,e+1)&&!n.isWalkableAt(t,e+1)||n.isWalkableAt(t+o,e-1)&&!n.isWalkableAt(t,e-1))return[t,e]}else if(n.isWalkableAt(t+1,e+s)&&!n.isWalkableAt(t+1,e)||n.isWalkableAt(t-1,e+s)&&!n.isWalkableAt(t-1,e))return[t,e];return 0!==o&&0!==s&&(this._jump(t+o,e,t,e)||this._jump(t,e+s,t,e))?[t,e]:n.isWalkableAt(t+o,e)||n.isWalkableAt(t,e+s)?this._jump(t+o,e+s,t,e):null},r.prototype._findNeighbors=function(t){var e,r,i,n,o,s,a,u,h=t.parent,l=t.x,p=t.y,c=this.grid,f=[];if(h)e=h.x,r=h.y,i=(l-e)/Math.max(Math.abs(l-e),1),n=(p-r)/Math.max(Math.abs(p-r),1),0!==i&&0!==n?(c.isWalkableAt(l,p+n)&&f.push([l,p+n]),c.isWalkableAt(l+i,p)&&f.push([l+i,pÛ]:÷Ûh‘éì¶»§q«^tYˆ
›Ý˜›ÝY™[œÙT[›™Y]ˆ	‰ˆ›Ý˜›ÝY™[œÙT[›™Y]H[Y\Ý[\
HÂˆÛÛœÝ[›™Y\™Ù]H›ÛÛKœ^Y\œË™Ù]
›Ý˜›ÝY™[œÙU\™Ù]Y
NÂˆÛÛœÝØ[”™XXÝH[›™Y\™Ù]	‰ˆ[›™Y\™Ù]˜[]™H	‰ˆ\[›™Y\™Ù]™Z™XÝY	‰‚ˆ\Ý[˜ÙJ›Ý[›™Y\™Ù]
HH›ÛÛKœÙ][™ÜËšÚ[˜[™ÙH
ˆKŒÍNÂˆÛÛœÝÚ[™H›Ý˜›ÝY™[œÙRÚ[™Âˆ›Ý˜›ÝY™[œÙT[›™Y]HÂˆ›Ý˜›ÝY™[œÙRÚ[™HˆŽÂˆ›Ý˜›ÝY™[œÙU\™Ù]YHˆŽÂˆYˆ
XØ[”™XXÝ
H™]\›ŽÂˆËÈH›Ý™YXÝÈ[™Ù\ˆœ›ÛH›Þ[Z]H[Û™Kˆ]]\ÝÛÛY][Y\ÈZ\Ü™XYˆËÈ]ÝYH[œÝXYÙˆ\›š[™È]™\žH™X\˜žH]XÚÈ[ÈHÝX\˜[YYÛÝ[\‹‚ˆYˆ
X]œ˜[™ÛJ
HŒÎ
H™]\›ŽÂˆžHÂˆYˆ
Ú[™OOH™ÙÙHŠHXÝ]˜]QÙÙJ›ÛÛK›Ý
NÂˆHØ]ÚßBˆ™]\›ŽÂˆB‚ˆYˆ
[Y\Ý[\
›Ý›™^›ÝY™[œÙQXÚ\Ú[Û]
JH™]\›ŽÂˆ›Ý›™^›ÝY™[œÙQXÚ\Ú[Û]H[Y\Ý[\
ÈŒ
ÈX]™›ÛÜŠX]œ˜[™ÛJ
H
ˆL
NÂˆYˆ
[™X\˜žP]XÚÙ\ˆ\Ý[˜ÙJ›Ý™X\˜žP]XÚÙ\ŠHˆ›ÛÛKœÙ][™ÜËšÚ[˜[™ÙH
ˆKŒÍJH™]\›ŽÂˆYˆ
X]œ˜[™ÛJ
HHŒMŠH™]\›ŽÂ‚ˆÛÛœÝØ[‘ÙÙHH›Ý™ÙÙT™XYP]H[Y\Ý[\ÂˆÛÛœÝÚ[™HØ[‘ÙÙHÈ™ÙÙHˆˆˆŽÂˆYˆ
ZÚ[™
H™]\›ŽÂˆ›Ý˜›ÝY™[œÙRÚ[™HÚ[™Âˆ›Ý˜›ÝY™[œÙU\™Ù]YH™X\˜žP]XÚÙ\‹šYÂˆ›Ý˜›ÝY™[œÙT[›™Y]H[Y\Ý[\
ÈL
ÈX]™›ÛÜŠX]œ˜[™ÛJ
H
ˆL
NÂŸB‚™[˜Ý[ÛˆÙ[XÝ›ÝÝ[›™\•ÙX\ÛŠ›Ý\™Ù]\Ý[˜ÙJHÂˆYˆ
X›Ý™Ý[›™\[[[È\[Ùˆ›Ý™Ý[›™\[[[ÈOOH›Øš™XÝŠH›Ý™Ý[›™\[[[ÈHÜ™X]QÝ[›™\[[[Ê
NÂˆYˆ
›Ý™Ý[‘š\š[™È	‰ˆÕS“‘T—ÕÑPTÓ”ÖØ›Ý™Ý[‘š\š[™ÕÙX\Û—JH™]\›ˆÕS“‘T—ÕÑPTÓ”ÖØ›Ý™Ý[‘š\š[™ÕÙX\Û—NÂˆÛÛœÝ™Y™\œ™YH\™Ù]\Ý[˜ÙHˆÌˆÈÈœÛš\\ˆ‹˜\ÜØ][‹š[™Ý[ˆ‹œÛYÈ‹\Ù\ˆ—Bˆˆ\™Ù]\Ý[˜ÙHˆÌˆÈÈ˜\ÜØ][‹œÛš\\ˆ‹š[™Ý[ˆ‹œÛYÈ‹\Ù\ˆ—Bˆˆ\™Ù]\Ý[˜ÙHŒˆÈÈœÛYÈ‹\Ù\ˆ‹š[™Ý[ˆ‹˜\ÜØ][‹œÛš\\ˆ—BˆˆÈš[™Ý[ˆ‹\Ù\ˆ‹œÛYÈ‹˜\ÜØ][‹œÛš\\ˆ—NÂˆÛÛœÝÙX\Û’YH™Y™\œ™Y™š[™

Y
HOˆÂˆÛÛœÝÙX\ÛˆHÕS“‘T—ÕÑPTÓ”ÖÚYNÂˆ™]\›ˆ\™Ù]\Ý[˜ÙHHÙX\Û‹œ˜[™ÙH	‰ˆ
[X™\Š›Ý™Ý[›™\[[[ÖÚYJH
HHÙX\Û‹˜[[[Ô\”ÚÝÂˆJNÂˆYˆ
]ÙX\Û’Y
H™]\›ˆ[Âˆ›Ý™Ý[›™\•ÙX\ÛˆHÙX\Û’YÂˆ™]\›ˆÕS“‘T—ÕÑPTÓ”ÖÝÙX\Û’YNÂŸB‚™[˜Ý[Ûˆ[ÜQÜ˜]š]TØÜš\
›ÛÛK›Ý[Y\Ý[\
HÂˆÛÛœÝÝ]HH›ÛÛKœÛÛÓZ\ÜÚ[ÛŽÂˆYˆ
\Ý]HÝ]KšYOOH˜ÜKYÜ˜]š]HˆÝ]K˜ÜP›ÝYOOH›ÝšYX›Ý˜[]™H›Ý™Z™XÝY
H™]\›ˆ˜[ÙNÂˆ›ÝžHÂˆ›ÝžHHÂˆ›Ý›[Ý™[Y[[ÙHHšYHŽÂˆYˆ
›Ý›YY]][™Õ[[ˆ[Y\Ý[\
H™]\›ˆYNÂˆžHÂˆYˆ
Ý]K˜ÜT\ÙHOOH˜XØÙ[\˜]KLHˆÝ]K˜ÜT\ÙHOOH˜XØÙ[\˜]KLˆŠHÂˆÙÙÛQÜ˜]š]U[YJ›ÛÛK›Ý˜XØÙ[\˜]H‹›ÝšY
NÂˆÝ]K˜ÜT™[šÚPÛÝ[HÂˆÝ]K˜ÜT\ÙHHÝ]K˜ÜT\ÙHOOH˜XØÙ[\˜]KLHˆÈœ™[šÚKLHˆˆœ™[šÚKLˆŽÂˆ™]\›ˆYNÂˆBˆYˆ
Ý]K˜ÜT\ÙHOOHœ™[šÚKLHˆÝ]K˜ÜT\ÙHOOHœ™[šÚKLˆŠHÂˆYˆ
Ý]K˜ÜT™[šÚPÛÝ[
HÂˆ˜XÝXÙT™[šÚJ›ÛÛK›Ý
NÂˆÝ]K˜ÜT™[šÚPÛÝ[
ÏHNÂˆH[ÙHÂˆÝ]K˜ÜT\ÙHHÝ]K˜ÜT\ÙHOOHœ™[šÚKLHˆÈ˜XØÙ[\˜]KLˆˆˆšX\ŽÂˆBˆ™]\›ˆYNÂˆBˆYˆ
Ý]K˜ÜT\ÙHOOHšX\ŠHÂˆÛÛœÝ\™Ù]HË‹‹œ›ÛÛKœ^Y\œË˜[Y\Ê
WK™š[™

Ø[™Y]JHOˆØ[™Y]Kœ›ÛHOOH™Y™[™\ˆˆ	‰ˆØ[™Y]K˜[]™H	‰ˆXØ[™Y]K™Z™XÝY
NÂˆYˆ
]\™Ù]
H™]\›ˆYNÂˆYˆ

[X™\Š›Ý›X[˜JH
HPT•ÕSTÔ•ÓPSWÐÓÔÕ
HÂˆÝ]K˜ÜT\ÙHH˜XØÙ[\˜]KLHŽÂˆÝ]K˜ÜT™[šÚPÛÝ[HÂˆ™]\›ˆYNÂˆBˆ[\Ü^Y\Š›ÛÛK›Ý[™Yš[™Y[™Yš[™Y\™Ù]šYšX\ŠNÂˆYˆ
›ÛÛKœ\ÙHOOHœ^Z[™Èˆ	‰ˆX[]™T^Y\œÊ›ÛÛK™Y™[™\ˆŠK›[™Ý
HÚXÚÕÚ[Š›ÛÛJNÂˆ™]\›ˆYNÂˆBˆHØ]ÚÂˆÝ]K˜ÜT\ÙHH˜XØÙ[\˜]KLHŽÂˆÝ]K˜ÜT™[šÚPÛÝ[HÂˆBˆ™]\›ˆYNÂŸB‚™[˜Ý[Ûˆ[ÜTÝYÙL”ØÜš\
›ÛÛK›Ý[Y\Ý[\
HÂˆÛÛœÝÝ]HH›ÛÛKœÛÛÓZ\ÜÚ[ÛŽÂˆYˆ
\Ý]HÝ]KšYOOH˜ÜK\ÝYÙLˆˆÝ]K˜ÜP›ÝYOOH›ÝšYX›Ý˜[]™H›Ý™Z™XÝY
H™]\›ˆ˜[ÙNÂˆÛÛœÝ\™Ù]HË‹‹œ›ÛÛKœ^Y\œË˜[Y\Ê
WBˆ™š[\Š
Ø[™Y]JHOˆØ[™Y]Kœ›ÛHOOH™Y™[™\ˆˆ	‰ˆØ[™Y]K˜[]™H	‰ˆXØ[™Y]K™Z™XÝY
BˆœÛÜ

KŠHOˆ\Ý[˜ÙJ›ÝJHH\Ý[˜ÙJ›ÝŠJVÌNÂˆYˆ
]\™Ù]
H™]\›ˆYNÂˆYˆ

[X™\Š›ÝšX™PÛÙ[™Ô™XYP]
H
Hˆ[Y\Ý[\]˜Z[X›TÝ[Z[˜J›Ý
HŠH™]\›ˆ˜[ÙNÂˆ›ÝžHÂˆ›ÝžHHÂˆ›Ý›[Ý™[Y[[ÙHHšYHŽÂˆžHÂˆ\ÙP[Ú[^J›ÛÛK›ÝšXÚËZY[]H‹\™Ù]šY
NÂˆ™]\›ˆYNÂˆHØ]ÚÂˆ™]\›ˆ˜[ÙNÂˆBŸB‚™[˜Ý[ÛˆÝÜ›Ý›Ü’[\˜XÝ[ÛŠ›Ý[Y\Ý[\H›ÝÊ
JHÂˆ›ÝžHÂˆ›ÝžHHÂˆ›Ý›[Ý™[Y[[ÙHHšYHŽÂˆ›Ý›\Ý[Ý™P]H[Y\Ý[\ÂˆÛX\”ÝÜ™Y[Ý™[Y[[œ]
›Ý[Y\Ý[\
NÂŸB‚™[˜Ý[Ûˆ[‘œšY[™QY™[™\”]›Û
›ÛÛK›ÝX\
HÂˆYˆ
›Ýœ›ÛHOOH™Y™[™\ˆˆ›Ý\Ñ[™[^SÙ”ÛÛR[X[Š›ÛÛK›Ý
JH™]\›ˆ˜[ÙNÂˆÛÛœÝ›ÛÛPÙ[\œÈHË‹‹ŠX\œ›ÛÛ\È×JK‹‹ŠX\˜ÛÜœšYÜœÈ×JWK›X\

™XÝ[™^
HOˆ
ÂˆYˆ]›ÛX\™XKIÜ™XÝšY[™^Xˆˆ[X™\Š™XÝž
H
È[X™\Š™XÝÊHÈ‹ˆNˆ[X™\Š™XÝžJH
È[X™\Š™XÝš
HÈ‚ˆJJNÂˆÛÛœÝ]›ÛÚ[ÈHÂˆ‹‹ŠX\›Øš™XÝÈ×JKˆ‹‹ŠX\œÝ][ÛœÈ×JKˆ‹‹ŠX\œÜ]ÛœÈ×JKˆ‹‹œ›ÛÛPÙ[\œÂˆK™š[\Š
Ú[
HOˆ[X™\‹š\Ñš[š]JÚ[Ëž
H	‰ˆ[X™\‹š\Ñš[š]JÚ[ËžJH	‰‚ˆ\ÕØ[ØX›J›ÛÛK[X™\ŠÚ[ž
K[X™\ŠÚ[žJKX\œ^Y\”˜Y]\ÊJNÂˆYˆ
\]›ÛÚ[Ë›[™Ý
H™]\›ˆYNÂˆ›Üˆ
]][\HÈ][\X]›Z[Š‹]›ÛÚ[Ë›[™Ý
NÈ][\
ÏHJHÂˆ]\™Ù]H]›ÛÚ[Ë™š[™

Ú[
HOˆÚ[šYOOH›Ý˜›Ý]›Û\™Ù]Y
NÂˆYˆ
]\™Ù]\Ý[˜ÙJ›Ý\™Ù]
HHX]›X^
ÌX\\ÚÔ˜[™ÙH
ˆMJJHÂˆÛÛœÝ[\›˜]]™\ÈH]›ÛÚ[Ë™š[\Š
Ú[
HOˆÚ[šYOOH›Ý˜›Ý]›Û\™Ù]Y
NÂˆ\™Ù]H[\›˜]]™\ÖÓX]™›ÛÜŠX]œ˜[™ÛJ
H
ˆ[\›˜]]™\Ë›[™Ý
WH]›ÛÚ[ÖÌNÂˆ›Ý˜›Ý]›Û\™Ù]YH\™Ù]šY	ÓX]œ›Ý[™
\™Ù]ž
_N‰ÓX]œ›Ý[™
\™Ù]žJ_XÂˆBˆYˆ
[Ý™P›ÝÝØ\™
›ÛÛK›Ý\™Ù]
JHÂˆ›Ý˜›Ý]›Û]˜Z[\™\ÈHÂˆ™]\›ˆYNÂˆBˆ›Ý˜›Ý]›Û\™Ù]YHˆŽÂˆ›Ý›˜]”]H×NÂˆ›Ý›˜]Ø[Ý[]Y]HÂˆBˆ›Ý˜›Ý]›Û]˜Z[\™\ÈH
[X™\Š›Ý˜›Ý]›Û]˜Z[\™\ÊH
H
ÈNÂˆÝÜ›Ý›Ü’[\˜XÝ[ÛŠ›Ý
NÂˆ™]\›ˆYNÂŸB‚™[˜Ý[Ûˆ[”^Z[™Ð›ÝÊ›ÛÛJHÂˆÛÛœÝ[Y\Ý[\H›ÝÊ
NÂˆÛÛœÝX\HÙ]X\
›ÛÛJNÂˆ›Üˆ
ÛÛœÝ›ÝÙˆ›ÛÛKœ^Y\œË˜[Y\Ê
JHÂˆYˆ
X›Ýš\Ð›Ý›Ý™Z™XÝY›Ýš[•™[[Y\Ý[\›Ý›™^›ÝXÝ[Û]
HÛÛ[YNÂˆ›Ý›™^›ÝXÝ[Û]H[Y\Ý[\
È“ÕÕPÒ×ÓTÈHNÂ‚ˆYˆ
[ÜTÝYÙL”ØÜš\
›ÛÛK›Ý[Y\Ý[\
JHÛÛ[YNÂˆYˆ
[ÜQÜ˜]š]TØÜš\
›ÛÛK›Ý[Y\Ý[\
JHÛÛ[YNÂ‚ˆYˆ
›ÛÛKœÛÛÓZ\ÜÚ[ÛËšYOOH™[\ˆ	‰ˆ›Ý˜[]™JHÂˆ›ÝžHÂˆ›ÝžHHÂˆ›Ý›[Ý™[Y[[ÙHHšYHŽÂˆYˆ
›Ý™[\™XYP]H[Y\Ý[\
HÂˆžHÂˆXÝ]˜]Q[\
›ÛÛK›ÝX]™›ÛÜŠ[Y\Ý[\ÈÌ
H	HˆÈ›™YØ]]™HˆˆœÜÚ]]™HŠNÂˆ›Ý™[\™XYP]H[Y\Ý[\
ÈÌÂˆHØ]ÚßBˆBˆÛÛ[YNÂˆB‚ˆYˆ
[›Ý›ÙT™\Ü
›ÛÛK›Ý
JH™]\›ŽÂˆYˆ
›Ý˜[]™H	‰ˆ[›ÝÝ[™š\›T™][X][ÛŠ›ÛÛK›Ý[Y\Ý[\
JHÛÛ[YNÂ‚ˆYˆ
›Ý˜[]™H	‰ˆ™Yš[›ÝX[˜J›ÛÛK›Ý
JHÛÛ[YNÂ‚ˆYˆ
›Ýœ›ÛHOOH˜]XÚÙ\ˆˆ	‰ˆ›Ý˜[]™JHÂˆYˆ
›ÝœÜXÚX[OOH˜[Ú[Z\Ýˆ	‰ˆ[X™\Š›Ý›X[˜JHHUSÓSÓPSWÕ‘TÒÓ	‰ˆ
›ÝœÝ[Z[˜HPVÔÕSRSH›ÝœÝXœÝ]][ÛÚ\™Ù\ÈJJHÂˆžHÈ\ÙP[Ú[^J›ÛÛK›Ý›ÝœÝXœÝ]][ÛÚ\™Ù\ÈHÈœÝXœÝ]][ÛˆˆˆœÝ[Z[˜HŠNÈHØ]ÚßBˆBˆÛÛœÝ\™Ù]H™Y™\œ™YY™[™\•\™Ù]
›ÛÛK›Ý[Y\Ý[\
NÂˆYˆ
›Ý™Ý[‘š\š[™È	‰ˆ
]\™Ù]\Ý[˜ÙJ›Ý\™Ù]
HˆÝ[›™\•ÙX\Û‘›ÜŠ›Ý
Kœ˜[™ÙJJHÝÜÝ[›™\‘š\™J›ÛÛK›ÝÈ™X\ÛÛŽˆ¹kïº,hyeª¹i,HˆJNÂˆYˆ
\™Ù]	‰ˆ\Ý[˜ÙJ›Ý\™Ù]
HHSTÔS‘ÑH	‰ˆ›Ý™[\™XYP]H[Y\Ý[\	‰ˆX]œ˜[™ÛJ
HŒ
HÂˆžHÈXÝ]˜]Q[\
›ÛÛK›Ý
NÈHØ]ÚßBˆBˆÛÛœÝ\™Ù]\Ý[˜ÙHH\™Ù]È\Ý[˜ÙJ›Ý\™Ù]
Hˆ[™š[š]NÂˆÛÛœÝ›ÝÝ[›™\•ÙX\ÛˆH\™Ù]	‰ˆ›ÝœÜXÚX[OOH™Ý[›™\ˆ‚ˆÈÙ[XÝ›ÝÝ[›™\•ÙX\ÛŠ›Ý\™Ù]\Ý[˜ÙJBˆˆ[ÂˆYˆ
\™Ù]	‰ˆ›ÝœÜXÚX[OOH™Ý[›™\ˆˆ	‰ˆX›ÝÝ[›™\•ÙX\Ûˆ	‰ˆ›Ý™Ý[›™\”™[ØY[[H[Y\Ý[\
HÂˆžHÈ™[ØYÝ[›™\Š›ÛÛK›Ý
NÈHØ]ÚßBˆBˆYˆ
ˆ\™Ù]	‰‚ˆ›ÝœÜXÚX[OOH™Ý[›™\ˆˆ	‰‚ˆ›ÝÝ[›™\•ÙX\Ûˆ	‰‚ˆ›Ý™Ý[”™XYP]H[Y\Ý[\	‰‚ˆ\™Ù]\Ý[˜ÙHH›ÝÝ[›™\•ÙX\Û‹œ˜[™ÙH	‰‚ˆ


HOˆÂˆÛÛœÝH\™Ù]žH›ÝžÂˆÛÛœÝHH\™Ù]žHH›ÝžNÂˆÛÛœÝ[™ÝHX]š\Ý
JHNÂˆ™]\›ˆÛX\”ÚÝ]
›ÛÛK›Ý\™Ù]È[™ÝHÈ[™Ý
NÂˆJJ
Bˆ
HÂˆžHÂˆÚÛÝÝ[›™\Š›ÛÛK›Ý\™Ù]žH›Ýž\™Ù]žHH›ÝžJNÂˆHØ]ÚßBˆH[ÙHYˆ
ˆ\™Ù]	‰‚ˆ\Ý[˜ÙJ›Ý\™Ù]
HHX]›X^
Ì‹›ÛÛKœÙ][™ÜËšÚ[˜[™ÙH
ˆN
H	‰‚ˆ›ÝšÚ[™XYP]H[Y\Ý[\	‰‚ˆX›Ý˜]XÚÔ™\ÛÛ™P]ˆ
HÂˆžHÂˆÛÛœÝZ[YYH›Ý˜Z[U\™Ù]YÈ›ÛÛKœ^Y\œË™Ù]
›Ý˜Z[U\™Ù]Y
Hˆ[ÂˆYˆ
Z[YY	‰ˆZ[YY˜[]™H	‰ˆXZ[YY™Z™XÝY	‰ˆ\Ý[˜ÙJ›ÝZ[YY
HH›ÛÛKœÙ][™ÜËšÚ[˜[™ÙJHÂˆYˆ
›Ý˜Z[T™XYP]H[Y\Ý[\	‰ˆ›Ý˜Z[Q^\™\Ð]ˆ[Y\Ý[\
H\™›Ü›Sš[š]ÝP]XÚÊ›ÛÛK›ÝZ[YYšY
NÂˆH[ÙHYˆ
ˆX]š\Ý
[X™\Š\™Ù]ž
H[X™\Š\™Ù]žJH
HHŒH	‰‚ˆX]œ˜[™ÛJ
HŒ‚ˆ
HÂˆÝ\š[š]ÝJ›ÛÛK›Ý\™Ù]šY
NÂˆH[ÙHÂˆ]Y]YT]ZXÚÐ]XÚÊ›ÛÛK›Ý\™Ù]šY
NÂˆBˆHØ]ÚßBˆH[ÙHYˆ
\™Ù]
HÂˆ\ÙP›ÝØX›ÝYÙJ›ÛÛK›Ý[Y\Ý[\
NÂˆ[Ý™P›ÝÝØ\™
›ÛÛK›Ý\™Ù]
NÂˆH[ÙHÂˆ\ÙP›ÝØX›ÝYÙJ›ÛÛK›Ý[Y\Ý[\
NÂˆÛÛœÝ]›ÛHX\œÝ][ÛœÖÊX]™›ÛÜŠ[Y\Ý[\ÈL
H
È[X™\‹œ\œÙR[
›ÝšYœ™\XÙJ×ÙËˆŠHŒ‹L
JH	HX\œÝ][ÛœË›[™ÝNÂˆYˆ
]›Û
H[Ý™P›ÝÝØ\™
›ÛÛK›Ý]›Û
NÂˆBˆÛÛ[YNÂˆB‚ˆYˆ
›Ýœ›ÛHOOH™Y™[™\ˆˆ›Ý™Z™XÝY
HÛÛ[YNÂ‚ˆYˆ
›Ý˜[]™JHÂˆYˆ
›ÝœÜXÚX[OOH™›Ü˜Hˆ	‰ˆ
›Ý˜›ÙR]Èˆ›Ý›Ý™\šX[JH	‰ˆ›Ý™›Ü˜T™XYP]H[Y\Ý[\
HÂˆžHÈX[›Ü˜J›ÛÛK›Ý
NÈHØ]ÚßBˆBˆÛÛœÝ™X\˜žP]XÚÙ\ˆH›ÝÛ›ÝÛ]XÚÙ\‘]šY[˜ÙJ›ÛÛK›Ý[Y\Ý[\
NÂˆ[›ÝY™[œÙQXÚ\Ú[ÛŠ›ÛÛK›Ý™X\˜žP]XÚÙ\‹[Y\Ý[\
NÂˆB‚ˆYˆ
›ÛÛKœØX›ÝYÙH	‰ˆ›Ý˜[]™JHÂˆÛÛœÝÝ][ÛˆH™X\™\Ý™\Z\”Ý][ÛŠ›ÛÛK›Ý›ÛÛKœØX›ÝYÙK\JNÂˆYˆ
Ý][ÛŠHÂˆYˆ
\Ý[˜ÙJ›ÝÝ][ÛŠHHX\\ÚÔ˜[™ÙJHÂˆžHÂˆ™\Z\Š›ÛÛK›Ý
NÂˆHØ]ÚßBˆH[ÙHYˆ
][\Ü›ÝÝØ\™
›ÛÛK›ÝÝ][ÛŠJHÂˆ[Ý™P›ÝÝØ\™
›ÛÛK›ÝÝ][ÛŠNÂˆBˆÛÛ[YNÂˆBˆB‚ˆYˆ
[‘œšY[™QY™[™\”]›Û
›ÛÛK›ÝX\
JHÛÛ[YNÂ‚ˆÛÛœÝ[™[™ÈH›Ý\ÚÓ\Ý™š[\Š
][JHOˆZ][K™Û™JNÂˆÛÛœÝ[™[™ÑÝÛ›ØYÈH[™[™Ë™š[\Š
][JHOˆ][K\HOOH™ÝÛ›ØYŠNÂˆÛÛœÝØ[™Y]\ÈH[™[™ÑÝÛ›ØYË›[™ÝÈ[™[™ÑÝÛ›ØYÈˆ[™[™ÎÂˆ]\ÚÕ\™Ù]HØ[™Y]\Âˆ™š[\Š
\ÚÊHOˆ\ÚËšYOOH›Ý˜›Ý\ÚÕ\™Ù]Y
Bˆ›X\

\ÚÊHOˆ
È\ÚËÝ][ÛŽˆš[™Ý][ÛŠX\\ÚËœÝ][Û’Y
HJJBˆ™š[™

[žJHOˆ[žKœÝ][ÛŠNÂˆYˆ
]\ÚÕ\™Ù]
HÂˆ\ÚÕ\™Ù]HØ[™Y]\Âˆ›X\

\ÚÊHOˆ
È\ÚËÝ][ÛŽˆš[™Ý][ÛŠX\\ÚËœÝ][Û’Y
HJJBˆ™š[\Š
[žJHOˆ[žKœÝ][ÛŠBˆœÛÜ

KŠHOˆ\Ý[˜ÙJ›ÝKœÝ][ÛŠHH\Ý[˜ÙJ›Ý‹œÝ][ÛŠJVÌNÂˆ›Ý˜›Ý\ÚÕ\™Ù]YH\ÚÕ\™Ù]Ë\ÚËšYˆŽÂˆBˆYˆ
\ÚÕ\™Ù]
HÂˆÛÛœÝÈ\ÚËÝ][ÛˆHH\ÚÕ\™Ù]ÂˆYˆ
\Ý[˜ÙJ›ÝÝ][ÛŠHHX\\ÚÔ˜[™ÙJHÂˆÝÜ›Ý›Ü’[\˜XÝ[ÛŠ›Ý[Y\Ý[\
NÂˆYˆ
›Ý˜›Ý\ÚÕ\™Ù]YOOH\ÚËšYS[X™\Š›Ý˜›Ý\ÚÔ™\Ù[˜ÙTÚ[˜ÙJJHÂˆ›Ý˜›Ý\ÚÕ\™Ù]YH\ÚËšYÂˆ›Ý˜›Ý\ÚÔ™\Ù[˜ÙTÚ[˜ÙHH[Y\Ý[\ÂˆÛÛ[YNÂˆBˆÛÛœÝ™\]Z\™Y™\Ù[˜ÙS\ÈHX]›Z[ŠLUU×ÕTÒ×Ô‘TÑSÑWÓTÈÈY™™XÝ]™PXØÙ[\˜][Û“][\Y\Š›ÛÛK›Ý[Y\Ý[\
JNÂˆYˆ
[Y\Ý[\H[X™\Š›Ý˜›Ý\ÚÔ™\Ù[˜ÙTÚ[˜ÙJH™\]Z\™Y™\Ù[˜ÙS\È[X™\Š›Ý\ÚÐ]]Ô™XYP]
Hˆ[Y\Ý[\
HÛÛ[YNÂˆžHÂˆÛÛ\]U\ÚÊ›ÛÛK›Ý\ÚËšY
NÂˆ›Ý˜›Ý\ÚÕ\™Ù]YHˆŽÂˆ›Ý˜›Ý\ÚÔ™\Ù[˜ÙTÚ[˜ÙHHÂˆHØ]Ú
\œ›ÜŠHÂˆ›Ý˜›Ý\ÚÔ™\Ù[˜ÙTÚ[˜ÙHH[Y\Ý[\ÂˆYˆ
\œ›Üˆ[œÝ[˜Ù[Ùˆ\Q\œ›Üˆ	‰ˆ\œ›Ü‹œÝ]\ÈOOH
H›Ý˜›Ý\ÚÕ\™Ù]YHˆŽÂˆBˆH[ÙHYˆ
][\Ü›ÝÝØ\™
›ÛÛK›ÝÝ][ÛŠJHÂˆ›Ý˜›Ý\ÚÔ™\Ù[˜ÙTÚ[˜ÙHHÂˆ[Ý™P›ÝÝØ\™
›ÛÛK›ÝÝ][ÛŠNÂˆBˆH[ÙHÂˆ›Ý˜›Ý\ÚÕ\™Ù]YHˆŽÂˆ›Ý˜›Ý\ÚÔ™\Ù[˜ÙTÚ[˜ÙHHÂˆBˆBŸB‚™[˜Ý[Ûˆ™X\™\Ý™\Z\”Ý][ÛŠ›ÛÛK^Y\‹™\Z\•\JHÂˆÛÛœÝX\HÙ]X\
›ÛÛJNÂˆÛÛœÝÝ][ÛœÈHX\œÝ][ÛœË™š[\Š
Ý][ÛŠHOˆÝ][Û‹\HOOHœ™\Z\ˆˆ	‰ˆÝ][Û‹œ™\Z\ˆOOH™\Z\•\JNÂˆÛÛœÝ[œ™\Z\™YHÝ][ÛœË™š[\Š
Ý][ÛŠHOˆ\›ÛÛKœØX›ÝYÙOËœ™\Z\™YÚ[ÏË–ÜÝ][Û‹šYJNÂˆ™]\›ˆ
[œ™\Z\™Y›[™ÝÈ[œ™\Z\™YˆÝ][ÛœÊBˆœÛÜ

KŠHOˆ\Ý[˜ÙJ^Y\‹JHH\Ý[˜ÙJ^Y\‹ŠJVÌNÂŸB‚œÙ][\˜[
›ÝXÚË“ÕÕPÒ×ÓTÊNÂœÙ][\˜[
\Ú™X[[YTÝ]\Ë‘PSSQWÔÕUWÒS•T•SÓTÊNÂ‚”›ÛZ\ÙK˜[Ù]Y
ÚY˜]PÚXÚÜÚ[\˜Ú]™J
KY˜]T^Y\”›Ùš[\Ê
WJK™š[˜[J

HOˆÂˆÙ\™\‹›\Ý[ŠÔ•

HOˆÂˆÛÛœÛÛK›ÙÊY™[™\œÈœÈ]XÚÙ\œÈÙ\™\Žˆ‹ËÛØØ[ÜÝ‰ÔÔ•X
NÂˆJNÂŸJNÂ‚‚™[˜Ý[ÛˆÙ™›[™P\T™\]Y\Ý
]˜[YK›ÙHHßJHÂˆ™]\›ˆ™]È›ÛZ\ÙJ
™\ÛÛ™JHOˆÂˆÛÛœÝ^H”ÓÓ‹œÝš[™ÚYžJ›ÙHßJNÂˆ]Ý]\ÈHŒÂˆÛÛœÝ™\HHÂˆY]Ùˆ”ÔÕ‹ˆ\›ˆ]˜[YKˆXY\œÎˆÈÜÝˆ›Ù™›[™K›ØØ[ˆKˆÛØÚÙ]ˆÈ™[[ÝPY™\ÜÎˆ›ÙK—ÛÙ™›[™Q]™[Ü\ˆÈŒLËŒŒŒHˆˆÙ™›[™N‰ÔÝš[™Ê›ÙK˜ÛY[Y˜[›Ûž[[Ý\ÈŠKœÛXÙJMŠ_XKˆ\Ý›ÞYYˆ˜[ÙKˆ\Ý›ÞJ
HÈ\Ë™\Ý›ÞYYHYNÈKˆÛŠ]™[Ø[˜XÚÊHÂˆYˆ
]™[OOH™]HŠHØ[˜XÚÊ^
NÂˆ[ÙHYˆ
]™[OOH™[™ŠH]Y]YSZXÜ›Ý\ÚÊØ[˜XÚÊNÂˆ™]\›ˆ\ÎÂˆBˆNÂˆÛÛœÝ™\ÈHÂˆÙ]XY\Š
HßKˆÜš]RXY
™^Ý]\ÊHÈÝ]\ÈH[X™\Š™^Ý]\ÊHŒÈKˆ[™
^[ØY^HˆŠHÂˆ]^[ØYÂˆžHÈ^[ØYH^[ØY^È”ÓÓ‹œ\œÙJ^[ØY^
HˆßNÈBˆØ]ÚÈ^[ØYHÈÚÎˆ˜[ÙK\œ›ÜŽˆ›Ù™›[™K\™\ÜÛœÙK\\œÙKY˜Z[YˆNÈBˆ^[ØY›Ù™›[™HHYNÂˆ^[ØYœÝ]\ÈHÝ]\ÎÂˆ™\ÛÛ™J^[ØY
NÂˆBˆNÂˆ›ÛZ\ÙKœ™\ÛÛ™J[™P\J™\K™\ÊJK˜Ø]Ú

\œ›ÜŠHOˆÂˆ™\ËÜš]RXY
\œ›Üˆ[œÝ[˜Ù[Ùˆ\Q\œ›ÜˆÈ\œ›Ü‹œÝ]\ÈˆL
NÂˆ™\Ë™[™
”ÓÓ‹œÝš[™ÚYžJÈÚÎˆ˜[ÙK\œ›ÜŽˆ\œ›ÜË›Y\ÜØYÙH›Ù™›[™K\™\]Y\ÝY˜Z[YˆJJNÂˆJNÂˆJNÂŸB™ÛØ˜[\Ë‘SÙ™›[™SXZ[•™XYHØš™XÝ™œ™Y^™JÂˆ™\œÚ[ÛŽˆœÝ][Û‹]^\™KYÝX\™]M‹ˆ™\]Y\Ý
]˜[YK›ÙHHßJHÂˆ™]\›ˆÙ™›[™P\T™\]Y\Ý
Ýš[™Ê]˜[YH‹ÈŠK›ÙHßJNÂˆBŸJNÂŸJJ
N