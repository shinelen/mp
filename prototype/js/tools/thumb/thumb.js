var GAP_PREVIEW_NORMAL_TYPE = 1,//多页时同时显示三张预览图
GAP_PREVIEW_SMALL_TYPE = 2;//多页时只显示一张预览图
;(function(window,jq,u){
	
	var _GAPThumb,_GAPPreview,_GAPThumbInit,
	_elementUtil = {},
	_thumbNum = 0,
	_previewNum = 0,
	THUMB_MOVE = 10,
	THUMB_BORDER_SIZE = 5,
	PREVIEW_LESS_SIZE = 10,
	THUMB_LOADING_PATH = "images/tools/img_loading.gif",
	PREVIEW_CLOSE_BTN = "images/tools/preview_close.png",
	PREVIEW_PREV_BTN = "images/tools/preview_prev.png",
	PREVIEW_NEXT_BTN = "images/tools/preview_next.png";
	
	_elementUtil.createNoBorderThumb = function(w,h){
		var ele = u.div();
		ele.width(w).height(h).css({"line-height":h+"px"});
		return {"container" : ele,"imgContainer":ele};
	}
	_elementUtil.createSingleThumb = function(w,h){
		var ele = u.div("gap-thumb"),
		ele1 = u.div("gap-tmb s1"),
		w1 = w - (THUMB_MOVE*3),
		h1 = h - (THUMB_MOVE*3);
		ele.append(ele1);
		ele.width(w).height(h);
		ele1.width(w1).height(h1).css({"line-height":h1+"px"});
		return {"container" : ele,"imgContainer":ele1};
	}
	_elementUtil.createMultiPagesThumb = function(w,h){
		var ele = u.div("gap-thumb"),
		ele1 = u.div("gap-tmb"),
		ele2 = u.div("gap-tmb s1"),
		ele3 = u.div("gap-tmb s2"),
		w1 = w - (THUMB_MOVE*3),
		h1 = h - (THUMB_MOVE*3);
		
		ele.append(ele1).append(ele2).append(ele3);
		
		ele.width(w).height(h);
		ele1.width(w1).height(h1);
		ele2.width(w1).height(h1);
		ele3.width(w1).height(h1).css({"line-height":h1+"px"});
		
		return {"container" : ele,"imgContainer":ele3};
	}
	
	
	_GAPThumb = function(conf){
		var _this = this,
		eu = _elementUtil,
		_jq_container,_jq_img_container,_jq_img,_jq_preview,
		_default_conf = {
				page:1,
				width:150,
				height:120,
				previewWidth:310,
				previewHeight:310,
				rootPath:"../../",
				src:"",
				errorSrc:"",
				previewSrc:"",
				previewNextSrc:"",
				id:"gap_thumb_"+_thumbNum,
				img:null,
				hasBorder:true
		},		
		_conf = jq.extend(_default_conf,conf),
		SERIAL_NUMBER = "THUMB-"+Math.ceil(Math.random()*1000000000000),
		_preview;
		_thumbNum++;
		GAPUtil.log("_conf.page",_conf.page);
		(!_conf.page||_conf.page=="0")?_conf.page = 1:null;
		function createElement(){
			var eleObj,
			_src = (_conf.src&&_conf.src.indexOf("http")!=-1)?_conf.src:_conf.rootPath+_conf.src;
			if(_conf.page>1){
				if(typeof _conf.hasBorder == "boolean" && _conf.hasBorder == false){
					eleObj = eu.createNoBorderThumb(_conf.width,_conf.height);
				}else{
					eleObj = eu.createMultiPagesThumb(_conf.width,_conf.height);
				}
			}else{
				if(typeof _conf.hasBorder == "boolean" && _conf.hasBorder == false){
					eleObj = eu.createNoBorderThumb(_conf.width,_conf.height);
				}else{
					eleObj = eu.createSingleThumb(_conf.width,_conf.height);
				}
			}
			if(_jq_container){
				_jq_img.remove();
				_jq_img = null;
				_jq_img_container.remove();
				_jq_img_container = null;
				_jq_container?_jq_container.remove():null;
				_jq_container = null;
				_jq_preview.remove();
				_jq_preview = null;
			}
			_jq_container = eleObj.container;
			_jq_container.attr({
				"id":_conf.id,
				"SERIAL_NUMBER":SERIAL_NUMBER
			});
			_jq_img_container = eleObj.imgContainer;
			
			_jq_img = u.img(null,{"src":_src},{"max-width":_jq_img_container.width()+"px","max-height":_jq_img_container.height()+"px"});
			
			_jq_preview = u.div("gap-thumb-perview");
			_preview =  new GAPPreview({
				page:_conf.page,
				src:_conf.previewSrc,
				nextSrc:_conf.previewNextSrc,
				rootPath:_conf.rootPath,
				width:_conf.previewWidth,
				height:_conf.previewHeight,
				type:GAP_PREVIEW_NORMAL_TYPE
			}); 
			_preview.element
			.bind("preview-next",function(e,page,prevImg,img,nextImg){
				_jq_container.trigger("preview-next",[page,prevImg,img,nextImg]);
			})
			.bind("preview-prev",function(e,page,prevImg,img,nextImg){
				_jq_container.trigger("preview-prev",[page,prevImg,img,nextImg]);
			})
			.bind("preview-close",function(e){
				_jq_container.trigger("preview-close",[_jq_preview]);
			});
			_jq_preview.width(_preview.container_w).height(_preview.container_h);
			_jq_preview.html(_preview.element);
			_jq_img.bind("error",{SERIAL_NUMBER:SERIAL_NUMBER},function(e){
				SERIAL_NUMBER = e.data.SERIAL_NUMBER;
				u.log("u.isExisted(SERIAL_NUMBER)"+SERIAL_NUMBER,u.isExisted(SERIAL_NUMBER));
				if(!u.isExisted(SERIAL_NUMBER)){
					_this.destroy();
					return;
				}
				var img = jq(this),
				img_src = img.attr("src");
				_jq_container.trigger("img-load-fail",[e]);
				if(_conf.errorSrc){
					var error_src = (_conf.errorSrc&&_conf.errorSrc.indexOf("http")!=-1)?_conf.errorSrc:_conf.rootPath+_conf.errorSrc;
					if(error_src!=img_src){
						_jq_img.attr({"src":error_src});
					}else{
						u.log("GAPThumb createElement fail >> error_src is fail.");
					}
					
				}else{
					_jq_img.attr({"src":_conf.rootPath+THUMB_LOADING_PATH});
					setTimeout(function(){
						_jq_img?_jq_img.attr({"src":_src}):null;
					},
					3000);
				}
			});
			
			_jq_img.hover(
				function(e){
					var img = jq(this),
					w = parseInt(_conf.width),
					h = parseInt(_conf.height),
					x = img.offset().left+w-THUMB_MOVE*3,
					y = img.offset().top+h-THUMB_MOVE*3,
					w_win = 0,
					h_win = 0,
					preview_w = _jq_preview.outerWidth(),
					preview_h = _jq_preview.outerHeight();
		             if (window.innerWidth){
		                   w_win = window.innerWidth;
		             }else if ((document.body) && (document.body.clientWidth)){
		                   w_win = document.body.clientWidth;
					 }
					 
		             if (window.innerHeight){
		                   h_win = window.innerHeight;
		             }else if ((document.body) && (document.body.clientHeight)){
		                   h_win = document.body.clientHeight;
					};
					if((h_win-(y))<preview_h){
						y = (y-preview_h);
					}
					if((w_win-(x))<preview_w){
						x = (x-preview_w);
					}
					_jq_preview.css({"left":x<0?0:x+"px","top":y<u.getScrollTop()?u.getScrollTop()+20:y+"px"});
					_jq_preview.show();
					_jq_container.trigger("img-over",[e]);
				},
				function(e){
					_jq_container.trigger("img-out",[_jq_preview]);
					_conf.page==1?_jq_preview.hide():null;
//					_jq_preview.hide();
				}
			)
			.click(function(){
				_jq_container.trigger("img-click",[_jq_preview]);
			});
			
			jq("body").append(_jq_preview);
			_jq_img_container.append(_jq_img);
		}
		
		this.init = function(){
			createElement();
			_this.element = _jq_container;
			_this.imgElement = _jq_img;
		}
		this.getElement = function(){
			return _jq_container;
		}
		this.destroy = function(){
				eu = null;
				_jq_container = null;
				_jq_img_container = null;
				_jq_img = null;
				_jq_preview?_jq_preview.remove():null;
				_jq_preview = null;
				_this = null;
				
		}
		this.init();
	}
	
	_GAPPreview = function(conf){
		var _this = this,
		eu = _elementUtil,
		_jq_container,
		_jq_close_btn,_jq_prev_btn,_jq_next_btn,
		_jq_preview_page_text,
		_jq_img,_jq_prev_img,_jq_next_img,
		_default_conf = {
				page:1,
				id:"gap_preview_"+_previewNum,
				width:150,
				height:120,
				rootPath:"../../",
				type:GAP_PREVIEW_NORMAL_TYPE,
				src:"",
				prevSrc:"",
				nextSrc:"",
				errorSrc:"",
				id:"gap_preview_"+_thumbNum
		},		
		_conf = jq.extend(_default_conf,conf),
		SERIAL_NUMBER = "PREVIEW-"+Math.ceil(Math.random()*1000000000000),
		_totalPage = parseInt(_conf.page),
		_curPage = 1,
		_w = parseInt(_conf.width),
		_h = parseInt(_conf.height);
		_this.container_w = 0;
		_this.container_h = 0;
		_previewNum++;
		function createElement(){
			var eleObj,eleObjPre,eleObjNext,
			jq_perview_w = _w + THUMB_MOVE,
			jq_perview_h = _h + THUMB_MOVE,
			jq_img_w = _w - THUMB_MOVE*3,
			jq_img_h = _h - THUMB_MOVE*3,
			_src = (_conf.src&&_conf.src.indexOf("http")!=-1)?_conf.src:_conf.rootPath+_conf.src;
			_prevSrc = (_conf.prevSrc&&_conf.prevSrc.indexOf("http")!=-1)?_conf.prevSrc:_conf.rootPath+_conf.prevSrc;
			_nextSrc = (_conf.nextSrc&&_conf.nextSrc.indexOf("http")!=-1)?_conf.nextSrc:_conf.rootPath+_conf.nextSrc;
			if(_jq_container){
				_jq_img.remove();
				_jq_img = null;
				_jq_prev_img?_jq_prev_img.remove():null;
				_jq_prev_img = null;
				_jq_next_img?_jq_next_img.remove():null;
				_jq_next_img = null;
				_jq_container.remove();
				_jq_container = null;
			}
			_jq_container = u.div("gap-preview-container",{
				"id":_conf.id+"_preview",
				"SERIAL_NUMBER":SERIAL_NUMBER
			});
			if(_conf.page>1){
				var jq_preview,jq_prev_preview,jq_next_preview,jq_preview_page_nav,jq_clear,
				jq_page_nav_h = 50,
				jq_img_container,jq_img_next_container,jq_img_prev_container,
				jq_page_nav_w = jq_perview_w-THUMB_MOVE*3,
				jq_container_w = _this.container_w = jq_perview_w*2+ THUMB_MOVE*4,
				jq_container_h = _this.container_h = jq_perview_h+jq_page_nav_h+THUMB_MOVE*2,
				jq_simg_w = _w/2 - THUMB_MOVE*3,
				jq_simg_h = _h/2 - THUMB_MOVE*3;
				
				if(_conf.type==GAP_PREVIEW_SMALL_TYPE){
					jq_container_w = _this.container_w = jq_perview_w + THUMB_MOVE;
				}
				
				_jq_container.width(jq_container_w).height(jq_container_h);
				
				eleObj = eu.createSingleThumb(_w,_h);
				_jq_img = u.img(null,null,{"max-width":jq_img_w+"px","max-height":jq_img_h+"px"});
				jq_img_container = eleObj.container;
				jq_preview = u.div("gap-preview",null,{
					"width":jq_perview_w+"px",
					"height":jq_perview_h+"px",
					"line-height":jq_perview_h+"px"
				}).html(jq_img_container);
				
				
				_jq_close_btn = u.img("gap-preview-btn close",{"src":_conf.rootPath+PREVIEW_CLOSE_BTN});
				_jq_prev_btn = u.img("gap-preview-btn prev",{"src":_conf.rootPath+PREVIEW_PREV_BTN});
				_jq_next_btn = u.img("gap-preview-btn next",{"src":_conf.rootPath+PREVIEW_NEXT_BTN});
				_jq_preview_page_text = u.div("gap-preview-page-text");
				
				jq_clear = u.div("clear");
				jq_preview_page_nav = u.div("gap-preview-page-nav",null,{
					"width":jq_page_nav_w+"px"
				});
				
				_jq_img.error(function(e){
					if(!u.isExisted(SERIAL_NUMBER)){
						_this.destroy();
						return;
					}
					var img = jq(this),
					img_src = img.attr("src");
					_jq_container.trigger("img-load-fail",[e]);
					if(_conf.errorSrc){
						var error_src = (_conf.errorSrc&&_conf.errorSrc.indexOf("http")!=-1)?_conf.errorSrc:_conf.rootPath+_conf.errorSrc;
						if(error_src!=img_src){
							_jq_img.attr({"src":error_src});
						}else{
							u.log("GAPThumb createElement fail >> error_src is fail.")
						}
						
					}else{
						_jq_img.attr({"src":_conf.rootPath+THUMB_LOADING_PATH});
						setTimeout(function(){
							var cur_img_src = _jq_img.attr("lastSrc");
							if(cur_img_src==(_conf.rootPath+THUMB_LOADING_PATH)){
								_jq_img?_jq_img.attr({"src":img_src}):null;
							}
						},
						3000);
					}
				}).load(function(e){
					var img = jq(this),
					img_src = img.attr("src");
					img.attr({"lastSrc":img_src})
				});
				function initPage(){
					if(jq_img_prev_container&&jq_img_next_container){
						if(_curPage==1){
							jq_img_prev_container.hide();
							jq_img_next_container.show();
						}else if(_curPage==_totalPage){
							jq_img_prev_container.show();
							jq_img_next_container.hide();
						}else{
							jq_img_prev_container.show();
							jq_img_next_container.show();
						}
					}
					_jq_preview_page_text.text(_curPage+"/"+_totalPage);
				}
				if(_conf.type==GAP_PREVIEW_NORMAL_TYPE){
					eleObjPre = eu.createSingleThumb(_w/2,_h/2);
					eleObjNext = eu.createSingleThumb(_w/2,_h/2);
					_jq_prev_img = u.img(null,null,{"max-width":jq_simg_w+"px","max-height":jq_simg_h+"px"});
					_jq_next_img = u.img(null,null,{"max-width":jq_simg_w+"px","max-height":jq_simg_h+"px"});
					jq_img_next_container = eleObjNext.container;
					jq_img_prev_container = eleObjPre.container;
					jq_prev_preview = u.div("gap-preview prev",null,{
						"width":jq_perview_w/2+"px",
						"height":jq_perview_h/2+"px",
						"line-height":jq_perview_h/2+"px"
					}).html(jq_img_prev_container);
					jq_next_preview = u.div("gap-preview next",null,{
						"width":jq_perview_w/2+"px",
						"height":jq_perview_h/2+"px",
						"line-height":jq_perview_h/2+"px"
					}).html(jq_img_next_container);
					_jq_container
					.append(_jq_close_btn)
					.append(jq_prev_preview)
					.append(jq_preview)
					.append(jq_next_preview)
					.append(jq_clear)
					.append(jq_preview_page_nav);
					eleObjPre.imgContainer.html(_jq_prev_img);
					eleObjNext.imgContainer.html(_jq_next_img);
					
					_jq_prev_img.error(function(e){
						if(!u.isExisted(SERIAL_NUMBER)){
							_this.destroy();
							return;
						}
						var img = jq(this),
						img_src = img.attr("src");
						_jq_container.trigger("prev-img-load-fail",[e]);
						if(_conf.errorSrc){
							var error_src = (_conf.errorSrc&&_conf.errorSrc.indexOf("http")!=-1)?_conf.errorSrc:_conf.rootPath+_conf.errorSrc;
							if(error_src!=img_src){
								_jq_prev_img.attr({"src":error_src});
							}else{
								u.log("GAPThumb createElement fail >> error_src is fail.")
							}
							
						}else{
							_jq_prev_img.attr({"src":_conf.rootPath+THUMB_LOADING_PATH});
							
							setTimeout(function(){
								var cur_img_src = _jq_prev_img.attr("lastSrc");
								if(cur_img_src==(_conf.rootPath+THUMB_LOADING_PATH)){
									_jq_prev_img?_jq_prev_img.attr({"src":img_src}):null;
								}
							},
							3000);
						}
					}).load(function(e){
						var img = jq(this),
						img_src = img.attr("src");
						img.attr({"lastSrc":img_src})
					});
					
					_jq_next_img.error(function(e){
						if(!u.isExisted(SERIAL_NUMBER)){
							_this.destroy();
							return;
						}
						var img = jq(this),
						img_src = img.attr("src");
						_jq_container.trigger("next-img-load-fail",[e]);
						if(_conf.errorSrc){
							var error_src = (_conf.errorSrc&&_conf.errorSrc.indexOf("http")!=-1)?_conf.errorSrc:_conf.rootPath+_conf.errorSrc;
							if(error_src!=img_src){
								_jq_next_img.attr({"src":error_src});
							}else{
								u.log("GAPThumb createElement fail >> error_src is fail.")
							}
							
						}else{
							_jq_next_img.attr({"src":_conf.rootPath+THUMB_LOADING_PATH});
							setTimeout(function(){
								var cur_img_src = _jq_next_img.attr("lastSrc");
								if(cur_img_src==(_conf.rootPath+THUMB_LOADING_PATH)){
									_jq_next_img?_jq_next_img.attr({"src":img_src}):null;
								}
							},
							3000);
						}
					}).load(function(e){
						var img = jq(this),
						img_src = img.attr("src");
						img.attr({"lastSrc":img_src})
					});
				
					_jq_prev_img.attr({"src":_prevSrc})
					_jq_next_img.attr({"src":_nextSrc})
					
					_jq_close_btn.bind("click",function(e){
						_curPage = 1;
						initPage();
						_jq_img.attr({"src":_src});
						_jq_prev_img.attr({"src":_prevSrc});
						_jq_next_img.attr({"src":_nextSrc});
						_jq_container.trigger("preview-close",[]);
					})
					
				}else{
					_jq_container
					.append(jq_preview)
					.append(jq_clear)
					.append(jq_preview_page_nav);
				}
				
				jq_preview_page_nav
					.append(_jq_prev_btn)
					.append(_jq_preview_page_text)
					.append(_jq_next_btn);
				
				function prevPage(){
					_curPage--;
					if(_curPage<=0){
						_curPage = 1;
					}
					initPage();
				}
				
				function nextPage(){
					_curPage++;
					if(_curPage>_totalPage){
						_curPage = _totalPage;
					}
					initPage();
				}
				
				_jq_prev_btn.bind("click",function(e){
					prevPage();
					_jq_container.trigger("preview-prev",[_curPage,_jq_prev_img,_jq_img,_jq_next_img]);
				})
				_jq_next_btn.bind("click",function(e){
					nextPage();
					_jq_container.trigger("preview-next",[_curPage,_jq_prev_img,_jq_img,_jq_next_img]);
				})
				jq_img_prev_container?jq_img_prev_container.bind("click",function(e){
					prevPage();
					_jq_container.trigger("preview-prev",[_curPage,_jq_prev_img,_jq_img,_jq_next_img]);
				}):null;
				jq_img_next_container?jq_img_next_container.bind("click",function(e){
					nextPage();
					_jq_container.trigger("preview-next",[_curPage,_jq_prev_img,_jq_img,_jq_next_img]);
				}):null;
				
				initPage();
				eleObj.imgContainer.html(_jq_img);
				
//				_jq_preview_page_text.text(_curPage+"/"+_totalPage);
				
			}else{
				var jq_container_w = _this.container_w = jq_perview_w+ THUMB_MOVE,
				jq_container_h = _this.container_h = jq_perview_h+THUMB_MOVE;
				
				_jq_container.width(jq_container_w).height(jq_container_h);
				
				eleObj = eu.createSingleThumb(_conf.width,_conf.height);
				_jq_img = u.img(null,null,{"max-width":jq_img_w+"px","max-height":jq_img_h+"px"});
				_jq_img.error(function(e){
					if(!u.isExisted(SERIAL_NUMBER)){
						_this.destroy();
						return;
					}
					var img = jq(this),
					img_src = img.attr("src");
					_jq_container.trigger("img-load-fail",[e]);
					if(_conf.errorSrc){
						var error_src = (_conf.errorSrc&&_conf.errorSrc.indexOf("http")!=-1)?_conf.errorSrc:_conf.rootPath+_conf.errorSrc;
						if(error_src!=img_src){
							_jq_img.attr({"src":error_src});
						}else{
							u.log("GAPThumb createElement fail >> error_src is fail.")
						}
						
					}else{
						_jq_img.attr({"src":_conf.rootPath+THUMB_LOADING_PATH});
						setTimeout(function(){
							var cur_img_src = _jq_img.attr("lastSrc");
							if(cur_img_src==(_conf.rootPath+THUMB_LOADING_PATH)){
								_jq_img?_jq_img.attr({"src":img_src}):null;
							}
						},
						3000);
					}
				}).load(function(e){
					var img = jq(this),
					img_src = img.attr("src");
					img.attr({"lastSrc":img_src})
				});
				jq_preview = u.div("gap-preview",null,{
					"width":jq_perview_w+"px",
					"height":jq_perview_h+"px",
					"line-height":jq_perview_h+"px"
				}).html(eleObj.container);
				_jq_container	.append(jq_preview);
				eleObj.imgContainer.html(_jq_img);
			}
			_jq_img.attr({"src":_src});
		}
		this.init = function(){
			createElement();
			_this.element = _jq_container;
			_this.imgElement = _jq_img;
			_this.imgPrevElement = _jq_prev_img;
			_this.imgNextElement = _jq_next_img;
		}
		this.getElement = function(){
			return _jq_container;
		}
		this.destroy = function(){
			eu = null;
			_jq_close_btn = null;
			_jq_prev_btn = null;
			_jq_next_btn = null;
			_jq_preview_page_text = null;
			_jq_img?_jq_img.remove():null;
			_jq_img = null;
			_jq_prev_img?_jq_prev_img.remove():null;
			_jq_prev_img = null;
			_jq_next_img?_jq_next_img.remove():null;
			_jq_next_img = null;
			_jq_container?_jq_container.remove():null;
			_jq_container = null;
			_this = null;
		}
		this.init();
		
	}
	
	_GAPThumbInit = function(){
		jq("img[gap-src][id]").each(function(){
			var img = jq(this),
			w =img.attr("gap-width"),
			h = img.attr("gap-height"),
			src = img.attr("gap-src"),
			id = img.attr("id"),
			previewWidth = img.attr("gap-preview-width"),
			previewHeight = img.attr("gap-preview-height"),
			previewSrc = img.attr("gap-preview-src"),
			previewNextSrc = img.attr("gap-preview-next-src"),
			errorSrc = img.attr("gap-errorSrc"),
			page = img.attr("gap-page"),
			parmeters = {},
			thumb;
			
			parmeters.page = page?page:1;
			parmeters.src = src;
			parmeters.id = id;
			parmeters.errorSrc = errorSrc?errorSrc:"";
			
			w = w?w:img.width();
			h = h?h:img.height();
			w?parmeters.width = w:null;
			h?parmeters.height = h :null;
			previewWidth?parmeters.previewWidth = previewWidth:null;
			previewHeight?parmeters.previewHeight = previewHeight:null;
			previewSrc?parmeters.previewSrc = previewSrc:null;
			previewNextSrc?parmeters.previewNextSrc = previewNextSrc:null;
			
			thumb = new GAPThumb(parmeters);
//			u.log(img.attr())
			img.replaceWith(thumb.element);
		});
	}
	
	jq(function(){
		_GAPThumbInit();
	});
	GAPThumb = window.GAPThumb = _GAPThumb;
	GAPPreview = window.GAPPreview = _GAPPreview;
	GAPThumbInit = window.GAPThumbInit = _GAPThumbInit;
})(window,jQuery,GAPUtil);