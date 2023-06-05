!function(n,V){"use strict";var D="ht",L=n[D],e="position",d="absolute",Z="px",P="left",h="top",s="innerHTML",Q="className",M="width",i="height",v="0",q="display",A="none",S="visibility",F="user-select",C="margin",r="padding",R=null,T=L.Color,z=L.Default,t=z.getInternal(),K=n.setTimeout,m=n.setInterval,Y=n.clearTimeout,o=n.clearInterval,X=n.parseInt,H=z.isLeftButton,j=z.isDragging,p=z.startDragging,g=z.getDistance,N=z.isTouchable,O=T.widgetIconHighlight,c=T.widgetIconBorder,J=T.widgetIconGradient,u=function(){return document},k=function(J,_){return J.querySelectorAll(_)},y=function(w){var i=u().createElement(w);return"ul"===w&&(B(i,e,"relative"),B(i,C,v),B(i,r,v),B(i,"list-style",A),B(i,"box-sizing","border-box"),B(i,"-moz-box-sizing","border-box"),B(i,q,"inline-block"),B(i,"vertical-align","text-bottom"),B(i,"border","1px solid "+z.contextMenuBorderColor),B(i,"box-shadow","0 0 16px 1px "+z.contextMenuShadowColor),B(i,"overflow","hidden"),z.contextMenuBorderRadius&&B(i,"border-radius",z.contextMenuBorderRadius+Z)),i},f=function(m){var Y=m.touches[0];return Y?Y:m.changedTouches[0]},b=function(){return y("div")},W=function(){return y("canvas")},B=function(d,X,U){d.style.setProperty(X,U,R)},x=function(I,R,u){z.def(L.widget[I],R,u)},$=function(f,z){f.appendChild(z)},G=function(R,P){R.removeChild(P)},l=function(Y,r,b,G){Y.addEventListener(r,b,!!G)},a=function(z,t,b,V){z.removeEventListener(t,b,!!V)};t.addMethod(z,{contextMenuCheckIcon:{width:16,height:16,comps:[{type:"border",rect:[1,1,14,14],width:1,color:c},{type:"shape",points:[13,3,7,12,4,8],borderWidth:2,borderColor:O}]},contextMenuRadioIcon:{width:16,height:16,comps:[{type:"circle",rect:[2,2,12,12],borderWidth:1,borderColor:c},{type:"circle",rect:[4,4,8,8],borderWidth:1,borderColor:O,gradient:z.imageGradient,gradientColor:J,background:O}]},contextMenuLabelFont:(N?"16":"13")+"px arial, sans-serif",contextMenuLabelColor:"#000",contextMenuBackground:"#fff",contextMenuDisabledLabelColor:"#888",contextMenuHoverBackground:"#648BFE",contextMenuHoverLabelColor:"#fff",contextMenuSeparatorWidth:1,contextMenuSeparatorColor:"#E5E5E5",contextMenuScrollerColor1:"#FDFDFD",contextMenuScrollerColor2:"#D3D3D3",contextMenuScrollerBorderColor:"#C3C3C3",contextMenuBorderColor:"#C3C3C3",contextMenuShadowColor:"rgba(128, 128, 128, 0.5)",contextMenuBorderRadius:5,contextMenuSubmenuMark:"▶"},!0);var _=function(U){var P=this,z=U._view;if(P.$11b=U,P.addListeners(),l(z,"contextmenu",function(c){c.preventDefault()}),!N){var f=P.$37b=P.$36b.bind(P);l(z,"mouseover",f),l(z,"mouseout",f)}};z.def(_,V,{ms_listener:1,getView:function(){return this.$11b._view},handle_touchstart:function(s){if(z.preventDefault(s),H(s)){for(var n=this,r=n.$11b,e=n.getView(),A=e.children,k=0;k<A.length;k++){var y=A[k],P=y.$24b,x=y.$25b;if(P&&P.contains(s.target))return r.scrollUp(y),n.$28b=K(function(){n.$29b=m(function(){r.scrollUp(y)},100)},500),p(n,s),void 0;if(x&&x.contains(s.target))return r.scrollDown(y),n.$28b=K(function(){n.$29b=m(function(){r.scrollDown(y)},100)},500),p(n,s),void 0}N&&(s=f(s)),n.$30b={x:s.pageX,y:s.pageY}}},handle_mousedown:function(N){this.handle_touchstart(N)},handle_touchend:function(n){if(H(n)){var Q=this,A=Q.$30b,h=N?{x:f(n).pageX,y:f(n).pageY}:{x:n.pageX,y:n.pageY};if(!A||g(A,h)>1)return delete Q.$30b,void 0;for(var w=Q.getView(),B=Q.$11b,P=n.target,e=R,$=R,J=B._items,Z=w.$26b,K=0;K<Z.length;K++)if($=Z[K],$.contains(P)){e=$.getAttribute("data-id");break}if(e&&J){var L=B.$17b(J,function(B){return B._id===e});if(L){var W=!1;L.disabled instanceof Function?W=L.disabled.call(B,L):L.disabled===!0&&(W=!0),W||(L.items?N&&Q.$36b($,!0):B.$1b(L,n))}}delete Q.$30b}},$36b:function(d,y){if(!j()){var q,G=this,J=G.$11b,R=G.getView(),C=J.$20b||R.children[0],M=J.$19b,f=R.$26b,K=R.children,g=d.target,u=R.getBoundingClientRect(),n=z.getWindowInfo(),X=n.width,e=n.height,W=function(a){for(var U=0;U<K.length;U++){var F=K[U],s=new RegExp(a+"$"),d=F[Q];if(d&&(s.test(d)||d.indexOf(a+" ")>=0))return F}},k=function(C){for(var j=0;j<f.length;j++){var w=f[j],I=new RegExp(C+"$"),P=w[Q];if(P&&(I.test(P)||P.indexOf(C+" ")>=0))return w}},o=function(L){var y=k("menu-item"+L.$45b),b=y.getBoundingClientRect(),n=b.top-u.top,w=b.left-u.left;B(L,h,n+Z),B(L,P,w+b.width+Z);var s=L.getBoundingClientRect(),V=s.top,x=s.left,q=s.height,$=s.width,g=V+q+2,o=x+$+2;g>e&&B(L,h,n+e-g+Z),o>X&&B(L,P,w-$+Z)};if(y)q=d;else{if("mouseover"===d.type){for(var t=0;t<f.length;t++){var a=f[t];if(a.contains(g)){q=a;break}}if(!q&&M){var I=M.parentNode,D=W("submenu"+M.getAttribute("data-id"));(D&&D.contains(g)||I&&I.contains(g))&&(q=M)}}else if("mouseout"===d.type){for(var E=!1,r=d.relatedTarget,t=0;t<K.length;t++){var l=K[t];if("hidden"!==l.style.visibility&&l.contains(r)){E=!0;break}}if(E)return}!q&&C&&(q=k("menu-item"+(C.$45b||"NaN")))}if(q!=M){if(M)for(var v=M;v;){v[Q]=v[Q].replace(" menu-item-hover",""),v[Q].indexOf("disabled")<0&&(B(v,"background-color",z.contextMenuBackground),B(v,"color",z.contextMenuLabelColor));var w=W("submenu"+v.getAttribute("data-id"));w&&B(w,S,"hidden");var s=v.parentNode;v=k("menu-item"+(s.$45b||"NaN"))}if(q){for(var O=q,L=[];O;){O[Q]+=" menu-item-hover",O[Q].indexOf("disabled")<0&&(B(O,"background-color",z.contextMenuHoverBackground),B(O,"color",z.contextMenuHoverLabelColor));var $=W("submenu"+O.getAttribute("data-id"));$&&(B($,S,"visible"),L.push($));var s=O.parentNode;O=k("menu-item"+(s.$45b||"NaN"))}L.reverse(),L.forEach(function(B){o(B)})}}J.$19b=q,J.$20b=q?q.parentNode:R.children[0]}},handle_mouseup:function(q){this.handle_touchend(q)},handleWindowTouchEnd:function(){var n=this;n.$28b!=R&&(Y(n.$28b),delete n.$28b),n.$29b!=R&&(o(n.$29b),delete n.$29b),delete n.$34b,delete n.$30b,delete n.$35b},handleWindowMouseUp:function(D){this.handleWindowTouchEnd(D)},handle_mousemove:function(B){this.handle_touchmove(B)},handle_touchmove:function(P){if(!j()&&H(P)){for(var n=this,V=n.getView().children,b=R,F=0;F<V.length;F++){var I=V[F];if(I.contains(P.target)){b=I;break}}var X=n.$30b,Z=N?{x:f(P).pageX,y:f(P).pageY}:{x:P.pageX,y:P.pageY};b&&X&&g(X,Z)>2&&(p(n,P),n.$34b=b,n.$35b=b.$18b)}},handleWindowTouchMove:function(W){W.preventDefault();var R=this,w=R.$11b,q=R.$34b,T=R.$35b,k=R.$30b;if(k&&q){var r=N?{x:f(W).pageX,y:f(W).pageY}:{x:W.pageX,y:W.pageY},V=r.y-k.y;V>0?w.scrollUp(q,q.$18b-(T-V)):w.scrollDown(q,T-V-q.$18b)}},handleWindowMouseMove:function(Q){this.handleWindowTouchMove(Q)},$10b:function(z,s){z.preventDefault();for(var $=this,V=$.getView().children,i=R,D=0;D<V.length;D++){var h=V[D];if(h.contains(z.target)){i=h;break}}if(i){var a=this.$11b,A=a.getRowHeight();Math.abs(s)>.05&&(s>0?a.scrollUp(i,s*A):0>s&&a.scrollDown(i,-s*A))}},handle_mousewheel:function($){this.$10b($,$.wheelDelta/40)},handle_DOMMouseScroll:function(_){this.$10b(_,-_.detail)},$44b:function(V){this.getView().contains(V.target)||this.$11b.hide()},$41b:function(S){this.$11b.show(S)},$4b:function(J,T){var Z=this.$11b;if(T=T||Z._items,T&&T.length&&J.keyCode){var d=[J.keyCode];J.shiftKey&&d.push(16),J.ctrlKey&&d.push(17),J.altKey&&d.push(18),/mac/.test(n.navigator?n.navigator.userAgent.toLowerCase():"")?J.metaKey&&d.push(17):J.metaKey&&d.push(91),d.sort();var O=d.join(),B=Z.$17b(T,function(F){if(F.key){var c=F.key.slice(0);return c.sort(),O===c.join()}});if(B){B.preventDefault!==!1&&J.preventDefault();var V=!1;B.disabled instanceof Function?V=B.disabled.call(Z,B):B.disabled===!0&&(V=!0),V||Z.$1b(B,J)}}},$39b:function(h){var g=this,c=f(h);g.$32b={x:c.pageX,y:c.pageY}},$38b:function(c){var $=this,B=f(c);$.$31b={x:B.pageX,y:B.pageY},$.$33b=K(function(){$.$31b&&($.$32b?g($.$31b,$.$32b)<10&&$.$11b.show(c):$.$11b.show(c)),delete $.$33b,delete $.$31b,delete $.$32b},600)},$40b:function(){var O=this;O.$33b!=R&&(Y(O.$33b),delete O.$33b,delete O.$31b,delete O.$32b)}}),L.widget.ContextMenu=function(D){var g=this,V=g._view=t.createView(null,g);V[Q]="ht-widget-contextmenu",g.setItems(D),g.$13b=new _(g),B(V,"font",z.contextMenuLabelFont),B(V,e,d),B(V,"cursor","default"),B(V,"-webkit-"+F,A),B(V,"-moz-"+F,A),B(V,"-ms-"+F,A),B(V,F,A),B(V,"box-sizing","border-box"),B(V,"-moz-box-sizing","border-box"),z.baseZIndex!=R&&B(V,"z-index",X(z.baseZIndex)+2+""),g.$3b=function(V){g.$13b.$4b(V)}},x("ContextMenu",V,{$5b:0,_items:R,$21b:R,_enableGlobalKey:!1,ms_v:1,enableGlobalKey:function(){var Y=this,o=Y._enableGlobalKey;o===!1&&(l(u(),"keydown",Y.$3b),Y._enableGlobalKey=!0)},disableGlobalKey:function(){this._enableGlobalKey=!1,a(u(),"keydown",this.$3b)},setItems:function(G){this._items=G},getItems:function(){return this._items},setVisibleFunc:function(b){this.$16b=b},setLabelMaxWidth:function(o){this.$43b=o},$1b:function(R,V){var N=this;if("check"===R.type)R.selected=!R.selected;else if("radio"===R.type){var U=R.groupId;N.$17b(N._items,function(G){G.groupId===U&&(G.selected=!1)}),R.selected=!0}if(N.hide(),R.action)R.action.apply(R.scope||N,[R,V]);else if(R.href){var K=R.linkTarget||"_self";n.open(R.href,K)}},getItemById:function(l){return this.getItemByProperty("id",l)},setItemVisible:function(W,P){var i=this.getItemById(W);i&&(i.visible=P)},getItemByProperty:function(L,H,t){var N=this;if(t=t||N._items,!t||0===t.length)return R;var E=N.$17b(t,function(s){return s[L]===H});return E||R},scrollUp:function(l,I){var _=this;if(I=I==R?20:I,I=X(I),0!==I){var h=0;l.$18b>I&&(h=l.$18b-I),_.$42b(l,h),l.scrollTop=h,l.$18b=h}},scrollDown:function(m,O){var v=this;if(O=O==R?20:O,O=X(O),0!==O){var h=m.$22b,Q=m.$23b,r=h-Q;Q+m.$18b+O<h&&(r=m.$18b+O),v.$42b(m,r),m.scrollTop=r,m.$18b=r}},$42b:function(W,e){e=e==R?W.$18b:e;var H=W.$24b,w=W.$25b;H&&(B(H,"top",e+Z),0==e?B(H,q,A):B(H,q,"block")),w&&(B(w,"bottom",-e+Z),e==W.$22b-W.$23b?B(w,q,A):B(w,q,"block"))},getRowHeight:function(){return this._view.querySelector(".menu-item").offsetHeight},$17b:function(P,T){for(var l=0;l<P.length;l++){var E=P[l];if(T(E))return E;if(E.items){var t=this.$17b(E.items,T);if(t)return t}}},$2b:function(I,X){for(var _=this,w=0;w<I.length;w++){_.$5b++;var J=I[w];if(J.visible!==!1&&!(z.isFunction(J.visible)&&!J.visible()||_.$16b&&!_.$16b.call(_,J))){var K=y("li"),g=_.$5b+"";if(B(K,"white-space","nowrap"),B(K,q,"block"),"separator"===J||J.separator===!0){var j=b();j[Q]="separator",B(j,i,z.contextMenuSeparatorWidth+Z),B(j,"background",z.contextMenuSeparatorColor),$(K,j)}else{J._id=g,K.setAttribute("data-id",g);var O=y("span"),n=y("span"),t=W(),N=b();if(B(O,q,"inline-block"),B(n,q,"inline-block"),t[Q]="prefix",B(t,q,"inline-block"),B(t,M,"1em"),B(t,i,"1em"),B(t,"vertical-align","middle"),B(t,C,"0 0.2em"),"check"===J.type&&J.selected?t[Q]+=" check-prefix":"radio"===J.type&&J.selected&&(t[Q]+=" radio-prefix"),$(K,t),J.icon){var P=W();P[Q]="contextmenu-item-icon",B(P,q,"inline-block"),B(P,"vertical-align","middle"),B(P,i,"1.2em"),B(P,M,"1.2em"),B(P,"margin-right","0.2em"),P.$50b=J.icon,$(O,P)}if(n[s]=J.label,$(O,n),$(K,O),N[Q]="suffix",B(N,q,"inline-block"),B(N,"margin-left","1em"),B(N,"margin-right","0.4em"),B(N,"text-align","right"),B(N,"font-size","75%"),J.items&&(N[s]=z.contextMenuSubmenuMark),J.suffix&&(N[s]=J.suffix),$(K,N),K[Q]="menu-item menu-item"+g,B(K,"background-color",z.contextMenuBackground),B(K,"color",z.contextMenuLabelColor),B(K,r,"3px 0"),J.disabled instanceof Function){var k=J.disabled.call(_,J);k&&(K[Q]+=" disabled",B(K,"color",z.contextMenuDisabledLabelColor))}else J.disabled&&(K[Q]+=" disabled",B(K,"color",z.contextMenuDisabledLabelColor));if(J.items){_.$21b||(_.$21b=new L.List);var R=y("ul");R[Q]="submenu"+g,R.$45b=g,B(R,S,"hidden"),B(R,e,d),$(_._view,R),_.$21b.add(R),_.$2b(J.items,R)}}$(X,K)}}},rebuild:function(){var M=this,q=M._items,c=M._view;if(c&&(c[s]="",M.$21b=R,M.$5b=0,M.$19b=R,M.$20b=R,c.$26b=R,q&&0!==q.length)){var Z=y("ul",M._r);$(c,Z),M.$2b(q,Z)}},addTo:function(B){if(B){var d=this,Y=d.$13b;if(d.$12b=B,d.$9b=function(i){Y.$44b(i)},d.$27b=function(Q){Y.$41b(Q)},N){var m=d.$6b=function(R){Y.$38b(R)},q=d.$7b=function(d){Y.$39b(d)},r=d.$8b=function(l){Y.$40b(l)};l(B,"touchstart",m,!0),l(B,"touchmove",q),l(B,"touchend",r)}else l(B,"contextmenu",d.$27b)}},showOnView:function(Y,_,K){Y=Y.getView?Y.getView():Y;var R=z.getWindowInfo(),V=Y.getBoundingClientRect();this.show(V.left+R.left+_,V.top+R.top+K)},show:function(r,D,X){var U=this,X=X==R?!0:!1,H=U._view;if(H){if(U.invalidate(),1===arguments.length){var a=r;if(N){var o=f(a);r=o.pageX,D=o.pageY}else r=a.pageX,D=a.pageY}var x=z.getWindowInfo(),L=x.width,T=x.height,p=x.left,G=x.top,F={pageX:r,pageY:D,clientX:r-p,clientY:D-G,target:1,originEvent:a},j=F.clientX,y=F.clientY,c=function(Y){Y.style.height=T-6+Z;var p=b(),H=b(),C=function(A){B(A,e,d),B(A,"text-align","center"),B(A,M,"100%"),B(A,"font-size",10+Z),B(A,"padding","2px 0"),B(A,"border","0px solid "+z.contextMenuScrollerBorderColor),B(A,"background-color",z.contextMenuScrollerColor1),A.style.backgroundImage="-webkit-linear-gradient(top, "+z.contextMenuScrollerColor1+", "+z.contextMenuScrollerColor2+")",A.style.backgroundImage="linear-gradient(to bottom, "+z.contextMenuScrollerColor1+", "+z.contextMenuScrollerColor2+")"};p[Q]="menu-arrow-item menu-arrow-item-top",H[Q]="menu-arrow-item menu-arrow-item-bottom",C(p),B(p,"top",v),B(p,"left",v),B(p,"border-bottom-width",1+Z),p[s]="▲",C(H),B(H,"bottom",v),B(H,"left",v),B(H,"border-top-width",1+Z),H[s]="▼",Y.$24b=p,Y.$25b=H,Y.$18b=Y.scrollTop,Y.$22b=Y.scrollHeight,Y.$23b=Y.clientHeight,$(Y,p),$(Y,H),U.$42b(Y)};U.beforeShow&&U.beforeShow(F);var E=U._items;if(E&&(a&&a.preventDefault(),E.length)){U.rebuild(),z.appendToScreen(H),H.$26b=k(H,".menu-item");var w=H.children[0];w.offsetHeight>T&&c(w);var i=y+(X?1:0),O=j+(X?1:0),S=function(N){for(var f=0,G=0,_=0,o=U.$43b;_<N.children.length;_++){var c=N.children[_];if(c.getAttribute("data-id")){var C=c.children[1],I=c.children[2],K=C.children;if(o){var D=K[0];K.length>1&&(D=K[1]),D.offsetWidth>o&&(D[s]="<marquee scrollamount='3'>"+D[s]+"</marquee>",D.children[0].style.verticalAlign="text-bottom",B(D,M,o+Z),B(D,q,"inline-block"))}var A=C.offsetWidth,x=I.offsetWidth;A>f&&(f=A),x>G&&(G=x)}}for(_=0;_<N.children.length;_++){var c=N.children[_];if(c.getAttribute("data-id")){var C=c.children[1],I=c.children[2],H=C.children[0],J=C.children[1];!J&&H.style.width&&B(H,M,f+Z),B(C,M,f+Z),B(I,M,G+Z)}}};S(w);var n=y+3+H.offsetHeight,g=j+3+H.offsetWidth;n>T?B(H,h,i-(n-T)+G+Z):B(H,h,i+G+Z),g>L?B(H,P,O-(g-L)+p+Z):B(H,P,O+p+Z);var W=U.$21b;W&&W.each(function(F){S(F),F.offsetHeight>T&&c(F)}),U.$9b&&l(u(),N?"touchstart":"mousedown",U.$9b,!0),U.afterShow&&U.afterShow(F),U.$47b()}}},isShowing:function(){return this._view?this._view.parentNode!=R:!1},getRelatedView:function(){return this.$12b},hide:function(){var O=this,q=O._view;q&&q.parentNode&&(G(q.parentNode,q),a(u(),N?"touchstart":"mousedown",O.$9b,!0),O.afterHide&&O.afterHide())},dispose:function(){var v=this,z=v.$12b,y=v._view;y&&(y.parentNode&&G(y.parentNode,y),v.disableGlobalKey(),z&&(N?(a(z,"touchstart",v.$6b,!0),a(z,"touchmove",v.$7b),a(z,"touchend",v.$8b)):a(z,"contextmenu",v.$27b)),v._view=v._items=v.$21b=v.$19b=v.$12b=v.beforeShow=v.afterShow=v.afterHide=v.$9b=v.$3b=v.$6b=v.$7b=v.$8b=v.$27b=R)},$46b:function(k,D,O,n){var F=t.initContext(k);t.translateAndScale(F,0,0,1),F.clearRect(0,0,O,n),z.drawStretchImage(F,z.getImage(D),"fill",0,0,O,n),F.restore()},$47b:function(){var M,T,p,v=this,u=v._view;if(v.isShowing()){var n=k(u,".check-prefix");for(p=0;p<n.length;p++){var j=n[p];M=j.clientWidth,T=j.clientHeight,j.$48b=M,j.$49b=T,t.setCanvas(j,M,T)}var y=k(u,".radio-prefix");for(p=0;p<y.length;p++){var A=y[p];M=A.clientWidth,T=A.clientHeight,A.$48b=M,A.$49b=T,t.setCanvas(A,M,T)}var D=k(u,".contextmenu-item-icon");for(p=0;p<D.length;p++){var B=D[p];M=B.clientWidth,T=B.clientHeight,B.$48b=M,B.$49b=T,t.setCanvas(B,M,T)}}},validateImpl:function(){var n,_,A,E=this,P=E._view;if(E.isShowing()){var H=k(P,".check-prefix");for(A=0;A<H.length;A++){var G=H[A];n=G.$48b,_=G.$49b,n&&_&&E.$46b(G,z.contextMenuCheckIcon,n,_)}var B=k(P,".radio-prefix");for(A=0;A<B.length;A++){var p=B[A];n=p.$48b,_=p.$49b,n&&_&&E.$46b(p,z.contextMenuRadioIcon,n,_)}var W=k(P,".contextmenu-item-icon");for(A=0;A<W.length;A++){var K=W[A];n=K.$48b,_=K.$49b,n&&_&&E.$46b(K,z.getImage(K.$50b),n,_)}}}})}("undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:(0,eval)("this"),Object);