;(function () {
  var $win = $(window),
    $doc = $(document),
    $body = $("body"),
    initializedMaps = [],
    lpc_template = {},
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
	isApple = /iPod|iPad|iPhone/i.test(navigator.userAgent);

	window.lpc_template = lpc_template;

	lpc_template.queue = {};
	
	$body.on('click', 'a[href^="popup:"]', function (e) {
        e.preventDefault();
    });

    function lpcCreateBlockProducts(
		jquery_block,
		dataOptionOption,
		callBack = { beforeAjax: null, complete: null }
    ){
        class createBLockProduct {
                    
            constructor($block) {
                this.$block = $block;
				this.response = null;
				this.dataSliderInit = null,
				this.spoilerInit = null,
				this.extenSettingBegin = function() {
					let _this = this;
					_this.dataSliderInit = _this.$block.attr('data-ajax-slider-init') ? _this.$block : _this.$block.find('.splide-init');
					if (_this.dataSliderInit.length && _this.dataSliderInit.find('.splide .is-active').length) {
						_this.dataSliderInit.each(function() {
							$(this).removeAttr('data-ajax-slider-init');
							let slider = $(this).find(".splide")[0];
							let splide = new Splide(slider);
							splide.mount();
							splide.destroy();
						})
					}
				
					_this.spoilerInit = _this.$block.hasClass('spoiler-init') ? _this.$block : _this.$block.find('.spoiler-init');
					if (_this.spoilerInit.length) {
						_this.spoilerInit.each(function() {
							$(this).removeClass('spoiler-init');
						})
					}
				};
				this.extenSettingFinish = function(){
					let _this = this;
					if (_this.dataSliderInit.length) {
						_this.dataSliderInit.each(function() {
							$(this).attr('data-ajax-slider-init', 'true');
							$(this).find('.splide.is-active').removeClass('.is-active');
						})
					}
					if (_this.spoilerInit.length) {
						_this.spoilerInit.each(function() {
							$(this).addClass('spoiler-init');
						})
					}
					setTimeout(() => {
						lpc_template.queue.spoilerBlock(_this.$block);
						_this.setAjaxSlider(_this.$block);
						setTimeout(() => {
							lpc_template.queue.lg(_this.$block);
						}, 300);
					}, 300);
		
				};
				this.setAjaxSlider = function() {
					
					let _this = this;
					let $block = _this.$block.attr('data-ajax-slider-init') ? _this.$block : _this.$block.find('[data-ajax-slider-init]');
					if ($block.length) {
			
						if ($block.data('slider-thumb-init') != true) {
							$block.each(function() {
								let $this = $(this);
								let $alignItem = $this.find($this.data('align-item'));
								let mediaGap = $this.data('margin');
								let mediaPerPage = $(this).data('count');
								if ($(this).data('move')) {
									var $mediaMove = $(this).data('move');
			
								} else {
									var $mediaMove = 1;
								}
								
								if ($this.find('.splide').not('.is-active').length != 0) {
									let splide = new Splide($this.find('.splide').not('.is-active')[0], {
										autoplay: $this.data('autoplay'),
										speed: $this.data('speed'),
										interval: $this.data('pause'),
										/*rewind: $this.data('infinite'),*/
										lazyLoad: $this.data('lazy-load'),
										rewind: true,
										perMove: $mediaMove,
										perPage: checkInitPerPage()
									});
			
			
									splide.mount();
			
									sliderBreakPoints();
			
									document.addEventListener('lpcPopupOpened', function() {
										splide.refresh();
									});
			
									document.addEventListener('dataMediaSourceChange', sliderBreakPoints);
			
									function sliderBreakPoints() {
										let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
			
										setTimeout(function() {
											if ($alignItem.length) {
												let itemHeight = $alignItem.outerHeight() / 2;
												let arrowsPosition = itemHeight + $alignItem.position().top;
			
												$this.find('.splide__arrow').css('top', arrowsPosition);
											}
										}, 100);
			
										switch (dataMediaSource) {
											case 'media-xl':
												splide.options = {
													arrows: true,
													pagination: true,
													gap: mediaGap[0],
													perPage: mediaPerPage[0],
												};
			
												break;
											case 'media-lg':
												splide.options = {
													arrows: true,
													pagination: true,
													gap: mediaGap[1],
													perPage: mediaPerPage[1],
												};
			
												break;
											case 'media-md':
												splide.options = {
													arrows: true,
													pagination: true,
													gap: mediaGap[2],
													perPage: mediaPerPage[2],
												};
			
												break;
											case 'media-sm':
												splide.options = {
													arrows: false,
													pagination: true,
													rewindByDrag: true,
													gap: mediaGap[3],
													perPage: mediaPerPage[3],
												};
			
												break;
											case 'media-xs':
												splide.options = {
													arrows: false,
													pagination: true,
													rewindByDrag: true,
													gap: mediaGap[4],
													perPage: mediaPerPage[4],
												};
			
												break;
										}
									};
			
									function checkInitPerPage() {
										let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
			
										switch (dataMediaSource) {
											case 'media-xl':
												return mediaPerPage[0]
												break;
											case 'media-lg':
												return mediaPerPage[1]
												break;
											case 'media-md':
												return mediaPerPage[2]
												break;
											case 'media-sm':
												return mediaPerPage[3]
												break;
											case 'media-xs':
												return mediaPerPage[4]
												break;
										};
									};
			
									//sliderObjectItems[splide.root.id] = splide;
								}
							});
						}
					}
				};
				this.getCompare = function() {
					var popup_data;
					
					if (shop2.my.gr_new_notification) {
						var compare_arrow = '<i class="gr-mask-icon"><svg class="gr-svg-icon"><use xlink:href="#icon_shop_notify_arr"></use></svg></i>';
					} else {
						var compare_arrow = '<i><svg class="gr-svg-icon"><use xlink:href="#icon_shop_notify_arr"></use></svg></i>';
					}
					
					if (shop2.my.gr_popup_compare) {
						popup_data = ' data-remodal-target="compare-preview-popup"';
					};
					
					let $document = $(document);
					
					if (shop2.my.gr_new_notification) {
						var compareBtn = '<a href="' + shop2.uri + '/compare" class="go-to-compare-btn gr-compare-tooltip-btn"'+popup_data+' target="_blank">'+ _s3Lang.SHOP2_ADD_TO_COMPARE3 +' '+compare_arrow+'</a>';
					  	var compareBtn2 = '<a href="' + shop2.uri + '/compare" class="go-to-compare-btn gr-compare-tooltip-btn"'+popup_data+' target="_blank">'+ _s3Lang.SHOP2_GO_TO_COMPARE +' '+compare_arrow+'</a>';
				
					} else {
						var compareBtn = '<a href="' + shop2.uri + '/compare" class="go-to-compare-btn"'+popup_data+' target="_blank">'+ _s3Lang.SHOP2_ADD_TO_COMPARE3 +' '+compare_arrow+'</a>';
					  	var compareBtn2 = '<a href="' + shop2.uri + '/compare" class="go-to-compare-btn"'+popup_data+' target="_blank">'+ _s3Lang.SHOP2_GO_TO_COMPARE +' '+compare_arrow+'</a>';
				
					}
					
					function update(el, res) {
						
						if (shop2.my.gr_new_notification) {
							var $form = $(el).closest('form');
							var $image = $form.find('.gr-product-image--js');
							var isAdded = $(el).closest('.lpc-product-compare ').hasClass('product-compare--added');
						}
						
						$('input[type=checkbox][value=' + el.val() + ']').closest('.lpc-product-compare').replaceWith(res.data);
						$('input[type=checkbox][value=' + el.val() + ']').closest('.product-compare').addClass('lpc-product-compare lp-header-text-3').removeClass('product-compare');
						$('input[type=checkbox][value=' + el.val() + ']').closest('.gr-compare-checkbox').addClass('lpc-product-compare__checkbox').prepend('<i class="lpc-product-compare__icon"></i>');
						$('input[type=checkbox][value=' + el.val() + ']').closest('.gr-compare-plus').addClass('lpc-compare-plus').prepend('<i class="lpc-product-compare__icon"></i>');
						
						
						//$('.lpc-product-compare-added a span').html(res.count);
						//$('.gr-compare-btn .gr-compare-btn-amount').html(res.count);
						$('.gr-compare-btn .gr-compare-btn-amount').html(res.count);	
						
						if (+$('.gr-compare-btn .gr-compare-btn-amount').text() == '0') {
							$('.gr-compare-btn').removeClass('active');
						} else {
							$('.gr-compare-btn').addClass('active');
						};
						
						if (!$('.compare-remodal').hasClass('remodal-is-opened')) {
							if (shop2.my.gr_new_notification) {
								if (!isAdded) {
									shop2.popupNotification({
									    "itemContent": '<span class="gr-compare-tooltip-counter">'+res.count+'</span>' + ' '+ _s3Lang.SHOP2_PRODUCT_ADDED +' ' + compareBtn, 
									    "itemClass": "gr-notification__item--compare",
									    "itemImage": shop2.my.gr_hide_msg_image ? false : true,
									    "itemSrc": $image.find('img').attr('src'),
									    "itemHref": $image.attr('href'),
									    "itemContain": $image.data('image-view'),
									    "itemSize": $image.data('image-size'),
									});
								};
							} else {
								shop2.msg('<span class="go-to-compare-count">'+res.count+'</span>' + ' '+ _s3Lang.SHOP2_PRODUCT_ADDED +' ' + compareBtn, $('body'));
							}
						};
				
						if (res.panel) {
							$('#shop2-panel').replaceWith(res.panel);
						};
					}
				
					$document.on('click', '.lpc-product-compare input:checkbox', function(d) {
						
						let $this = $(this),
							action = $this.attr('checked') ? 'del' : 'add';
							
							if (shop2.my.gr_new_notification) {
								var $form = $($this).closest('form');
								var $image = $form.find('.gr-product-image--js');
							}
							
						lpc_template.queue.lpcCompare.action(action, $this.val(), function(res, status) {
							if (status == 'success') {
								if (res.errstr) {
									if (!$('.compare-remodal').hasClass('remodal-is-opened')) {
										if (shop2.my.gr_new_notification) {
						
											shop2.popupNotification({
											    "itemContent": res.errstr + '<div class="go-to-compare-error">'+compareBtn2+'</div>', 
											    "itemClass": "gr-notification__item--compare",
											    "itemImage": shop2.my.gr_hide_msg_image ? false : true,
											    "itemSrc": $image.find('img').attr('src'),
											    "itemHref": $image.attr('href'),
											    "itemContain": $image.data('image-view'),
											    "itemSize": $image.data('image-size'),
											});
										} else {
											shop2.msg(res.errstr + '<div class="go-to-compare-error">'+compareBtn2+'</div>', $('body'));
										}
									}
									$this.prop('checked', false);
								} else {
									update($this, res);
									
									if (action == 'del' && !$('.compare-remodal').hasClass('remodal-is-opened')) {
										if (shop2.my.gr_new_notification) {
						
											shop2.popupNotification({
											    "itemContent": _s3Lang.SHOP2_PRODUCT_REMOVED_COMPARE, 
											    "itemClass": "gr-notification__item--compare",
											    "itemImage": shop2.my.gr_hide_msg_image ? false : true,
											    "itemSrc": $image.find('img').attr('src'),
											    "itemHref": $image.attr('href'),
											    "itemContain": $image.data('image-view'),
											    "itemSize": $image.data('image-size'),
											});
										} else {
											shop2.msg(_s3Lang.SHOP2_PRODUCT_REMOVED_COMPARE, $('body'));
										}
									}
									if (d.panel) {
										$('#shop2-panel').replaceWith(d.panel);
									}
								}
							}
							//$('.gr-compare-btn .gr-compare-btn-amount').html(res.count);
						});
					});
				}
				
				this.receivingDataPopup = function() {
					var _this = this;
					let $blockList = _this.$block.find('.lpc-query-products');
					let optionLpcDecorPopup = {};
					
					optionLpcDecorPopup['lpc_product_show_options'] = $blockList.attr('data-lpc-product-show-options');
					optionLpcDecorPopup['lpc_product_on_lg'] = $blockList.attr('data-lpc-product-on-lg');
					optionLpcDecorPopup['lpc_product_vendor'] = $blockList.attr('data-lpc-product-vendor');
					optionLpcDecorPopup['lpc_product_rating'] = $blockList.attr('data-lpc-product-rating');
					optionLpcDecorPopup['lpc_product_article'] = $blockList.attr('data-lpc-product-article');
					optionLpcDecorPopup['lpc_product_annonce'] = $blockList.attr('data-lpc-product-annonce');
					optionLpcDecorPopup['lpc_product_sale'] = $blockList.attr('data-lpc-product-sale');
					optionLpcDecorPopup['lpc_product_amount_flag'] = $blockList.attr('data-lpc-product-amount-flag');
					optionLpcDecorPopup['lpc_product_amount'] = $blockList.attr('data-lpc-product-amount');
					optionLpcDecorPopup['lpc_product_one_click'] = $blockList.attr('data-lpc-product-one-click');
					optionLpcDecorPopup['lpc_product_img'] = $blockList.attr('data-lpc-product-img');

					
					$(document).on('click', '.lpc-shop-lot__quick-trigger', function(e) {
						if(_this.$block.attr('id') == $(this).closest('.lpc-shop-lot').attr('id')){
							var $parentBlock = $(this).closest('.lpc-shop-lot'),
								$popupBody = $parentBlock.find(".lpc-shop-lot__popup-body"),
								$popupFixPanel = $parentBlock.find(".lpc-shop-lot__popup-fix-panel");
								
							e.preventDefault();
	
							let $this = this;
							var url = $(this).attr("data-url") || $this.attr("href");
								url += '?&products_only=1';
								url += '?&lpc_product_card_popup=1';
							
							$.ajax({
								url: url,
								data: {
									'option_decor_popup': JSON.stringify(optionLpcDecorPopup),
								},
								success: function(response) {
									// 1935. 07.04.2025. Обрезаю все теги скриптов в ответе аякс запроса. Сделано это чтобы исключить дублирование ЖП.
									//$popupBody.html(response);
									const cleanedHtml = response.replace(/(<script[^>]*>[\s\S]*?shop2\.quickRefs[\s\S]*?<\/script>)|<script[^>]*>[\s\S]*?<\/script>/gi, '$1');
									$popupBody.html(cleanedHtml);
								},
								// success
							
								complete: function() {
									var $blockWidth = $('.lpc-shop-lot:not(._not-data)').width();
									var $priceClone = $parentBlock.find(".lpc-product-additional__top").find(".lpc-lot-popup__price-inner")
									var $buyBtnClone = $parentBlock.find(".lpc-product-additional__top").find(".lpc-lot-popup-btns");
									 
									$("html").addClass('lpc-shop-popup-scroll');
									
									setTimeout(function() {
										$('.lpc-lot-popup').css('max-width',$blockWidth);
									}, 1);
									
									
									$(window).on("resize", function () {
										var $blockWidth = $('.lpc-shop-lot').width();
										$('.lpc-lot-popup').css('max-width',$blockWidth);
									}).trigger("resize");
		
								
									setTimeout(function() {
										lpc_template.queue.sliderBlockThumbGallery($('body'));
									}, 200); 
									
									$parentBlock.find('.lpc-favorite-btn').on('click', function(){
										$(this).find("a").addClass("lp-header-text-3");
									});
									
									setTimeout(function() {
										if ($popupFixPanel.find('.lpc-lot-popup__price-inner').length == 0) {
											$priceClone.clone().appendTo($popupFixPanel);
											$buyBtnClone.clone().appendTo($popupFixPanel);
										}
									}, 200);
									
									var $sliderItemsLength = $parentBlock.find('.lpc-lot-popup-slider__thumb').length,
										$sliderArrowHideCountXl = $parentBlock.find('.lpc-lot-popup-slider__thumbs').data('count-hide-xl'),
										$sliderArrowHideCountLg = $parentBlock.find('.lpc-lot-popup-slider__thumbs').data('count-hide-lg');
										
									if($sliderItemsLength < $sliderArrowHideCountXl) {
										$parentBlock.find('.lpc-lot-popup-slider__thumbs-body').addClass('xl-not-arrow');
									}
									if($sliderItemsLength < $sliderArrowHideCountLg) {
										$parentBlock.find('.lpc-lot-popup-slider__thumbs-body').addClass('lg-not-arrow');
									}
									
									setTimeout(function() {
										lpc_template.queue.lgNew($('body'));
									}, 100);
									
									/*$('.lpc-shop-lot__popup .lpc-options-more').each(function(){
										$(this).on('click', function(){
											$(this).toggleClass('active');
											$(this).siblings('.lpc-options-container').slideToggle();
										});
									});*/
									
									lpc_template.queue.fixingPanelShow($('body'));
								}//complete
							});
							setTimeout(function() {
								$parentBlock.find(".lpc-shop-lot__popup").addClass('active');
							}, 50);
						}
					});
					$('.lpc-shop-lot__popup-back, .lpc-shop-lot__popup-close').on('click', function(){
						$(".lpc-shop-lot__popup").removeClass('active');
						
						$(this).closest('.lpc-shop-lot__popup').find(".lpc-lot-popup").html("");
						$('.lpc-shop-lot__popup-fix-panel').find('div').remove();
						$("html").removeClass('lpc-shop-popup-scroll');
					});
				};
            }
            
			getProducts() {
				let _this = this;
				let folderId = _this.$block.find('.block-id-folder').text();
				// Формируем URL для GET-запроса
				dataOptionOption.param.search.folder_id = folderId;
				var url = '/-/x-api/v1/public/?method=shop2/getProductsBySearch';
				
				if( typeof callBack.beforeAjax == 'function'){
					callBack.beforeAjax(_this);
				}
			
				if (folderId == 'not_found') {
					return;
				}else{
					$.ajax({
						url: url,
						dataType: "JSON",
						data: dataOptionOption,
				
						success: function(response) {
							if (response.result.success) {
								_this.response = response;
								_this.$block.find('.lpc_product_not_found_vv').removeClass('show');
				
								var dataHTML = response.result.html;
								
								
								let containerProductForTemplate = _this.$block.find(`.containerProductForTemplate`);
							 
								if (!response.result.html) {
									containerProductForTemplate.closest('.lpc-block').addClass("_not-data");
									
									return false;
								};
								
								containerProductForTemplate.removeAttr('style');
								containerProductForTemplate.html(dataHTML);
								
							}
						}, // success
				
						complete: function() {
							if( typeof callBack.complete == 'function'){
								callBack.complete(_this);
							}
						} //complete
					});
				}
			}
            changeFolder(folderId) {
                let _this = this;
                _this.$block.find('.block-id-folder').text(folderId).addClass('modified modified-text');
        
                _this.getProducts();
            }
            
            createSelect() {
                var _this = this;
                /*parent wraper */
                let containerFolder = _this.$block.find(`.lpc-select-folder-container`); // mainContainer
        
        
                let queryFolder = containerFolder.find(`.lpc-query-folder`); // Logic query
                let selectFolder = queryFolder.find('.lpc-query-folder__select');
                /*parent wraper */
        
                let folderInputSelected = queryFolder.find('.lpc-query-folder__input'); /* preview BTN */
        
                let folderId = queryFolder.attr('data-folder_id');
        
                let selectFolderBody = queryFolder.find('.lpc-query-folder__body'); /* option BOdy */
        
                let flagLoadFolder = 0;
        
                async function fetchAndCreateSelect() {
                    try {
                        // Создаем параметры запроса
                        let params = new URLSearchParams();
                        params.append('param[type]', 'shop2');
                        params.append('param[depth]', '99');
        
                        // Формируем URL для GET-запроса
                        let url = '/-/x-api/v1/public/?method=folder/getTree&' + params.toString();
        
                        // Отправляем GET-запрос с использованием fetch
                        let response = await fetch(url, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        
                        if (!response.ok) {
                            throw new Error('Ошибка при выполнении запроса');
                        }
        
                        let data = await response.json();
                        
                        if (data.result.success) {
                            let items = data.result.items;
                            
                            // Нет категории магазина
                            if (!items.length) {
                                queryFolder.addClass('lpc-shop-not-found');
                                return false;
                            }
        
                            items.shift(); // удаляет первую категорию
                            // Создаем варианты (option) выпадающего списка и добавляем их к существующему select
        
                            function createSelector(data) {
                                var rootUL = document.createElement('ul');
                                var levelObject = {};
                                var parentLi = null;
        
                                data.forEach(item => {
                                    var li = document.createElement('li');
                                    var div = document.createElement('div');
                                    div.className = 'lpc-query-folder__option lpc-query__option';
                                    div.setAttribute('data-folder_id', item.folder_id);
        
                                    var span = document.createElement('span');
        
                                    function decodeHtmlEntities(input) {
                                        var doc = new DOMParser().parseFromString(input, "text/html");
                                        return doc.documentElement.textContent;
                                    }
                                    span.textContent = decodeHtmlEntities(item.folder_name);
                                    div.title = decodeHtmlEntities(item.folder_name);
        
                                    var i = document.createElement('i');
                                    i.textContent = `(${item.items})`;
        
                                    div.appendChild(span);
                                    div.appendChild(i);
                                    li.appendChild(div);
        
                                    let level = Number(item._level);
        
                                    if (level == 1) {
                                        rootUL.appendChild(li);
                                        parentLi = li;
                                        levelObject = {};
                                    } else {
                                        if (!levelObject[level]) {
                                            levelObject[level] = document.createElement('ul');
                                            parentLi.appendChild(levelObject[level]);
                                        }
                                        levelObject[level].appendChild(li);
                                        parentLi = li;
                                    }
        
                                    if (folderId && folderId == item.folder_id) {
                                        folderInputSelected.find('span').text(
                                            $(div)
                                            .addClass('selected active')
                                            .find('span')
                                            .text()
                                        );
                                        //$( div ).addClass('active');
                                    }
                                });
        
                                return rootUL;
                            }
                            selectFolderBody.append(createSelector(items));
        
                            var itemOption = selectFolderBody.find('.lpc-query__option');
        
                            selectFolderBody.find('.search-folder-input').on('input', function() {
                                var value = $(this).val();
                                var searchText = value.toLowerCase();
        
                                for (var i = 0; i < itemOption.length; i++) {
                                    var $this = $(itemOption[i]);
        
                                    if (value) {
                                        $this.removeClass('unfiltered');
                                    }
        
                                    var title = $this.attr('title').toLowerCase();
        
                                    if (title.includes(searchText)) {
                                        $this.removeClass('unfiltered');
                                    } else {
                                        $this.addClass('unfiltered');
                                    }
                                }
                            })
        
                            return true;
                        }
                    } catch (error) {
                        console.error('Ошибка при выполнении запроса:', error);
                        return false;
                    }
                }
        
                async function loadSelectedOption() {
                    let awaitCreateSelect = await fetchAndCreateSelect(); // Ждем выполнения
        
                    if (awaitCreateSelect) {
                        queryFolder
                            .removeClass('load')
                            .addClass('loaded');
        
                        folderInputSelected.on('click', function(e) {
                            selectFolder.toggleClass("open");
                        });
                        let queryFolderOption = queryFolder.find('.lpc-query-folder__option'); /* option select */
        
                        queryFolderOption.on('click', function(e) {
                            let $this = $(this);
                            let folderId = $this.data('folder_id');
                            queryFolderOption.removeClass('active');
                            $this
                                .addClass('active')
                                .siblings()
                                .removeClass('active');
                            folderInputSelected.find('span').text($this.find('span').text());
                            selectFolder.toggleClass("open");
        
                            _this.changeFolder(folderId);
        
                            if (!flagLoadFolder) {
                                queryFolder.addClass('folder-selected')
                            }
        
                        });
                    }
                }
                loadSelectedOption();
            }
        };
        if( typeof jquery_block != 'undefined' ){
            var getProductDataLpcCLass = new createBLockProduct(jquery_block);
                  
            if (s3LP.is_cms) {
                getProductDataLpcCLass.createSelect();
            }
            
            getProductDataLpcCLass.getProducts();

			return getProductDataLpcCLass;
        }
    };
    
    lpc_template.queue.lpcWrapText = function ($self) {
		var $block = $self.hasClass('js-wrap-text') ? $self : $self.find('.js-wrap-text');
		if($block.length) {
			//$block.each(function(){
			function syncFontSize() {
			  const bigText = document.querySelector('.lpc-text-10-big-text-body');
			  const wrap = document.querySelector('.js-wrap-text');
			
			  if (bigText && wrap) {
			    const style = window.getComputedStyle(bigText);
			    wrap.style.fontSize = style.fontSize;
			  }
			}
			
			// Первичная синхронизация
			syncFontSize();
			
			// Синхронизация при ресайзе
			window.addEventListener('resize', syncFontSize);
			
			// По желанию — можно добавить наблюдатель, если font-size меняется через классы/медиа
			const observer = new MutationObserver(syncFontSize);
			observer.observe(document.querySelector('.lpc-text-10-big-text-body'), {
			  attributes: true,
			  attributeFilter: ['style', 'class']
			});
			//})
		}
	}
    
    lpc_template.queue.updatedContacts = function ($self) {
	    let $blocks = $self.find('.lpc_updated_init');
	    
	    if ($blocks.length) {
	        $blocks.each(function () {
	            let $block = $(this);
	            let $phones = $block.find('.lpc_phone');
	            
	            $phones.each(function () {
	                let $phone = $(this);
	                let $nextButtons = $phone.nextUntil('.lpc_phone, :not(.lpc_button.hidden_text)').filter('.lpc_button.hidden_text');
	               
	                if ($nextButtons.length) {
	                	let $wrapper = $('<div class="lpc-updated-contacts__item-wrap"></div>');
	                	
	                    $nextButtons.each(function () {
	                        $(this).css({marginTop: '0'}); 
	                         $wrapper.append($(this));
	                    });
	                    
	                    $phone.append($wrapper);
	                }
	                
	                let $itemBox = $phone.find('.lpc-updated-contacts__item-box');
	              
	                if ($itemBox.length) {
	                    $itemBox.css('margin-right', '10px');
	                }
	            });
	        });
	    }
	};
	
	
	lpc_template.queue.refreshForm = function ($self) {
	    
	    const $refreshButton = $('.lpc-refresh-form');
	    if (!$refreshButton.length) return;
	
	    $refreshButton.each(function () {
	        const $button = $(this);
	
	        const href = $button.attr('href');
	        if (!href) return;
	        
	        const popupMatch = href.match(/popup:_lp_block_(\d+)/);
	        if (!popupMatch) return;
	
	        const popupId = popupMatch[1];
	        const $popupElement = $(`[data-block-id="${popupId}"]`);
	        if (!$popupElement.length) return;
	
	        const $form = $popupElement.find('.lp-form-tpl');
	        if (!$form.length) {
	            console.warn('Форма не найдена внутри попапа');
	            return;
	        }
	
	        const apiUrl = $form.attr('data-lpc-api-url');
	        if (!apiUrl) {
	            console.warn('API URL не найден у формы');
	            return;
	        }
	
	        const $successBlock = $popupElement.find('.hide-on-success');
	        let $successClone = null;
	        if ($successBlock.length) {
	            $successClone = $successBlock.clone(true);
	        }
	
	        $button.off('click.refreshForm').on('click.refreshForm', function (e) {
	            e.preventDefault();
	
	            const isFormSubmitted = $popupElement.find('.lp-form-tpl__success').length > 0;
	            
	            if (!isFormSubmitted) return;
	
	            const $formOld = $popupElement.find('.lp-form-tpl');
	            const $productBlock = $button.closest('.lpc-product-name');
        		const prodName = $productBlock.find('[data-name-product]').data('name-product') || '';
	
	            $.ajax({
	                url: apiUrl,
	                dataType: 'json',
	                success: function (response) {
	                    if (!response.result.error) {
	                        const htmlForm = response.result.html;
	                        const $tempContainer = $('<div>').append($.parseHTML(htmlForm));
	                        const $newFormTpl = $tempContainer.find('.lp-form-tpl');
	
	                        if (!$newFormTpl.length) return;
	
	                        $formOld.replaceWith($newFormTpl);
	                        
	                        $newFormTpl.find('.lp-form-tpl__title-wrapper').remove();
	
	                        if ($successClone && $popupElement.find('.hide-on-success').length === 0) {
	                            $newFormTpl.before($successClone);
	                        }
	
	                        s3LP.initForms($(`#_lp_block_${popupId}`));
	                        
	                        setTimeout(function () {
	                            const $newForm = $popupElement.find('.lp-form-tpl');
	                            const $targetInput = $newForm.find('input[data-alias="product_name"]');
	
	                            if (prodName && $targetInput.length) {
	                                $targetInput.val(prodName);
	                            } else {
	                                console.warn('Имя товара или поле не найдено');
	                            }
	                        }, 100);
	
	                    } else {
	                        console.warn('Ошибка в ответе сервера:', response.result.message);
	                    }
	                },
	                error: function (xhr, status, error) {
	                    console.error('Ошибка при получении формы:', status, error);
	                }
	            });
	        });
	    });
	};

	  
	lpc_template.queue.folderBlock = function ($self) {

		class folderMenuBlock {
			constructor($self) {
				var _this = this;
				this.$block = $self;
				this.items = null,
				this.itemsFolderId = this.$block.find('.items-folder-id');
				this.queryFolder = this.$block.find(`.lpc-query-folder`); // Logic query
				this.selectFolder = this.queryFolder.find('.lpc-query-folder__select');
				this.prefixFirstItem = "first_";
				this.stopWord = 'top-levels';
				
				this.firstItem = null;
				this.arrayItemsFolder = null;
				if (_this.itemsFolderId.text() && _this.itemsFolderId.text() != 'not_found') {
					this.arrayItemsFolder = this.itemsFolderId.text().split(',');
					if (/^[A-Za-z]/.test(this.arrayItemsFolder[0])) {
						this.firstItem = this.arrayItemsFolder[0].replace(new RegExp("^" + this.prefixFirstItem), "");
					}
				}
				this.helperFunction = {
					selectOpen() {
						_this.queryFolder
							.find('.lpc-query-folder__input')
							.on('click', function (e) {
								_this.selectFolder.toggleClass("open");
							});
					}
				}
				this.eventHandler = {
					selected(e) {
	
					},
				}
				this.createSelectOption = async function () {
					_this.items = await _this.getFolderFetch(() => { // get ITEMS and callback
						_this.queryFolder.addClass('lpc-shop-not-found');
					});
					let dropDownList = _this.dropDownListHtml(_this.items);
	
					_this.queryFolder
						.removeClass('load')
						.addClass('loaded')
						.find('.lpc-query-folder__body')
						.append(dropDownList);
	
					let allUl = $(dropDownList).find('ul');
					let counterItem = function (elem) {
						$(elem).each(function (i, el) {
							let $this = $(this);
							let $li = $this.children('li');
							let $div = $this.prev();
	
							$div.append(`<i>(${$li.length})</i>`);
						});
					}
					counterItem(dropDownList);
					counterItem(allUl);
					return true;
				}
			}
			createButton() { // создания кнопок
				let $list = this.$block.find('.lpc-folder-menu-horizontal__list');
	
				let lpcMenuView = $list.attr('data-lpc-menu-view');
				let lpcButtons = $list.attr('data-lpc-buttons');
				let itemsFolder = this.itemsFolderId.text().split(',');
				$list.find('.lpc-row-button').addClass('show');
				if( itemsFolder.length < 12 ) {$list.find('.lpc-row-button').removeClass('show')}
				let lpcRowButtonClone = $list.find('.lpc-row-button').clone();
				$list.find('.lpc-row-button').remove()
				
				this.itemsFolder_length = itemsFolder.length;
	
				let templatesContainer = '';
				this.items.forEach(item => {
	
					for (let i = 0; i < itemsFolder.length; i++) {
						if (itemsFolder[i] == item.folder_id) {
	
							let link = '/' + item.alias;
	
							let name = item.folder_name;
							let template = `<li class="lpc-folder-menu-horizontal__item ${lpcMenuView}" data-lp-selector=".lpc-folder-menu-horizontal__item" data-elem-type="container">
								  <a class="lpc-folder-menu-horizontal__link lp-button ${lpcButtons}" href="${link}" data-lp-selector=".lpc-folder-menu-horizontal__link" data-elem-type="text">
									  ${name}
									  <span class="lpc-folder-menu-horizontal__arrow" data-elem-type="container" data-lp-selector=".lpc-folder-menu-horizontal__arrow-line">
										  <span class="lpc-folder-menu-horizontal__arrow-line"></span>
										  <span class="lpc-folder-menu-horizontal__arrow-line"></span>
									  </span>
								  </a>
							  </li>`;
							templatesContainer += template;
	
						}
					}
				});
				$list.html(templatesContainer);
				$list.append(lpcRowButtonClone);
	
				if (!this.$block.hasClass('lpc-simple-menu')) {
					this.$block.addClass('lpc-row-menu');
					lpc_template.queue.rowMenu($('body'));
				}
	
			}
			dropDownListHtml(data) {
				var rootUL = document.createElement('ul');
				var levelObject = {};
				var parentLi = null;
				data.shift();
	
				data.forEach(item => {
					var li = document.createElement('li');
					var div = document.createElement('div');
					div.className = 'lpc-query-folder__option lpc-folder-item-div';
					div.setAttribute('data-folder_id', item.folder_id);

					var span = document.createElement('span');
	
					function decodeHtmlEntities(input) {
						var doc = new DOMParser().parseFromString(input, "text/html");
						return doc.documentElement.textContent;
					}
					span.textContent = decodeHtmlEntities(item.folder_name);
					div.title = decodeHtmlEntities(item.folder_name);
	
					//var i = document.createElement('i');
					//i.textContent = `(${item.items})`;
	
					div.appendChild(span);
					//div.appendChild(i);
					li.appendChild(div);
	
	
					let level = Number(item._level);
	
					if (level == 1) {
						li.classList.add('first-level')
						rootUL.appendChild(li);
						parentLi = li;
						levelObject = {};
					} else {
						if (!levelObject[level]) {
							levelObject[level] = document.createElement('ul');
							parentLi.appendChild(levelObject[level]);
							parentLi.classList.add('hasChild')
						}
						levelObject[level].appendChild(li);
						parentLi = li;
					}
					if (this.firstItem && this.firstItem == item.folder_id) {
	
						div.classList.add('trigger_click');
					} else if (this.firstItem && this.firstItem == this.stopWord) {
						this.queryFolder.find('.all-folders').addClass('trigger_click');
					}
				});
	
				return rootUL;
			}
			async getFolderFetch(notFolder) {
				try {
					// Создаем параметры запроса
					let params = new URLSearchParams();
					params.append('param[type]', 'shop2');
					params.append('param[depth]', 99);
	
					// Формируем URL для GET-запроса
					let url = '/-/x-api/v1/public/?method=folder/getTree&' + params.toString();
	
					// Отправляем GET-запрос с использованием fetch
					let response = await fetch(url, {
						method: 'GET',
						headers: {
							'Content-Type': 'application/json'
						}
					});
	
					if (!response.ok) {
						throw new Error('Ошибка при выполнении запроса');
					}
	
					let data = await response.json();
	
					if (data.result.success) {
						let items = data.result.items;
	
						// Нет категории магазина
						if (!items.length) {
							notFolder();
							return false;
						}
	
						return items;
					}
				} catch (error) {
					console.error('Ошибка при выполнении запроса:', error);
					return false;
				}
			}
			initSelect() {
				let _this = this;
				(async function () {
					_this.helperFunction.selectOpen();
	
					await _this.createSelectOption();
	
					let queryFolderOption = _this.queryFolder.find('.lpc-query-folder__option'); /* option select */
					let folderInputSelected = _this.queryFolder.find('.lpc-query-folder__input'); /* preview BTN */
					let $allLi = _this.queryFolder.find('li');
	
					let flagLoadFolder = 0;
	
					queryFolderOption.on('click', function (e, trig=false) {
						queryFolderOption.removeClass('choose').removeClass('opted');
						$allLi.removeClass('active');
	
						let $this = $(this);
						let $li = $this.closest('li');
						let $ul = $li.children('ul');
	
						$this.addClass('opted');
	
	
						folderInputSelected.find('span').text(
							$this.find('span').text()
						);
	
						$li.addClass('active');
	
						$li.parents('.hasChild').addClass('active');
	
	
						var $firstLevel = _this.queryFolder.find('.first-level')
	
						let $option = $ul.children('li').children('.lpc-query-folder__option');
						let firstItem = '';
						if ($this.hasClass('all-folders')) {
							$option = $firstLevel.find(' > .lpc-query-folder__option');
							firstItem = _this.stopWord;
						} else {
							firstItem = _this.prefixFirstItem + $this.attr('data-folder_id');
						}
	
						$option.addClass('choose');
	
	
						let srtBlock = '';
						let len = $option.length - 1;
	
						$option.each(function (index) {
							let last = ',';
	
							if (index == len) {
								last = '';
							}
							if (index == 0) {
								srtBlock += firstItem + ',';
							}
							srtBlock += $(this).attr('data-folder_id') + last;
						});
	
						_this.itemsFolderId
							.text(srtBlock)
							.addClass('modified modified-text');
	
						_this.createButton();
	
						if(!flagLoadFolder) {
							_this.queryFolder.addClass('folder-selected');
							flagLoadFolder = 1;
						}
	
						// if( !trig ) {
						// 	_this.selectFolder.toggleClass("open");
						// }
						
					});
	
					if (_this.itemsFolderId.text() && _this.itemsFolderId.text() != 'not_found') {
						_this.createButton();
						_this.queryFolder.find('.trigger_click').removeClass('trigger_click').trigger('click', [true]);
					}
					
				})();
			}
			
			rowMenuItems() {
				let _this = this;
			
				function rowMenuItems() {
					let $this = _this.$block;
					let $menu = $this.find('.lpc-folder-menu-horizontal__list');
					let $toggleButton = $this.find('.lpc-folder-menu-horizontal__more');
		
					let hideText = document.querySelector('html').getAttribute('lang') === 'ru' ? 'Скрыть' : 'Hide';
					let currentText = document.querySelector('html').getAttribute('lang') === 'ru' ? 'Ещё' : 'Show more';
		
					let $insTextButton = $toggleButton.find('ins');
					let $hiddenItems = $menu.find('li:not(.lpc-folder-menu-horizontal__more):hidden');
					
					if ($hiddenItems.length) {
						$toggleButton.addClass('show');
					}
					
					$toggleButton.off('click').on('click', function () {
						$toggleButton.toggleClass('active');
						$menu.toggleClass('lpc-folder-menu-horizontal__list--show-items');
						$insTextButton.text($toggleButton.hasClass('active') ? hideText : currentText);
					});
				}
			
				rowMenuItems();
			
				document.addEventListener('dataMediaSourceChange', rowMenuItems);
			}
			
			init() {
				this.initSelect();
			}
		};

		let $blocks = $self.hasClass('lpc-folder-block') ? $self : $self.find('.lpc-folder-block');

		if ($blocks.length) {

			$blocks.each(function () {
				let $block = $(this);

				if (s3LP.is_cms) {
					setTimeout(()=>{
						var folderBlock = new folderMenuBlock($block);
						folderBlock.init();
					}, 300)
				}else {
					var folderBlock = new folderMenuBlock($block);
					folderBlock.rowMenuItems();
				}
			});
		}
	};

    lpc_template.queue.lpcAjaxProduct = function($self) {
	  
        let $blocks = $self.hasClass('.lpc-ajax-product') ? $self : $self.find('.lpc-ajax-product');
        
        if ($blocks.length) {
        	
            $blocks.each(function() {
                let $block = $(this);
                
                var optionLpcDecor = {};

                optionLpcDecor['columns'] = $block.attr('data-columns');
                optionLpcDecor['block_type'] = $block.attr('data-block-type');
                optionLpcDecor['img_proportions'] = $block.attr('data-img-proportions');
                optionLpcDecor['landing_page_mode'] = $block.attr('data-landing-page-mode');
                optionLpcDecor['card_block'] = $block.attr('data-card-block');
                optionLpcDecor['contain'] = $block.attr('data-contain');
                optionLpcDecor['lpc_no_image'] = $block.attr('data-lpc-no-image');
                optionLpcDecor['product_link_on'] = $block.attr('data-product-link-on');

                var dataQuery = {
                    param: {
                        offset: 0,
                        limit: 100,
                        search: {
                            folder_id: null
                        },
                        mode: 'custom',
                    },
                    custom_products_version: 'lpc_blocks',
                    block_layout: 672708,
                    special_away: '0',
                    option_decor: JSON.stringify(optionLpcDecor),
                };
                
                lpcCreateBlockProducts(
					$block,
					dataQuery, 
					{
						beforeAjax: function(contextObject){
							contextObject.extenSettingBegin();
						},
						complete: function(contextObject){
							
							$block.find('.lpc_product_not_found_vv').removeClass('show');
							
							contextObject.extenSettingFinish();
							
							if(contextObject.response.result.found < 1){
								$block.find('.lpc_product_not_found_vv').addClass('show');
								$block.find('.block-id-folder').text('not_found')
							}
						}
					}
				);

            });
        }
    };
	
	lpc_template.queue.lpcAjaxParamsProduct = function($self) {

		let $blocks = $self.hasClass('.lpc-ajax-params-product') ? $self : $self.find('.lpc-ajax-params-product');
		
		if ($blocks.length) {
			$blocks.each(function() {
				let $block = $(this);


				let optionLpcDecor = {};
				optionLpcDecor['columns'] = $block.attr('data-columns');
				optionLpcDecor['lpc_width'] = $block.attr('data-lpc-width');
				optionLpcDecor['lpc_even'] = $block.attr('data-lpc-even');

                var dataQuery = {
                    param: {
                        offset: 0,
                        limit: 100,
                        search: {
                            folder_id: null
                        },
                        mode: 'custom',
                    },
                    custom_products_version: 'lpc_blocks',
                    block_layout: 30109,
                    special_away: '0',
                    option_decor: JSON.stringify(optionLpcDecor),
                };
				lpcCreateBlockProducts(
					$block,
					dataQuery, 
					{
						complete: function(contextObject){
							
							$block.find('.lpc_product_not_found_vv').removeClass('show');
							

							if(contextObject.response.result.found < 1){
								$block.find('.lpc_product_not_found_vv').addClass('show');
								$block.find('.block-id-folder').text('not_found')
							}
						}
					}
				);
			});
		}
	};

	lpc_template.queue.lpcQueryProduct = function ($self) {
		let $blocks = $self.hasClass('lpc-shop-lot') ? $self : $self.find('.lpc-shop-lot');
		let initCompareFlag = false;
		
		if ($blocks.length) {
			
			/*$(document).on('click', '.lpc-shop-lot__button-buy', function(e){
				e.preventDefault();
				$(this).parent('.lpc-shop-lot-btns').find('.shop-product-btn').click();	
			});*/// триггер кнопки купить
			$(document).on('click', '.lpc-shop-lot__button', function(e) {
	
				var $this = $(this),
					$form = $this.closest('form'),
					form = $form.get(0),
					adds = $form.find('.additional-cart-params'),
					len = adds.length,
					i, el,
					a4 = form.amount.value,
					kind_id = form.kind_id.value;
			
		
					if (shop2.my.gr_new_notification) {
						// Находим картинку товара
						var $image = $form.find('.gr-product-image--js');
					}
				e.preventDefault();
		
				if (len) {
					a4 = {
						amount: a4
					};
		
					for (i = 0; i < len; i += 1) {
						el = adds[i];
						if (el.value) {
							a4[el.name] = el.value;
						}
					}
				}
				
				lpc_template.queue.lpcAddCard.add(kind_id, a4, function(d) {
					$('#shop2-cart-preview').replaceWith(d.data);
					
					var totalCartAmount = +$(d.data).find('.gr-cart-total-amount').text();
					var totalCartSum = $(d.data).find('.gr-cart-total-sum').data('total-price');
					
					if (totalCartAmount>0) {
						$('.head-cart__btn').removeClass('pointer_events_none');
						$('.gr-cart-total-amount').text(totalCartAmount);
						$('.gr-cart-total-sum ins').text(totalCartSum);
					} else{
						$('.mosaic-shop2-cart-preview__total-count').text('0'); // 1935 04.12.2024 внес правку для 140 шаблона. при покупке из попап карточки товара лпц, не обновлялась маленькая корзина 
						$('.gr-cart-total-amount').text('0');
						$('.gr-cart-total-sum ins').text('0');
					};
					
					if (d.errstr) {
						if (shop2.my.gr_new_notification) {
		
							shop2.popupNotification({
								"itemContent": d.errstr, 
								"itemClass": "gr-notification__item--purchase",
							});
						} else {
							shop2.msg(d.errstr, $this);
						}
					} else {
						var $text = window._s3Lang.JS_SHOP2_ADD_CART_WITH_LINK;
						//var $text = $text.replace("</a>", "<i><svg class='gr-svg-icon'><use xlink:href='#icon_shop_notify_arr'></use></svg></i></a>");
						
						if (shop2.my.gr_new_notification) {
		
							// Выводим сообщение пользователю
							/*shop2.popupNotification({
								"itemContent": $text, 
								"itemClass": "gr-notification__item--purchase",
								"itemImage": shop2.my.gr_hide_msg_image ? false : true,
								"itemSrc": $image.find('img').attr('src'),
								"itemHref": $image.data('product-href') || $image.find('a').attr('href'),
								"itemContain": $image.data('image-view'),
								"itemSize": $image.data('image-size'),
							});*/
						} else {
							shop2.msg($text.replace("%s", shop2.uri + "/cart"), $this);
						}
						
						shop2.on('afterCartAddItem', function(res, status) {
					       /* const productPreviewPopup = $('.remodal[data-remodal-id="card-preview-remodal"]');
					        
					        shop2.msg($text.replace("%s", shop2.uri + "/cart"), $this);*/
					    });
					}
		
					if (d.panel) {
						$('#shop2-panel').replaceWith(d.panel);
					};
				});
			});	
			
			$(document).on('click', '.lpc-product-amount-btn.lpc-amount-minus', function() {
		          var $this = $(this),
		              text = $this.siblings('input:text'),
		              value = text.getVal(),
		              amount_min = parseFloat(text.data('min')),
		              multiplicity = parseFloat(text.data('multiplicity'));
		  
		          if (value) {
		              value = value[0];
		          }
		  
		          if (amount_min && value <= amount_min) {
		              return;
		          }
		  
		          value = checkAmount(value, amount_min, multiplicity, -1);
		          
		          if (amount_min > 0) {
		            if (value <= amount_min) {
		                value = amount_min;
		            }
		          } else {
		            if (value <= shop2.options.amountDefaultValue) {
		               value = shop2.options.amountDefaultValue;
		            }
		          }
		          
		          
		          
		          text.val(value);
		          text.trigger('change');
		      });
		      $(document).on('click', '.lpc-product-amount-btn.lpc-amount-plus', function() {
		          var $this = $(this),
		              text = $this.siblings('input:text'),
		              value = text.getVal(),
		              amount_min = parseFloat(text.data('min')),
		              multiplicity = parseFloat(text.data('multiplicity'));
		            
		          if (value) {
		              var value = value[0];
		          }			  
		          
		          var value = checkAmount(value, amount_min, multiplicity, 1);
		          text.val(value);
		          text.trigger('change');
		    });
			function checkAmount(amount, amount_min, multiplicity, sign) {

	          if (multiplicity > 0) {
	              amount += multiplicity * sign;
	          } else {
	              amount += shop2.options.amountDefaultInc * sign;
	          }
	          
	          amount = amount.toFixed(2) - 0;
	
	          return amount
	      	}
			
			$blocks.each(function() {

                let $block = $(this);
                let $blockList = $block.find('.lpc-query-products');
				
				let optionLpcDecor = {};
				optionLpcDecor['block-lot-id'] = $blockList.attr('data-lots-block-id');
				optionLpcDecor['on_lg'] = $blockList.attr('data-on-lg');
				optionLpcDecor['columns'] = $blockList.attr('data-columns');
				optionLpcDecor['block_type'] = $blockList.attr('data-block-type');
				optionLpcDecor['img_proportions'] = $blockList.attr('data-img-proportions');
				optionLpcDecor['landing_page_mode'] = $blockList.attr('data-landing-page-mode');
				optionLpcDecor['card_block'] = $blockList.attr('data-card-block');
				optionLpcDecor['product_mode'] = $blockList.attr('data-product-mode');
				optionLpcDecor['contain'] = $blockList.attr('data-contain');
				optionLpcDecor['lpc_no_image'] = $blockList.attr('data-lpc-no-image');
				optionLpcDecor['lpc_view_show_option'] = $blockList.attr('data-lpc-view-show-options');
				optionLpcDecor['lpc_view_vendor'] = $blockList.attr('data-lpc-view-vendor');
				optionLpcDecor['lpc_view_rating'] = $blockList.attr('data-lpc-view-rating');
				optionLpcDecor['lpc_view_article'] = $blockList.attr('data-lpc-view-article');
				optionLpcDecor['lpc_view_annonce'] = $blockList.attr('data-lpc-view-annonce');
				optionLpcDecor['lpc_view_sale'] = $blockList.attr('data-lpc-view-sale');
				optionLpcDecor['lpc_view_amount_flag'] = $blockList.attr('data-lpc-view-amount-flag');
				optionLpcDecor['lpc_view_buy_btn'] = $blockList.attr('data-lpc-view-buy-btn');
				optionLpcDecor['lpc_view_amount'] = $blockList.attr('data-lpc-view-amount');
				optionLpcDecor['lpc_view_one_click'] = $blockList.attr('data-lpc-view-one-click');


				var dataQuery = {
					param: {
						search: {
							folder_id: null
						},
						mode: 'custom',
						limit: 32
					},
					custom_products_version: 'lpc_blocks',
					block_layout: '134709',
					special_away: '1',
					lpc_lot_products_option: '1',
					'option_decor': JSON.stringify(optionLpcDecor),
				};
				
				
				
				$(document).on('click', '.lpc-options-more', function(){
					if(optionLpcDecor['block-lot-id'] == $(this).closest('.lpc-shop-lot').attr('id')) {
						$(this).toggleClass('active');
						$(this).siblings('.lpc-options-container').slideToggle();
					}
				});
			
				$(document).on('click', '.lpc-shop-lot__image', function(e){
					if(optionLpcDecor['block-lot-id'] == $(this).closest('.lpc-shop-lot').attr('id')) {
						if ($(this).hasClass('lpc-shop-lot__image-transition')) {
							return;
						}
						e.preventDefault();
						$(this).closest('.lpc-shop-lot__inner').find(".lpc-shop-lot__quick-trigger").trigger('click');
					}
				});// клик на картинку
				
				$(document).on('click', '.lpc-product-compare-custom-text', function(e){
					if(optionLpcDecor['block-lot-id'] == $(this).closest('.lpc-shop-lot').attr('id')) {
						$(this).siblings('.lpc-product-compare').trigger('click');	
					}
				});
				

				let observer = new IntersectionObserver((entries, observer) => {
				    entries.forEach(entry => {
				        if (entry.isIntersecting) {
				            // Если для этого блока данные уже загружены, повторно не выполняем запрос
				            if ($block.data('loaded')) return;
				
				            lpcCreateBlockProducts(
				                $block,
				                dataQuery, 
				                {
				                    beforeAjax: function(contextObject) {
				                        contextObject.extenSettingBegin();
				                    },
				                    complete: function(contextObject) {
				
				                        if (!s3LP.is_cms) {
				                            shop2.trigger('afterProductsLazyLoaded');
				                        }
				                        
				                        if (!s3LP.is_cms) {
				                            if (!initCompareFlag) {
				                                contextObject.getCompare($blockList);
				                                initCompareFlag = true;
				                            }
				                        }
				
				                        contextObject.extenSettingFinish();
				
				                        $('.lpc-shop-lot__popup-back, .lpc-shop-lot__popup-close').on('click', function(){
				                            $(".lpc-shop-lot__popup").removeClass('active');
				                            $("html").removeClass('lpc-shop-popup-scroll');
				                        });
				                        
				                        if ($('.lpc-shop-lot__list-check-mobile').length){ 
				                            $(window).on("resize", function () {
				                                setTimeout(function() {
				                                    var mediaTypeCheck = $('.decor-wrap').attr('data-media-source');
				                                    if (mediaTypeCheck == "media-xs") {
				                                        $('.lpc-shop-lot__list-check-mobile').addClass('lpc-card--type-1');
				                                    } else {
				                                        $('.lpc-shop-lot__list-check-mobile').removeClass('lpc-card--type-1');
				                                    }
				                                }, 200);
				                            }).trigger("resize");
				                        }
				                        
				                        $('.lpc-shop-lot__popup .lpc-shop-lot__image').on('click', function(e){
				                            e.preventDefault();
				                        });
				                        
				                        contextObject.receivingDataPopup();
				                    }
				                }
				            );
				
				            // Помечаем блок как загруженный, чтобы избежать повторного запроса
				            $block.data('loaded', true);
				
				            // Прекращаем наблюдение за этим блоком
				            observer.unobserve(entry.target);
				        }
				    });
				}, { rootMargin: "200px 0px", threshold: 0.1 });
				
				// Предполагается, что $block — jQuery-объект, поэтому передаем DOM-элемент:
				observer.observe($block[0]);

			});
		}
	};

	if ($('.s3-preloader').length) {
		s3PreloaderMutation($('.s3-preloader')[0]);
	};
	
	/*lpc_template.queue.newYear = function($self) { // НЕ УДАЛЯТЬ - НГ оформление
		if (!!document.querySelector('#lp_constructor')) {
			let lpcSnow = `<div id="lpc-snow-block" class="sky"></div>`;
			let newYearTpl = `<div class="lpc-new-year">
				<ul class="lpc-new-year__items">
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
				</ul>
				<ul class="lpc-new-year__items">
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li class="first_red_toy"></li>
					<li class="green_toy"></li>
				</ul>
				<ul class="lpc-new-year__items second_items">
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li class="red_toy"></li>
				</ul>
				<ul class="lpc-new-year__items">
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li class="last_green_toy"></li>
				</ul>
				<ul class="lpc-new-year__items">
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
				</ul>
			</div>`;
		
			if (!!document.querySelector('#lp_constructor') && !$('.lpc-new-year__items').length) {
				$('#landing_page_controls').append(newYearTpl);
				//$('#landing_page_site').append(newYearTpl);
				$('#landing_page_controls').append(lpcSnow);

				if (readCookie('lpc_disable_snow') != '1') {
					letItSnow();
				};
			};
		
			let $snow = $('#lpc-snow-block');
			
			const config = {
				attributes: true
			};
		
			const callback = function (mutationsList, observer) {
				
				for (let mutation of mutationsList) {
					if (!$(target).hasClass('hidden')) {
						
						$('#lp_constructor').addClass('opened');
						$snow.appendTo($('#landing_page_controls'));
						
					} else {
						
						$('#lp_constructor').removeClass('opened');
						$snow.appendTo($('#landing_page_site'));
						
					}

					if (!$(target2).is(':hidden')) {
						$('._live._live--lp ._live__header').addClass('hide_live_header');
					} else {
						$('._live._live--lp ._live__header').removeClass('hide_live_header');
					}
				}
			};
		
			let target = document.querySelector('.folders-menu-wrapper');
			let target2 = document.querySelector('.block-css-controls');
		
			const observer = new MutationObserver(callback);
			const observer2 = new MutationObserver(callback);
		
			observer.observe(target, config);
			observer2.observe(target2, config);
		};
	};*/

	
	lpc_template.queue.lpcWatchPreloader = function($self) {
		s3PreloaderMutation($('.decor-wrap')[0]);
	};

	lpc_template.queue.checkBgImg = function ($self) {
		$('.lp-block-bg._photo_avaiable').each(function(){
			var bgWh = $(this).css('background-image');
			
			if(bgWh != "none") {
				$(this).addClass('_there-photo');
			}
		})
	};
  

  	lpc_template.queue.lpcAboutPopupLink  = function($self) {
		
	    document.addEventListener('lpcPopupFormInitDone', function(){
	      $('a[href^="popup:"]').removeClass('lpc_pointer_events_none');
	    });
	};
	
	lpc_template.queue.lpcSharePopupBtn  = function($self) {
		var $block = $self.find('.lpc-share-1');
			
		if ($block.length && $block.find('.lpc-share-1__button').length) {	
				$('.lpc-share-1__button').each(function(){
					var $shareItems = $(this).parents('.lpc-share-1').find(".ya-share2__popup"),
						$sharePopup = $(this).parents('.lpc-share-1').find(".lpc-share-1__popup"),
						$sharePopupParent = $(this).parents('.lpc-share-1').find(".ya-share2_custom"),
						$buttonWidth = $(this).parents('.lpc-share-1').find(".lpc-share-1__button").outerWidth();
						
						
					$shareItems.clone().appendTo($sharePopup);
					$sharePopupParent.css('width', $buttonWidth);
				});
			
			
			$doc.on("click", function (e) {
				if (!$(e.target).closest($('.lpc-share-1__button')).length && !$(e.target).closest($('.ya-share2_custom')).length) {
					$doc.find(".lpc-share-1__popup").removeClass("_opened");
				};
			});
			
			$('.lpc-share-1__button').on('click', function(){
				if($(this).closest('.lpc-share-1__wrap').find('.lpc-share-1__popup').hasClass('_opened')){
					$(this).closest('.lpc-share-1__wrap').find('.lpc-share-1__popup').removeClass('_opened');
					console.log('close');
				}else {
					$('.lpc-share-1__popup._opened').removeClass('_opened');
					$(this).closest('.lpc-share-1__wrap').find('.lpc-share-1__popup').addClass('_opened');
					console.log('open');
				}
				
				var popupHeight = $(this).closest('.lpc-share-1__wrap').find('.ya-share2_custom .ya-share2__popup').height();
			});
		}
	};
	
	lpc_template.queue.lpcAddCard = {
		add: function(kind_id, a4, func) {

		    shop2.trigger('beforeCartAddItem');
		
		    $.post(
		      '/-/shop2-api/?cmd=cartAddItem', {
		        hash: shop2.apiHash.cartAddItem,
		        ver_id: shop2.verId,
		        kind_id: kind_id,
		        amount: a4
		      },
		      function(d, status) {
		        shop2.fire('afterCartAddItemLpc', func, d, status);
		        shop2.trigger('afterCartAddItemLpc', d, status);
		      },
		      'json'
		    );
		}
	};

	
	lpc_template.queue.lpcCompare = {
	    add: function(kind_id, callback) {
	      this.action('add', kind_id, callback);
	    },
	    remove: function(kind_id, callback) {
	      this.action('del', kind_id, callback);
	    },
	    clear: function(callback) {
	      this.action('clear', null, callback);
	    },
	    action: function(action, kind_id, func) {
	
	      var eventName = $.camelCase('Compare-' + action);
	
	      shop2.trigger('before' + eventName);
	
	      $.post(
	        '/-/x-api/v1/public/?method=shop2/compare', {
	        	kind_id,
		        action,
				lpc_block_compare: "1",
	        },
	        function(d, status) {
	          shop2.fire('after' + eventName, func, d.result, status);
	          shop2.trigger('after' + eventName, d.result, status);
	        }
	      );
	    }
	};
	
	lpc_template.queue.menuSimplePopup = function($self) {
		
		var $block = $self.hasClass('js-menu-wrap') ? $self : $self.find('.js-menu-wrap');
		
		$block.each(function(){
			var $this = $(this),
				$topMenuWrap = $this.find('.js-menu__wrap'),
				$menu = $this.find('.js-menu_appedable'),
				$burger = $this.find('.js-burger'),
				$popup = $this.find('.js-popup'),
	    		popupHeight = $(window).height() - $this.height(),
	    		menuHeight = $this.outerHeight(),
	    		popupTop = menuHeight < 0 ? 0 : menuHeight,
	    		popupTop = s3LP.is_cms ? popupTop + 72 : popupTop,
	    		$bgTop = $this.height() + 50 < 0 ? 0 : $this.height() + 50,
	    		$bgTop = s3LP.is_cms ? $bgTop + 72 : $bgTop,
	    		$liHaschild = $this.find('.haschild');
    		
    		$this.find('.lp-menu-block-bg').animate({top: $bgTop}, 400);
	    	
	    	$popup.css('top', popupTop);
	    		
			$menu.clone().prependTo($topMenuWrap);
			
			$(this).append('<div class="lp-menu-block-bg"></div>');
			
			function menuShow() {
		        var $ulWidth = 0,
		            $ulWrapWidth = $this.find('.js-menu__wrap').width();
		
		        $($menu).children('li').each(function(){
		            var $width = $(this).children('a').outerWidth(true);
		            $ulWidth += $width;
		        });
		        
		        if (window.matchMedia('(min-width : 960px)').matches) {
		        	if ($ulWidth < $ulWrapWidth) {
		        		$this.find('.js-menu__wrap').addClass('show');
		        		$this.find('.js-burger').hide();
		        	}
		        	else {
		        		$this.find('.js-menu__wrap').removeClass('show');
		        		$this.find('.js-burger').show();
		        	}
		        } else if (window.matchMedia('(max-width : 959px)').matches && $menu.find('li').length == 0) {
					$this.find('.js-menu__wrap').addClass('show');
				    $this.find('.js-burger').hide();
					
				} else if (window.matchMedia('(max-width : 959px)').matches) {
		    		$this.find('.js-menu__wrap').removeClass('show');
		    		$this.find('.js-burger').show();
		        }
		        
		        var $bgTop = $this.offset().top + $this.height();
		        
		        menuHeight = $this.outerHeight(),
	    		popupTop = menuHeight < 0 ? 0 : menuHeight,
	    		popupTop = s3LP.is_cms ? popupTop + 72 : popupTop,
	    		$bgTop = $this.height() < 0 ? 0 : $this.height(),
	    		$bgTop = s3LP.is_cms ? $bgTop + 72 : $bgTop;
	    		
	    		$this.find('.lp-menu-block-bg').animate({top: $bgTop}, 400);
	    		
    			$popup.css('top', popupTop);
	    		
	    		$this.find('.lp-menu-block-bg').css('top', $bgTop);
			}
			
		    $(window).on('resize', function(){
		    	
	    		setTimeout(function(){
					menuShow();
	    		},500);
	    		
		    }).trigger('resize');
		
		    $burger.on('click', function(){
		    	$menu.find('li a').addClass('menu-popup-item-custom');
		    	if ($(this).hasClass('_in-side')) {
		    		$popup.animate({top: 0}, 400);
		    		$this.find('.lp-menu-block-bg').css('top', 0);
		    	}
		    	if (!$(this).hasClass('_in-side')) {
			    	if (s3LP.is_cms) {
			    		$('html, body').animate({
						    scrollTop: $this.offset().top - 72
						}, 100);
			    	}
			    	else {
			    		$('html, body').animate({
						    scrollTop: $this.offset().top
						}, 100);
			    	}
		    	}
		    	
		    	$popup.find('.js-popup__inner').css({
		    		'overflow' : 'auto',
		    		'max-height' : '100%'
		    	});
		    	
		    	$burger.toggleClass('opened');
		    	if ($popup.hasClass('opened')) {
		    		$popup.animate({height: "0%"}, {duration: 800, complete: function() {$this.css('z-index', '')}}).removeClass('opened');
		    		$this.find('.lp-menu-block-bg').fadeOut(600);
		    		
		    		$('html').css('overflow', '');
		    	}
		    	else {
		    		$popup.animate({height: popupHeight}, {duration: 800}).addClass('opened');
		    		$this.find('.lp-menu-block-bg').fadeIn(600);
		    		$this.css('z-index', '999')
		    		$('html').css('overflow', 'hidden');
		    	}
		    });
	    	
		    $this.find('.haschild').on('click', function(e){
		    	e.stopPropagation();
		    	$(this).toggleClass('_open').children('ul').slideToggle();
		    });
		    
		    $popup.find('.js-menu_appedable').on('click', 'a', function(){
		    	$burger.toggleClass('opened');
		    	$popup.animate({height: "0%"}, 800).removeClass('opened');
	    		$this.find('.lp-menu-block-bg').fadeOut(600);
	    		$this.css('z-index', '');
	    		$('html').css('overflow', '');
		    });	
		    
		    if (s3LP.is_cms && typeof LpController !== 'undefined') {
				setTimeout(function(){
					LpController.afterSave(function () {
						menuShow();
						setTimeout(function(){
					    	$(window).trigger('resize');
						},500);
					});
				},2000);
			}
		});
	}
  
  	lpc_template.queue.fpInit = function($self) {
		var $block = $self.find('.js-lp-fastpay');
		
		if ($block.length) {
	
			$block.on('click', '.js-fp-show-form', function(e) {
				e.preventDefault();
	
				var $this = $(this),
					$parent = $this.closest('.js-lp-fastpay'),
					//$currentParent = $this.parents('.lp-payment-service-item'),
					//currentPrice = $currentParent.find('.lp-payment-service-item_price').html(),
					needHref = $parent.data('page-path'),
					serviceID = $this.data('service-id'),
					fastPayID = $this.closest('.lp-payment-service-item').attr('data-fastpay-id');
					
					$this.addClass('_opened');
					
				$.ajax({
					url: '/-/x-api/v1/public/?method=fastpay/getService&param[service_id]='+serviceID+'&param[fast_pay_id]='+ fastPayID +'&param[tpl]=global:lpc4.fast_payment.tpl',
					success: function(data) {
						var htmlForm = data.result.html;
						var $newBlock = $this.closest('.lp-payment-service-item').append(htmlForm);
						//let $btn = $currentParent.find('.lp-form-tpl__button-wrapper .lp-button');
						
						//$btn.text($btn.text() + ' ' + currentPrice);
						
						
						s3LP.initForms($newBlock);
						$this.closest('.lp-payment-service-item').find('.lp-payment-service-item_button').hide();
						var needAttr = $self.find('.lp-payment__form').attr('data-api-url') + "&param[href]=" + needHref;
						$newBlock.find('.lp-payment__form').attr('data-api-url', needAttr);
						$newBlock.find('.lp-payment__form').data('api-url', needAttr);
						$this.closest('.lp-payment-service-item').find('.payment-selection:first').addClass('_active');
					}
				});
				
			});
	
			$block.find('.fp_free_wrap').each(function() {
				var $this = $(this).find('.js-lp-fp-form'),
					$parent = $this.closest('.js-lp-fastpay'),
					needHref = $parent.data('page-path'),
					needAttr = $this.attr('data-api-url') + "&param[href]=" + needHref;
		
				$this.attr('data-api-url', needAttr);
				$this.data('api-url', needAttr);
		
			});
			
			$block.on('click', '.payment-selection-in', function(e) {
				$(this).each(function () {
					e.preventDefault();
					$(this).parent('.payment-selection').siblings('.payment-selection').removeClass('_active');
					$(this).parent('.payment-selection').addClass('_active');
					$(this).siblings('.type-radio-payment').click();
				});
			});
		}
		
		
	};
	
	lpc_template.queue.donationsBlock = function($self) {
		let $block = $self.find('.lpc-payment-block-2');
		
		if (!s3LP.is_cms) {
			$block.each(function(){
				let $this = $(this);
				let $price = $this.find('.lp-payment__form .lp-form-tpl__item:first-of-type').addClass('custom_price_input');
    
			    let $email = $this.find('.lp-payment__form input[name="email"]').val('example@gmail.com');
			    let $phone = $this.find('.lp-payment__form input[name="phone"]').val('+1234567890');
			    
			    $price.find('input[name="price"]').val($block.find('.lpc_payment_buttons_js .lpc-button--type-1').text().replace(/\D/g, ''));

				$this.find('.lpc_payment_buttons_js .lp-button').on('click', function(){
			        let currentValue = $(this).text().replace(/\D/g, '');
			        
			        $this.find('.lpc_payment_buttons_js .lp-button').removeClass('lpc-button--type-1').addClass('lpc-button--type-2');
			        $(this).removeClass('lpc-button--type-2').addClass('lpc-button--type-1');
			        
			        if ($(this).hasClass('custom_price_btn')) {
			            $price.fadeIn(200);
			            $this.find('input[name="price"]').val('').focus();
			        } else {
			            $this.find('input[name="price"]').val(currentValue);
			            $price.hide();
			        };
				});
			});
		}
	};
	
	lpc_template.queue.geoLinkInit = function($self){
		let $block = $self.find('.lpc-contact-1');
		
		
		if($block.length) {
			
			/*var htmlLang = document.documentElement.lang;
				var script = document.createElement("script");
				script.async = "async";
			if (htmlLang == "en") {
				if (keyMap != "") {
					script.src = `//api-maps.yandex.ru/2.1/?apikey=${keyMap}&lang=en_RU`;
				} else {
					script.src = `//api-maps.yandex.ru/2.1/?lang=en_RU`;
				}
			} else {
				if (keyMap != "") {
					script.src = `//api-maps.yandex.ru/2.1/?apikey=${keyMap}&lang=ru_RU`;
				} else {
					script.src = `//api-maps.yandex.ru/2.1/?lang=ru_RU`;
				}
			}
			*/
			document.addEventListener('click', function(e) {
			
			    const link = e.target.closest('.ymaps-geolink-click');
			    const allGeoAddresses = document.querySelectorAll('.lpc-contact-1__geo-address');
			    const allMapContainers = document.querySelectorAll('.lpc-geolink-single-map');
			
			    // === 1. Закрываем все карты при клике вне адреса или карты ===
			    if (!link) {
			        let clickedInside = false;
			        allGeoAddresses.forEach(el => { if (el.contains(e.target)) clickedInside = true; });
			        allMapContainers.forEach(el => { if (el.contains(e.target)) clickedInside = true; });
			
			        if (!clickedInside) {
			            allMapContainers.forEach(c => c.style.display = 'none');
			        }
			        return;
			    }
			
			    // === 2. Открываем нужную карту ===
			    const containerId = link.getAttribute('data-map-container');
			    if (!containerId) return;
			
			    const container = document.querySelector(containerId);
			    const mapDiv = container.querySelector('div[id^="lpc-yandex-map-"]');
			    if (!mapDiv) return;
			
			    // Закрываем все другие карты
			    allMapContainers.forEach(c => { if (c !== container) c.style.display = 'none'; });
			
			    // Тоггл
			    if (container.style.display === 'block') {
			        container.style.display = 'none';
			        return;
			    }
			
			    container.style.display = 'block';
			
			
			    if (!container.dataset.mapInitialized) {
			        ymaps.ready(function() {
			            // Парсим координаты из data-bounds
			            let coords = [55.755826, 37.6173];
			            try {
			                const b = link.getAttribute('data-bounds') || '';
			                const nums = b.replace(/[\[\]]/g, '').split(',').map(parseFloat);
			                if (nums.length >= 2) coords = [nums[0], nums[1]];
			            } catch(e) {}
			
			            const map = new ymaps.Map(mapDiv.id, {
			                center: coords,
			                zoom: 14,
			                controls: ['zoomControl']
			            });
			
			            // Метка
			            const placemark = new ymaps.Placemark(coords, {
			                hintContent: link.textContent.trim(),
			                balloonContent: link.getAttribute('data-description') || link.textContent.trim()
			            }, {
			                preset: 'islands#redDotIconWithCaption'
			            });
			            map.geoObjects.add(placemark);
			            if (link.getAttribute('data-description')) placemark.balloon.open();
			
			            
			
			            routeButton.events.add('click', function () {
			                // Определяем точку "откуда" — либо геолокация, либо центр города
			                if (navigator.geolocation) {
			                    navigator.geolocation.getCurrentPosition(pos => {
			                        const userCoords = [pos.coords.latitude, pos.coords.longitude];
			                        openRoute(userCoords, coords);
			                    }, () => {
			                        // Если геолокация запрещена — от центра Москвы
			                        openRoute([55.7558, 37.6176], coords);
			                    });
			                } else {
			                    openRoute([55.7558, 37.6176], coords);
			                }
			            });
			
			            // Функция открытия маршрута в новой вкладке
			            function openRoute(from, to) {
			                const url = `https://yandex.ru/maps/?rtext=${from[0]},${from[1]}~${to[0]},${to[1]}&rtt=auto`;
			                window.open(url, '_blank');
			            }
			
			            // Добавляем кнопку на карту (внизу по центру)
			            map.controls.add(routeButton, {
			                float: 'none',
			                position: { bottom: 15, left: '50%', transform: 'translateX(-50%)' }
			            });
			
			            // Включаем GeolinkControl (чтобы повторные клики работали)
			            ymaps.modules.require(['control.GeolinkControl'], function(GeolinkControl) {
			                map.controls.add(new GeolinkControl({ selector: '[data-map-container="' + containerId + '"]' }));
			            });
			
			            container.dataset.mapInitialized = '1';
			        });
			    }
			});
		}
	};
	

  lpc_template.queue.popupTouch = function(){
  	$('a[href^="popup:"]').on('click', function (){
  		setTimeout(function() {
  			lpc_template.popupAdaptiveBlock();
  			
  			document.dispatchEvent(new Event(`lpcPopupOpened`, {bubbles: true}));
  			
  			if ($('.lp-popup-wrapper form').find('input[data-alias=product_name]').val() == ""){
  				$('.lp-popup-wrapper form').find('input[data-alias=product_name]').val("Форма");
  			}
  		 }, 80);
  	})
  };
  
  lpc_template.queue.popupTouchClose = function(){
  	$('.js-close-popup').bind('click', function(event){
	})
  };

  const adaptiveBlockEvent = new Event('dataMediaSourceChange');
  window.adaptiveBlockEvent = adaptiveBlockEvent; // сделано чтобы была возможность дергать скрипт, для сайтов с версией для слабовидящих
  
  if ($('.color-theme a').length > 0) {
	  $(document).on('click', '.color-theme a', function(){
			setTimeout(function(){
				document.dispatchEvent(adaptiveBlockEvent);
			}, 100);
	  }); // Fix color switching in the accessibility mode.
  }

  checkMediaSource = function(media) {
    if(lpc_template.media_source != media) {
      lpc_template.media_source = media;
      document.dispatchEvent(adaptiveBlockEvent);
    }
  }
  

  lpc_template.adaptiveBlock = function () {

    let decorWrap = document.querySelector(".decor-wrap");

    if(decorWrap) {
    	
    let decorWrapWidth = decorWrap.offsetWidth;
      if (decorWrapWidth < 480) {
        decorWrap.setAttribute("data-media-source", "media-xs");
        checkMediaSource('media-xs');
      } else if (decorWrapWidth < 768) {
        decorWrap.setAttribute("data-media-source", "media-sm");
        checkMediaSource('media-sm');
      } else if (decorWrapWidth < 992) {
        decorWrap.setAttribute("data-media-source", "media-md");
        checkMediaSource('media-md');
      } else if (decorWrapWidth < 1280) {
        decorWrap.setAttribute("data-media-source", "media-lg");
        checkMediaSource('media-lg');
      } else if (decorWrapWidth >= 1280) {
        decorWrap.setAttribute("data-media-source", "media-xl");
        checkMediaSource('media-xl');
      }
    }
  };
  
  lpc_template.popupAdaptiveBlock = function () {
  
    let decorPopupWrap = document.querySelector(".lp-popup-inner .decor-wrap");
    
    if(decorPopupWrap) {
    let decorPopupWrapWidth = decorPopupWrap.offsetWidth;
      if (decorPopupWrapWidth < 480) {
        decorPopupWrap.setAttribute("data-media-source", "media-xs");
        checkMediaSource('media-xs');
      } else if (decorPopupWrapWidth < 768) {
        decorPopupWrap.setAttribute("data-media-source", "media-sm");
        checkMediaSource('media-sm');
      } else if (decorPopupWrapWidth < 992) {
        decorPopupWrap.setAttribute("data-media-source", "media-md");
        checkMediaSource('media-md');
      } else if (decorPopupWrapWidth < 1280) {
        decorPopupWrap.setAttribute("data-media-source", "media-lg");
        checkMediaSource('media-lg');
      } else if (decorPopupWrapWidth >= 1280) {
        decorPopupWrap.setAttribute("data-media-source", "media-xl");
        checkMediaSource('media-xl');
      }
    }
  };
  
  
  

  lpc_template.checkMapInitialization = function ($blocks) {
    $blocks.each(function () {
      var $this = $(this),
        id = $this.attr("id");

      if (initializedMaps.includes(id) && $this.children().length) {
        return;
      }

      var inViewport = isElementInViewport(this);
      
      if (inViewport) {
        initializedMaps.push(id);

        lpc_template.initMaps($this);
      }
    });
    
  };

  lpc_template.initGoogleMaps = function (options) {
    var map = new google.maps.Map(document.getElementById(options.id), {
      zoom: parseInt(options.zoom),
      scrollwheel: false,
      center: new google.maps.LatLng(options.center[0], options.center[1]),
    });

    $.each(options.data, function (key, item) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(item.coords[0], item.coords[1]),
        map: map,
        title: item.name,
      });

      var infowindow = new google.maps.InfoWindow({
        content:
          '<div class="baloon-content">' +
          '<h5 class="lp-header-title-5" style="margin: 0; padding-bottom: 3px; color: inherit;">' +
          item.name +
          "</h5>" +
          item.desc +
          "</div>",
      });

      google.maps.event.addListener(marker, "click", function () {
        infowindow.open(map, marker);
      });
    });
  };
  
  

  lpc_template.initYandexMaps = function (options, objectListFlag) {
  	
	let $wrapper = $('#'+options.id).parents('.lpc-block');
	
	if (objectListFlag) {
		let groups = options.data;
		
		var map = new ymaps.Map(options.id, {
	        center: options.center,
	        zoom: options.zoom,
	        behaviors: ["drag", "rightMouseButtonMagnifier"],
	    }, {
	        searchControlProvider: 'yandex#search'
	    });

		for (var i = 0; i < groups.length; i++) {
			createGroup(groups[i]);
		}
		
		if (options.data[0].items.length > 1) {
            map.setBounds(map.geoObjects.getBounds());
            map.setZoom(map.getZoom() - 1);
        }
        
		
	} else {
	    var map = new ymaps.Map(options.id, {
	      center: options.center,
	      zoom: options.zoom,
	      behaviors: ["drag", "rightMouseButtonMagnifier"],
	    });
	    
	};

    map.controls.add(new ymaps.control.ZoomControl());

    var MyBalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(
      '<div class="baloon-content" style="padding: 0 10px; ">' +
        '<h5 class="lp-header-title-5" style="margin: 0; color: inherit;">$[properties.name]</h3>' +
        '<p class="lp-header-text-3" style="color: inherit;">$[properties.desc]</p>' +
        "</div>"
    );
    
    var myCollection = new ymaps.GeoObjectCollection();

    $.each(options.data, function (key, item) {
    	if(this.image){
    		myCollection.add(
	        new ymaps.Placemark(item.coords, item, {
	           balloonContentLayout: MyBalloonContentLayoutClass,
	           iconLayout: 'default#image',
	           iconImageHref: this.image,
	           iconImageOffset: [-15, -15],
	        })
	      );
    	}	else{
	      myCollection.add(
	        new ymaps.Placemark(item.coords, item, {
	           balloonContentLayout: MyBalloonContentLayoutClass,
	           iconImageOffset: [-15, -15],
	           preset: this.icon,
	           iconColor: this.color,
	        })
	      );
    	}
    });

    map.geoObjects.add(myCollection);

    $("#" + options.id).data("ymaps", map);

	function createGroup(group) {
		if(group.image){
			var collection = new ymaps.GeoObjectCollection(null, {iconImageHref: group.image, iconImageOffset: [-15, -15], iconLayout: 'default#image', iconColor: group.color});
		}else{
			var collection = new ymaps.GeoObjectCollection(null, {preset: group.style,  iconColor: group.color});
		}
		map.geoObjects.add(collection);
	
		for (var j = 0; j < group.items.length; j++) {
			createItems(group.items[j], collection, j);
		}
		
	}
	
	function createItems(item, collection, index) {
		var placemark = new ymaps.Placemark(item.center, { balloonContent: item.name });
		collection.add(placemark);
	
		$wrapper.find('.lpc-map-click').eq(index).on('click', function (e) {
			var $clickedItem = $(this);
			
			
			if ($(e.target).closest('a').length && $(this).find('a').length) {
		        return;
		    }
			
			
			$wrapper.find('.lpc-map-click').removeClass('active');
			
			$clickedItem.addClass('active');
			
			if (!placemark.balloon.isOpen()) {
				placemark.balloon.open();
			} else {
				placemark.balloon.close();
			}
			map.setCenter(placemark.geometry.getCoordinates(), map.getZoom(), {
				duration: 500
			});
			
			return false;
		});
	}
  };

	lpc_template.initMaps = function ($block) {

		var options = $block.data("init-params");
		
		if (!options) {
			return;
		}
		
		var isObjectList = $block.data("object-list");
	
		if (typeof options === "string" && options.trim()) {
			try {
				options = JSON.parse(options.replace(/\n/g, "\\n"));
			} catch (e) {
				console.error("Ошибка парсинга JSON:", e, options);
				options = {};
			}
		}
	
		if (typeof options.center === "string") {
			options.center = options.center.split(",");
		}
	
		if (options.data && typeof options.data === "object") {
			$.each(options.data, function (key, item) {
				if (item && typeof item.coords === "string") {
					item.coords = item.coords.split(",");
				}
			});
		}
	
		var keyMap = options.key ?? '';
	
		if (options.type === "google") {
			if (window.google && window.google.maps) {
				lpc_template.initGoogleMaps(options);
			} else {
				var script = document.createElement("script");
				script.async = "async";
				script.src = `//maps.googleapis.com/maps/api/js?key=${keyMap}`;
				document.body.append(script);
	
				script.onload = function () {
					lpc_template.initGoogleMaps(options);
				};
			}
		} else {
			if (typeof window.ymaps !== 'undefined') {
				lpc_template.initYandexMaps(options, isObjectList);
			} else {
				var htmlLang = document.documentElement.lang;
				var script = document.createElement("script");
				script.async = "async";
				if (htmlLang == "en") {
					if (keyMap != "") {
						script.src = `//api-maps.yandex.ru/2.1/?apikey=${keyMap}&lang=en_RU`;
					} else {
						script.src = `//api-maps.yandex.ru/2.1/?lang=en_RU`;
					}
				} else {
					if (keyMap != "") {
						script.src = `//api-maps.yandex.ru/2.1/?apikey=${keyMap}&lang=ru_RU`;
					} else {
						script.src = `//api-maps.yandex.ru/2.1/?lang=ru_RU`;
					}
				}
	
				document.body.append(script);
	
				script.onload = function () {
					ymaps.ready(function () {
						lpc_template.initYandexMaps(options, isObjectList);
					});
				};
			}
		}
	};
  
  
	/*lpc_template.queue.lpcTriggerButton = function ($self) {
	    let $block = $self.find('.lpc-constructor');
	    let $button = $block.find('.lpc-video-editor__button');
	    let $fillingButton = $block.find('.edit-layout');
	    
	    if (s3LP.is_cms && $block.length && $button.length && $fillingButton.length) {
	        $button.on('click', function() {
	            $fillingButton.trigger('click');
	        });
	    }
	};*/
	
	
  lpc_template.queue.lpcMapsEditorInit = function ($self) {
  		var $block = $self.find(".js-lpc-simple-map");
  		
	  	if(s3LP.is_cms){
	  		if ($block.length) {
	  			setTimeout(function() {
	  				lpc_template.initMaps($block);
	  			}, 200);
	  		}
	  	}
  };
  
  lpc_template.queue.lpcTriggerPopupBlock = function ($self) {
  		var $block = $self.find("[data-popup-type]");
  		
  		if($block.length){
  			document.addEventListener('lpcTriggerPopupInitDone', function(){
		    	lpc_template.popupAdaptiveBlock();
		    });
  		}
  };

	lpc_template.queue.lpcTimer = function ($self) {
		var $block = $self.find(".js-lp-timer"),
			htmlLang = document.documentElement.lang,
			timerDays,
			timerHours,
			timerMinutes,
			timerSeconds,
			formatOut;

		if (htmlLang == "de" || htmlLang == "en") {
			timerDays = "Days";
			timerHours = "Hours";
			timerMinutes = "Minutes";
			timerSeconds = "Seconds";
		} else {
			timerDays = "Дней";
			timerHours = "Часов";
			timerMinutes = "Минут";
			timerSeconds = "Секунд";
		}

		var formatOut =
			'<div class="lp-ui-timer__item"><div class="lp-ui-timer__item-number lp-header-title-2" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-number">%d</div><div class="lp-ui-timer__item-text lp-header-text-3" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-text">' +
			timerDays +
			'</div></div><div class="lp-ui-timer__item"><div class="lp-ui-timer__item-number lp-header-title-2" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-number">%h</div><div class="lp-ui-timer__item-text lp-header-text-3" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-text">' +
			timerHours +
			'</div></div><div class="lp-ui-timer__item"><div class="lp-ui-timer__item-number lp-header-title-2" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-number">%m</div><div class="lp-ui-timer__item-text lp-header-text-3" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-text">' +
			timerMinutes +
			'</div></div><div class="lp-ui-timer__item"><div class="lp-ui-timer__item-number lp-header-title-2" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-number">%s</div><div class="lp-ui-timer__item-text lp-header-text-3" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-text">' +
			timerSeconds +
			"</div></div>";
			
		var formatEnd =
			'<div class="lp-ui-timer__item"><div class="lp-ui-timer__item-number lp-header-title-2" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-number">00</div><div class="lp-ui-timer__item-text lp-header-text-3" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-text">' +
			timerDays +
			'</div></div><div class="lp-ui-timer__item"><div class="lp-ui-timer__item-number lp-header-title-2" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-number">00</div><div class="lp-ui-timer__item-text lp-header-text-3" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-text">' +
			timerHours +
			'</div></div><div class="lp-ui-timer__item"><div class="lp-ui-timer__item-number lp-header-title-2" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-number">00</div><div class="lp-ui-timer__item-text lp-header-text-3" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-text">' +
			timerMinutes +
			'</div></div><div class="lp-ui-timer__item"><div class="lp-ui-timer__item-number lp-header-title-2" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-number">00</div><div class="lp-ui-timer__item-text lp-header-text-3" data-elem-type="text" data-lp-selector=".lp-ui-timer__item-text">' +
			timerSeconds +
			"</div></div>";

	if ($block.length) {
		$block.each(function () {
			var $this = $(this);
			
			$this.lpcTimer({
				format_in: "%d.%M.%y %h:%m:%s",
				language: htmlLang,
				update_time: s3LP.is_cms ? 100000 : 1000,
				format_out: formatOut,
					onEnd: function () {
						if ($this.closest('.lpc-banner__timer').length) {
							$this.closest('.lpc-banner__timer').hide();
						} else {
							$this.closest('.lp-ui-timer-wrapper').hide();
						}
					},
				});
			});
		}
  	};

  lpc_template.queue.formInputs = function ($self) {
    $doc.on("click", ".js-select, .js-multi_select", function () {
      var $this = $(this),
        openedClass = "_opened",
        $thisParent = $this.closest(
          ".lp-form-tpl__field-select, .lp-form-tpl__field-multi_select"
        ),
        $thisList = $thisParent.find(
          ".lp-form-tpl__field-select__list, .lp-form-tpl__field-multi_select__list"
        );

       if(!s3LP.is_cms){
	      if ($thisParent.hasClass(openedClass)) {
	        $thisParent.removeClass(openedClass);
	        //$thisList.slideUp();
	        
	      } else {
	        $thisParent.addClass(openedClass);
	        //$thisList.slideDown();
	      }
      }
      
      if(s3LP.is_cms){
      	
      	if ($thisList.hasClass(openedClass)) {
	        $thisList.removeClass(openedClass);
	      } else {
	        $thisList.addClass(openedClass);
	      }
      }
    });
    $(document).ready(function () {
      $(".js-choose-select._checked").each(function () {
        var $this = $(this),
          thisText = $this.text(),
          $thisParent = $this.closest(".lp-form-tpl__field-select"),
          checkedClass = "_checked";

        $thisParent.find(".js-choose-select").removeClass(checkedClass);
        $thisParent.find(".lp-form-tpl__field-select__input").text(thisText);
        $thisParent.parent().find("input").val(thisText);
      });
    });

    $doc.on("click", ".js-choose-select", function () {
      var $this = $(this),
        thisText = $this.text(),
        $thisParent = $this.closest(".lp-form-tpl__field-select"),
        checkedClass = "_checked";

      if (!$this.hasClass(checkedClass)) {
        $thisParent.find(".js-choose-select").removeClass(checkedClass);
        $this.addClass(checkedClass);
        $thisParent.find(".lp-form-tpl__field-select__input").text(thisText);
        $thisParent.parent().find("input").val(thisText);
      }

      //$thisParent.find(".lp-form-tpl__field-select__list").slideUp();
      $thisParent.removeClass("_opened");
    });

    $doc.on("click", ".js-choose-milti_select", function () {
      var $this = $(this),
        $thisParent = $this.closest(".lp-form-tpl__field-multi_select"),
        checkedClass = "_checked";

      if (!$this.hasClass(checkedClass)) {
        $this.addClass(checkedClass);
      } else {
        $this.removeClass(checkedClass);
      }

      var choosenElements = $thisParent.find("." + checkedClass),
        choosenElementsText = [];

      choosenElements.each(function () {
        choosenElementsText.push($(this).text());
      });

      $thisParent
        .find(".lp-form-tpl__field-multi_select__input--count")
        .text(choosenElements.length);
      $thisParent.parent().find("input").val(choosenElementsText.join(", "));
    });

	$doc.on("click", function (e) {
		if(!s3LP.is_cms) {
			if (!$(e.target).closest('.lp-form-tpl__field-select').length) {
				$doc.find(".lp-form-tpl__field-select").removeClass("_opened");
				//$doc.find(".lp-form-tpl__field-select__list") .slideUp();
			};
			
			if (!$(e.target).closest('.lp-form-tpl__field-multi_select').length) {
				$doc.find(".lp-form-tpl__field-multi_select").removeClass("_opened");
				//$doc.find(".lp-form-tpl__field-multi_select__list") .slideUp();
			}
		}
	});
  };
  
  
	lpc_template.queue.popupFormHiddenInputFolder = function ($self) {
	   
	    if ($doc.find('[data-alias="product_name"]').length && $doc.find('.lpc-folder-name[data-folder-name]').length) {
	
	        $doc.on('click', function (e) {
	            const $folderItem = $(e.target).closest('.lpc-folder-name');
	
	            if ($folderItem.length) {
	                const folderName = $folderItem.data('folder-name');
	                
	                if (folderName) {
	                    $('.lp-popup-wrapper form input[data-alias="product_name"]').val(folderName);
	                }
	            }
	        });
	    }
	};
  
	lpc_template.queue.productPopupFormHiddenInput = function ($self) {
	    let $blocks = $self.find('.lpc-product-9');
	
	    if ($blocks.length) {
	        $self.on("click", ".lpc-popup-hide-input-check", function (e) {
	            
	            $blocks.each(function () {
	                var $productBlock = $(this);
	                
	                if ($productBlock.find("input[data-alias='product_name']").length && $productBlock.find(".lpc-product-name [data-name-product]").length) {
	                	
	                    var prodName = $productBlock.find('.lpc-product-name [data-name-product]').data('name-product');
	
	                    if (prodName) {
							setTimeout(function () {
	                        	$productBlock.find('form input[data-alias="product_name"]').val(prodName);
							}, 100);
	                    }
	                }
	            });
	        });
	    }
	};
  

  	lpc_template.queue.popupFormHiddenInput = function ($self) {
  		if($doc.find("[data-alias='product_name']" && $doc.find("[data-form-hide-input]"))){
  			$doc.on("click", function (e) {
  				
  				if($(e.target).closest('.lpc-popup-hide-input-check').length) {
  					var $this = $(this);
  					
  						
  					if($(e.target).closest('.lpc-tarifs-compare').length){
  						var prodName = $(e.target).closest('.lpc-popup-hide-input-check').data('button-name');
  					}	else {
  						var prodName = $(e.target).closest('.lpc-product-name').find('[data-name-product]').data('name-product');
  					}
  					
  					$('.lp-popup-wrapper form input[data-alias=product_name]').val(prodName);
  				}
  			});
  		}
  	};
  	
  	lpc_template.queue.popupFastPayData = function ($self) {
  		var searchLinkPopupText = "popup";
  		var searchLinkScrollText = "popup";
  		
  		if(s3LP.is_cms) {
  			$(document).ready(function () {
  				$(".lpc-popup-fastpay .lpc-popup-fastpay__form-price").text('0');
  			});
  		}

  		
  		$doc.on("click", function (e) {
  			if($(e.target).closest('.lpc-tarifs-compare').length){
  				if($(e.target).closest('.lpc-popup-hide-input-check').length) {
  					$(e.target).closest('.lpc-popup-hide-input-check').each(function(){
  						var prodPrice = $(this).data('button-index');
  						var prodPriceCustom = prodPrice.replace(/\D/g, '');
  						
  						if (prodPrice.indexOf('/') !== -1) {
							var prodPrice = false;
						}
						
  						if(prodPrice) {
							$('.lpc-popup-fastpay__form').show();
		  					$('.lpc-popup-fastpay .lp-payment-inner form input[name="price"]').val(prodPriceCustom).hide();
		  					$('.lpc-popup-fastpay .lp-payment-inner form input[name="price"]').closest('.lp-payment__form').removeClass('_input-active');
		  					
		  					if($('.lpc-popup-fastpay .lp-payment-inner form input[name="price"]').closest('.lpc-popup-fastpay__content').find('.lpc-popup-fastpay__form-price').length == 0){
		  						$('.lpc-popup-fastpay .lp-payment-inner form input[name="price"]').closest('.lpc-popup-fastpay__content').find('.lpc-popup-fastpay__form-price').text(prodPrice).show();
		  					}else {
		  						$('.lpc-popup-fastpay .lp-payment-inner form input[name="price"]').closest('.lpc-popup-fastpay__content').find('.lpc-popup-fastpay__form-price').text(prodPrice);
		  					}
  						}
  						else {
							$('.lpc-popup-fastpay .lp-payment-inner form input[name="price"]').closest('.lp-payment__form').addClass('_input-active');
			  				$('.lpc-popup-fastpay__form').hide();
			  				$('.lpc-popup-fastpay .lp-payment-inner form input[name="price"]').val("").show();
						}
  					});
  					
			  		var prodName = $(e.target).closest('.lpc-popup-hide-input-check').data('button-name');
			  		
			  		if ($('.lp-popup-wrapper .lp-payment__form form').find('input[name=_order_details]').length) {
				  		$('.lp-popup-wrapper .lp-payment__form form').find('input[name=_order_details]').val(prodName);
			  		}
	  			}
  			} else {
	  			if($(e.target).closest('.lpc-popup-hide-input-check').length) {
	  				if($doc.find("[name='price']") && $doc.find(".lp-payment__form") && $(e.target).attr('href').includes(searchLinkPopupText) && $(e.target).closest('.lpc-product-name').find('[data-price-product]').length){
						var $this = $(this),
						prodPrice = $(e.target).closest('.lpc-product-name').find('[data-price-product]').data('price-product');
						if (prodPrice.indexOf('/') !== -1) {
							var prodPrice = false;
						}else{
							var prodPriceCustom = $(e.target).closest('.lpc-product-name').find('[data-price-product]').data('price-product').replace(/\D/g, '');
						}
						
						if(prodPrice) {
							$('.lpc-popup-fastpay__form').show();
		  					$('.lpc-popup-fastpay .lp-payment-inner form input[name="price"]').val(prodPriceCustom).hide();
		  					$('.lpc-popup-fastpay .lp-payment-inner form input[name="price"]').closest('.lp-payment__form').removeClass('_input-active');
		  					
		  					if($('.lpc-popup-fastpay .lp-payment-inner form input[name="price"]').closest('.lpc-popup-fastpay__content').find('.lpc-popup-fastpay__form-price').length == 0){
		  						$('.lpc-popup-fastpay .lp-payment-inner form input[name="price"]').closest('.lpc-popup-fastpay__content').find('.lpc-popup-fastpay__form-price').text(prodPrice).show();
		  					}else {
		  						$('.lpc-popup-fastpay .lp-payment-inner form input[name="price"]').closest('.lpc-popup-fastpay__content').find('.lpc-popup-fastpay__form-price').text(prodPrice);
		  					}
						}else {
							$('.lpc-popup-fastpay .lp-payment-inner form input[name="price"]').closest('.lp-payment__form').addClass('_input-active');
			  				$('.lpc-popup-fastpay__form').hide();
			  				$('.lpc-popup-fastpay .lp-payment-inner form input[name="price"]').val("").show();
						}
	  					
	  				} else if($doc.find("[name='price']") && $doc.find(".lp-payment__form") && $(e.target).attr('href').includes(searchLinkPopupText) && !$(e.target).closest('.lpc-product-name').find('[data-price-product]').length) {
	  					$('.lpc-popup-fastpay .lp-payment-inner form input[name="price"]').closest('.lp-payment__form').addClass('_input-active');
	  					$('.lpc-popup-fastpay__form').hide();
	  					$('.lpc-popup-fastpay .lp-payment-inner form input[name="price"]').val("").show();
	  					$('.lpc-popup-fastpay .lp-payment-inner form input[name="price"]').siblings('.lp-form-tpl__field-text-elem').hide();
	  				}
	  				var prodName = $(e.target).closest('.lpc-product-name').find('[data-name-product]').data('name-product');
			  		if ($('.lp-popup-wrapper .lp-payment__form form').find('input[name=_order_details]').length) {
				  		$('.lp-popup-wrapper .lp-payment__form form').find('input[name=_order_details]').val(prodName);
			  		}
	  			}
	  			
	  			/*if($(e.target).closest('.lpc-popup-hide-input-check').length && (!$(e.target).attr('href').includes(searchLinkPopupText) && !$(e.target).attr('href').includes(searchLinkScrollText)) && $(e.target).closest('.lpc-product-name').find('[data-price-product]').length){
	  				var buttonLink = $(e.target).attr('href');
	  				prodPrice = $(e.target).closest('.lpc-product-name').find('[data-price-product]').data('price-product');
	  				var fastPayLink = buttonLink + '?price=' + prodPrice;
	  				e.preventDefault();
	  				window.location.href = fastPayLink;
	  			}*/
  			}
  			if ($(e.target).closest('a').length && $(e.target).closest('.lpc-popup-hide-input-check').length == 0) {
  				$('.lpc-popup-fastpay .lp-payment-inner form input[name="price"]').closest('.lp-payment__form').addClass('_input-active');
  				$('.lpc-popup-fastpay__form').hide();
  				$('.lpc-popup-fastpay .lp-payment-inner form input[name="price"]').val("").show();
  			}
  		});
  	};
  	
  	lpc_template.queue.fortuneWheel = function ($self) {
  		let $block = $self.find('.fortune-wheel'),
  			$timeCookies = $block.closest('.lpc-fortuna-1').attr('data-timer-hide'),
  			$timeCookies2 = $block.closest('.lpc-popup-fortune').attr('data-timer-hide'),
  			$new_minut = $timeCookies,
  			$new_minut2 = $timeCookies2;
  			
  			
        function createCookie(name, value, minutes) {
	        let expires = "";
	        if (minutes) {
	            const date = new Date();
	            date.setTime(date.getTime() + (minutes * 60 * 1000));
	            expires = "; expires=" + date.toUTCString();
	        }
	        document.cookie = name + "=" + value + expires + "; path=/";
	    }
        
		if ($block.length) {
			$block.each(function(){
				let $this = $(this);
				var parent = $this.closest('.lpc-block');
				var parentId = parent.attr('id');

				var padding = {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
				},
				w = 460 - padding.left - padding.right,
				h = 460 - padding.top - padding.bottom,
				r = Math.min(w, h) / 2,
				rotation = 0,
				oldrotation = 0,
				picked = 100000,
				oldpick = [],
				rotate = 0,
				color = d3.scale.category20(); //category20c()
				var form = parent.find('form');
				var sendText = parent.find('.question__after-send').data('send-text');
				var checkPopupBlock = parent.attr('data-popup-block');
				var popupBlockBtn = parent.find('.lpc-popup-fortune__custom-btn');
				
				if ($timeCookies) {
                    $this.closest('.lpc-fortuna-1').find('form').submit(function (e) {
                        e.preventDefault();
                        createCookie("lpcfortune", "1", parseInt($timeCookies));
                        console.log("Cookie создана!");
                    });
                }
				
				/*if ($timeCookies) {
					$this.closest('.lpc-fortuna-1').find('form').submit(function(){
						createCookie("lpcfortune", "1", $new_minut);
					});
				}*/
				if ($timeCookies2) {
					$this.closest('.lpc-popup-fortune').find('form').submit(function(){
						createCookie("lpcfortune2", "1", $new_minut2);
					});
				}
				
				function hexToRgb(hex) {
				  // Удаляем возможный символ #
				  hex = hex.replace(/^#/, '');
				
				  // Проверяем наличие корректной длины
				  if (hex.length !== 6) {
				    throw new Error('Неправильный формат шестнадцатеричного цвета. Ожидается формат "#RRGGBB".');
				  }
				
				  // Разбиваем на составляющие R, G и B
				  const r = parseInt(hex.slice(0, 2), 16);
				  const g = parseInt(hex.slice(2, 4), 16);
				  const b = parseInt(hex.slice(4, 6), 16);
				
				  return { r, g, b };
				}
				
				function getContrastColor(rgbStr) {
				  let customBg = hexToRgb(rgbStr);
				  let textColor = Math.round((customBg.r * 299 + customBg.g * 587 + customBg.b * 114) / 1000);
				  return (textColor > 150) ? '#000' : '#fff';
				}
			
				var data = $this.data("labels");
				data = data.replace(/,$/, '');
				data = data.replace(/"/g, '\\"');
				data = data.replace(/'/g, '"');
				data = JSON.parse('[' + data + ']');
				
				var infiniteRotate = $this.data("infinite")
				
				var svg = d3.select('#'+parentId + ' .fortune-wheel')
					.append("svg")
					.data([data])
					.attr("width", w + padding.left + padding.right)
					.attr("height", h + padding.top + padding.bottom);
				
				var container = svg.append("g")
					.attr("class", "chartholder")
					.attr("transform", "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")");
					
				container.append("circle")
					.attr("cx", 0)
					.attr("cy", 0)
					.attr("r", 230)
					.style({
						"fill": "var(--primary-color-base)"
					});
				
				var vis = container
					.append("g");
					
				if(infiniteRotate) {
					vis.attr("class", "infinite-rotate");
				} else {
					if(data.length % 2 === 0 && data.length / 2 % 2 !== 0) {
						rotate = 360 / data.length / 2;
						vis.style({
							"transform": "rotate(" + rotate + "deg)"
						});
						oldrotation = rotate
					} 	
				}
				
				var pie = d3.layout.pie().sort(null).value(function(d) {
					return 1;
				});
				
				// declare an arc generator function
				var arc = d3.svg.arc().outerRadius(r);
				
				// select paths, use arc generator to draw
				var arcs = vis.selectAll("g.slice")
					.data(pie)
					.enter()
					.append("g")
					.attr("class", "slice");
				
				
				arcs.append("path")
					.attr("fill", function(d, i) {
						return i % 2 ? 'var(--primary-color-base)' : 'var(--primary-color-l-5)';
					})
					.attr("d", function(d) {
						return arc(d);
					});
				
				// add the text
				arcs.append("text")
					.attr("text-anchor", "middle")
					.attr("class", "lp-header-text-3")
					.style({
						"fill": function() {
							// Получаем fill у path, к которому относится текущий текстовый элемент
							let pathFill = d3.select(this.parentNode).select("path").attr("fill");
							let pathFillColor = getComputedStyle(document.documentElement).getPropertyValue(pathFill.match(/var\((.*?)\)/)?.[1])
							return getContrastColor(pathFillColor);
						  }
					})
					.text(function(d, i) {
						return data[i].label;
				});


				function beforeSubmitActions(event) {
					event.preventDefault();
					container.call(spin);
				}
				
				
				function firstStepSpin(event) {
					event.preventDefault();
					popupBlockBtn.addClass('lpc_pointer_events_none');
					container.call(popupspin);
					
					setTimeout(function() {
						parent.find('.lpc-popup-fortune__step-1').hide();
						parent.find('.lpc-popup-fortune__step-2').show();
					}, 3000);
					
				}
				
				if(checkPopupBlock) {
					popupBlockBtn.on('click', firstStepSpin);
					
					form.on('submit', popupSubmit);
					
					$('.lpc-popup-fortune__finish-btn').on('click', function(){
						$(this).closest('.lp-popup-wrapper').find('.js-close-popup').trigger('click');	
					});
				}else {
					form.on('submit', beforeSubmitActions);
				}
				
				
				wrap(arcs.selectAll("text"), 140);
				
				function wrap(text, width) {
				
					text.each(function() {
						var text = d3.select(this),
							words = text.text().split(/\s+/).reverse(),
							word,
							line = [],
							lineNumber = 0,
							lineHeight = 1, // ems
							y = text.attr("y"),
							dy = 0,
							tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
						while (word = words.pop()) {
							line.push(word);
							tspan.text(line.join(" "));
							if (tspan.node().getComputedTextLength() > width) {
								line.pop();
								tspan.text(line.join(" "));
								line = [word];
								tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", Math.sqrt(++lineNumber) * lineHeight + dy + "em").text(word);
							}
							text.attr("transform", function(d) {
								d.innerRadius = 0;
								d.outerRadius = r;
								d.angle = (d.startAngle + d.endAngle) / 2;
								return "rotate(" + (d.angle * 180 / Math.PI - 90 + 1.75 - lineNumber * 2) + ")translate(" + (d.outerRadius - 90) + ")";
							})
						}
					});
				}
				
				
				function spin(d) {
				
					container.on("click", null);
				
					//all slices have been seen, all done
					//console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
					if (oldpick.length == data.length) {
						container.on("click", null);
						return;
					}
				
					var ps = 360 / data.length,
						pieslice = Math.round(1440 / data.length),
						
						rng = Math.floor((Math.random() * 1440) + 360);
						
					rotation = (Math.round(rng / ps) * ps);
				
					picked = Math.round(data.length - (rotation % 360) / ps);
					picked = picked >= data.length ? (picked % data.length) : picked;
				
				
					if (oldpick.indexOf(picked) !== -1) {
						d3.select(this).call(spin);
						return;
					} else {
						oldpick.push(picked);
					}
				
					rotation += 90 - Math.round(ps / 2) - rotate;
					
					if(infiniteRotate) {
						setTimeout(function () {
							vis.attr("class", "stop-rotate");
						}, 2600);
					}
					
					
					vis.transition()
						.style({
							"animation-duration": "2.9s"
						})
						.duration(3000)
						.attrTween("style", rotTween)
						.each("end", function() {
							
							//mark question as seen
		                    d3.select('#' + parentId + ' .slice:nth-child(' + (picked + 1) + ') path')
		                        .attr("fill", "var(--primary-color-d-10)");
		                        
	                        d3.select('#' + parentId + ' .slice:nth-child(' + (picked + 1) + ') text').style({
								"fill": function() {
									// Получаем fill у path, к которому относится текущий текстовый элемент
									let pathFillColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color-d-10')
									return getContrastColor(pathFillColor);
								  }
							})
				
							//populate question
							$('#'+parentId).find('[data-alias="prize"]').val(data[picked].label);
							
							$('#'+parentId + ' .lp-form-tpl__button').click();
							
							d3.select('#'+parentId + ' .question__after-send h2')
		                        .text(sendText + ' ' + data[picked].label);
		                        
							$('#'+parentId + ' .question__before-send').hide();
							$('#'+parentId + ' .question__after-send').show("slow").fadeOut;
							$('#'+parentId + ' .question-message').hide();

		                        
							$('#'+parentId + ' form').hide();
							
							createCookie("lpcfortunetext", sendText + ' ' + data[picked].label, $new_minut);
							//container.on("click", spin);
						});
					
				}
				
				function popupSubmit(d) {
					$('#'+parentId + ' .lp-form-tpl__button').click();
							
					/*d3.select('#'+parentId + ' .question__after-send h2')
                    .text(sendText + ' ' + data[picked].label);*/
                        
					$('#'+parentId + ' .question__before-send').hide();
					$('#'+parentId + ' .question__after-send').hide()
					$('#'+parentId + ' .question-message').hide();
					$('#'+parentId + ' form').hide();
					
					setTimeout(function() {
						$('#'+parentId + ' .lpc-popup-fortune__step-2').addClass('_last-step');
						$('#'+parentId + ' .lpc-popup-fortune__finish-btn').show();
					}, 950);
					
				}
				
				function popupspin(d) {
				
					container.on("click", null);
				
					//all slices have been seen, all done
					if (oldpick.length == data.length) {
						container.on("click", null);
						return;
					}
				
					var ps = 360 / data.length,
						pieslice = Math.round(1440 / data.length),
						
						rng = Math.floor((Math.random() * 1440) + 360);
						
					rotation = (Math.round(rng / ps) * ps);
				
					picked = Math.round(data.length - (rotation % 360) / ps);
					picked = picked >= data.length ? (picked % data.length) : picked;
				
				
					if (oldpick.indexOf(picked) !== -1) {
						d3.select(this).call(spin);
						return;
					} else {
						oldpick.push(picked);
					}
				
					rotation += 90 - Math.round(ps / 2) - rotate;
					
					if(infiniteRotate) {
						setTimeout(function () {
							vis.attr("class", "stop-rotate");
						}, 2600);
					}
					
					
					vis.transition()
						.style({
							"animation-duration": "2.9s"
						})
						.duration(3000)
						.attrTween("style", rotTween)
						.each("end", function() {
							
							//mark question as seen
		                    d3.select('#' + parentId + ' .slice:nth-child(' + (picked + 1) + ') path')
		                        .attr("fill", "var(--primary-color-d-10)");
		                        
	                        d3.select('#' + parentId + ' .slice:nth-child(' + (picked + 1) + ') text').style({
								"fill": function() {
									// Получаем fill у path, к которому относится текущий текстовый элемент
									let pathFillColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color-d-10')
									return getContrastColor(pathFillColor);
								  }
							})
				
							//populate question
							$('#'+parentId).find('[data-alias="prize"]').val(data[picked].label);
							
							/*if(!checkPopupBlock) {
							$('#'+parentId + ' .lp-form-tpl__button').click();
							
							d3.select('#'+parentId + ' .question__after-send h2')
                    		.text(sendText + ' ' + data[picked].label);
		                        
							$('#'+parentId + ' .question__before-send').hide();
							$('#'+parentId + ' .question__after-send').show();
							$('#'+parentId + ' .question-message').hide();

		                        
							$('#'+parentId + ' form').hide();
							}*/
							
							d3.select('#'+parentId + ' .question__after-send h2')
                			.text(sendText + ' ' + data[picked].label);
							
							$('#'+parentId + ' .question__after-send').show();
							$('#'+parentId + ' .lpc-popup-fortune__step-2').show();
							
							createCookie("lpcfortune2text", sendText + ' ' + data[picked].label, $new_minut2);
							
							//container.on("click", spin);
						});
					
				}
				
				//make arrow
				svg.append("g")
					.attr("transform", "translate(" + (w - 42) + "," + ((h / 2) - 25) + ")")
					.append("path")
					.attr("class", "wheel-indicator")
					.attr("d", "M40.0261 10.6195L11.9636 23.1737C10.386 23.8795 10.386 26.1192 11.9637 26.825L40.0261 39.3793C41.3491 39.9712 42.8428 39.003 42.8428 37.5536V12.4451C42.8428 10.9957 41.3491 10.0276 40.0261 10.6195Z")
					.style({
						"fill": "white"
					});
				
				//draw spin circle
				container.append("circle")
					.attr("cx", 0)
					.attr("cy", 0)
					.attr("r", 20)
					.attr("stroke", "#fff")
					.attr("stroke-width", "7")
					.attr("class", "inner-circle")
					.style({
						"fill": "var(--primary-color-base)"
					});

				container.append("circle")
					.attr("cx", 0)
					.attr("cy", 0)
					.attr("r", 230)
					.attr("stroke", "#fff")
					.attr("class", "outer-circle")
					.attr("stroke-width", "10")
					.style({
						"fill": "transparent"
					});
					
				function rotTween(to) {
					var i = d3.interpolate(oldrotation % 360, rotation + rotate);
					return function(t) {
						return "transform: rotate(" + i(t) + "deg)";
					};
				}
			});
		}
  	};

	lpc_template.queue.calendar = function ($self) {
		$doc.on("click", ".lpc-js-form-calendar", function () {
			var $this = $(this),
				thisCalendarInited = $this.data("calendarInited");
				
			var clickPosY = event.clientY || event.pageY;
		    var windowHeight = $(window).height();
		    var clickPosition = (windowHeight - clickPosY);	
				
			//if (!thisCalendarInited) {
			if (clickPosition < 263) {
				var bb = $this
					.datepickerlpc({
						position: 'top left'
					})
					.data("datepickerlpc");
				bb.show();
				thisCalendarInited = $this.data("calendarInited", true);
			}else {
				var bb = $this
					.datepickerlpc({
						position: 'bottom left'
					})
					.data("datepickerlpc");
				bb.show();
				thisCalendarInited = $this.data("calendarInited", true);
			}
		});
	
		$doc.on("click", ".lpc-js-form-calendar-interval", function () {
			var $this = $(this),
				thisCalendarInited = $this.data("calendarInited");
				
			var clickPosY = event.clientY || event.pageY;
		    var windowHeight = $(window).height();
		    var clickPosition = (windowHeight - clickPosY);		
	
			//if (!thisCalendarInited) {
			if (clickPosition < 263) {	
				var bb = $this
					.datepickerlpc({
						position: 'top left',
						range: true,
						multipleDatesSeparator: " - ",
					})
					.data("datepickerlpc");
				bb.show();
				thisCalendarInited = $this.data("calendarInited", true);
			}else {
				var bb = $this
					.datepickerlpc({
						position: 'bottom left',
						range: true,
						multipleDatesSeparator: " - ",
					})
					.data("datepickerlpc");
				bb.show();
				thisCalendarInited = $this.data("calendarInited", true);
			}
		});
	};
	
	lpc_template.queue.anchorMenu = function ($self) {
		let $block = $self.find('.lpc_anchor_menu_init');
	
		if ($block.length) {
			let links = $block.find('.lpc-anchor-menu-fixed__link');
			let choiceElem = $block.attr('data-lpc-choice-elem');
			let booleanValue = (choiceElem === 'true');
			let fixedBlock = $block.find('.lpc-anchor-menu-fixed');
			let mosaicWrap = $(document).find('.mosaic-wrap');
			let button = $block.find('.lpc-anchor-menu-fixed__button-text');
			let $lpcWrap = $('.decor-wrap');

			let hiddenBlockIds = [];
			
			$lpcWrap.each(function () {
			    let $this = $(this);
			
			    if (s3LP.is_cms) {
			        $this.find('.popup-row-block').each(function() {
			            let s3lpPopupValue = $(this).find('[data-blocks-popup]').data('blocks-popup');
			            hiddenBlockIds.push(s3lpPopupValue);
			        });
			    } else {
			        let blocksPopupValue = $this.find('[data-blocks-popup]').data('blocks-popup');
					let blocksPopupValue2 = $this.find('._hide-block').data('block-id');
					
					hiddenBlockIds.push(blocksPopupValue === undefined ? blocksPopupValue2 : blocksPopupValue);
			    }
			});
			
			if (isMobile) {
			    let touchStartX = 0, touchEndX = 0;
			    let isActive = false;
			    
			    button.on('click', function () {
			        if (isActive && fixedBlock.hasClass('active')) {
			            fixedBlock.removeClass('active');
			            isActive = false;
			        } else {
			            fixedBlock.addClass('active');
			            isActive = true;
			        }
			    });
			
			    button.on('touchstart', function(e) {
			        touchStartX = e.originalEvent.touches[0].clientX;
			    });
			
			    button.on('touchmove', function(e) {
			        touchEndX = e.originalEvent.touches[0].clientX;
			    });
			
			    button.on('touchend', function(e) {
			        handleButtonSwipe();
			    });
			
			    function handleButtonSwipe() {
			        var swipeLength = touchEndX - touchStartX; 
			        if (swipeLength > 100) {
			            fixedBlock.removeClass('active'); 
			        } else if (swipeLength < -100) {
			            fixedBlock.addClass('active'); 
			        }
			       
			        touchStartX = 0;
			        touchEndX = 0;
			    }
			    
			    $(document).on('keydown', function (e) {
			        if (e.keyCode === 27) {
			            fixedBlock.removeClass('active');
			        }
			    });
			
			    $(document).on('click', function (e) {
			        if (!$(e.target).closest('.lpc-anchor-menu-fixed').length) {
			            fixedBlock.removeClass('active');
			        }
			    });
			}

			setTimeout(function(){
				let buttonHeight = $block.find('.lpc-anchor-menu-fixed__button').outerHeight();
				let listHeight = $block.find('.lpc-anchor-menu-fixed__list').outerHeight();
				let listBlock = $block.find('.lpc-anchor-menu-fixed__list');
				
				var $wrapBlock = $block.closest('.lpc-anchor-menu');
			    var blockId = $wrapBlock.attr('id');
			    var blockLayout = $wrapBlock.attr('data-block-layout');
				
				if (buttonHeight === listHeight) {
				    listBlock.addClass('no-border-radius');
				} else {
					listBlock.removeClass('no-border-radius');
				}
				
				if (mosaicWrap.length && !$block.hasClass('lpc_constructor')) {
					mosaicWrap.prepend(fixedBlock);
					
					fixedBlock.attr('id', blockId);
				    fixedBlock.attr('data-block-layout', blockLayout);
				}
				
			}, 350);
			
			links.each(function () {
			    let $this = $(this);
			    let blockId = $this.attr('href').replace('#', '');
			    let offsetValue = parseFloat($this.attr('data-lpc-offset'));
			    let offsetValueMobile = parseFloat($this.attr('data-lpc-offset-mobile'));
			    let targetBlock = $('#' + blockId);
			    let headerElements = targetBlock.find('[data-elem-type="header"]:not(.lpc-list-illustration__title--hidden)'); 
			    
			    let blockPopupId = parseFloat($this.attr('href').replace(/\D/g, '')); // Получаем id блока из атрибута href
				
				if (hiddenBlockIds.includes(blockPopupId)) {
					$this.parent('.lpc-anchor-menu-fixed__item').remove();
				}
			   	
		   		if (headerElements.length > 0 && $this.hasClass('lpc-has-block-name')) {
		    		let headerText = headerElements.first().text(); 
		        	$this.text(headerText);
			    }
			
			    if (booleanValue === false && headerElements.length === 0) {
			        if ($this.length > 0) {
					    $this.parent().remove();
					}
			    } else {
			        $this.on('click', function (event) {
			            event.preventDefault();
			
			            links.removeClass('active');
			            $this.addClass('active');
        
				        if (targetBlock.length) {
				        	
				        	var targetBlockOffset = isMobile ? targetBlock.offset().top - offsetValueMobile : targetBlock.offset().top - offsetValue;
				        	
				            $('html, body').stop().animate({
				                scrollTop: targetBlockOffset
				            }, 800, function () {
				                history.pushState(null, null, '#' + blockId);
				            });
				        }
			        });
			    }
			    
			    links.removeClass('lpc-opacity');
			    
			});
		}
	};
	
	lpc_template.queue.fixedSocialsBox = function ($self) {

		const $block = $self.find('.fixed-socials-init');
		if (!$block.length) return;
			
		$block.each(function () {
			let $box = $(this);
			let $fixedBlock = $box.find('.lpc-fixed-socials-box');
			let $container = $box.find('.lpc-fixed-socials-box__container');
			let $button = $box.find('.lpc-fixed-socials-box__button');
			let $mosaicWrap = $(document).find('.mosaic-wrap');
			let offsetDesktop = $fixedBlock.data('lpc-offset');
			let offsetMobile = $fixedBlock.data('lpc-offset-mobile');
	
			if (isMobile) {
				$fixedBlock.css('margin-top', offsetMobile + 'px');
			} else {
				$fixedBlock.css('margin-top', offsetDesktop + 'px');
			}
			
			setTimeout(function () {
				if ($mosaicWrap.length && !$box.hasClass('lpc_constructor')) {
					$mosaicWrap.prepend($fixedBlock);
				}
			}, 350);
			
			$button.on('click', function (e) {
				e.stopPropagation();
	
				const isOpen = $container.hasClass('is-open');
				
				$('.lpc-fixed-socials-box__container.is-open').not($container).removeClass('is-open');
				
				if (!isOpen) {
					$container.addClass('is-open');
				} else {
					$container.removeClass('is-open');
				}
			});
			
			$(document).on('click.fixedSocials', function (e) {
				if (!$(e.target).closest($container).length) {
					$container.removeClass('is-open');
				}
			});
		});
	};
	
	lpc_template.queue.movingPictures = function ($self) {
	    let $block = $self.find('.lpc_moving_pictures_init');
	
	    if ($block.length) {
	    	
	        setTimeout(function () {
	        	
	            $block.each(function () {
	                let $this = $(this),
	                    $wrapper = $this.find('.lpc_moving_pictures_wrap'),
	                    $marquee = $this.find('.lpc_moving_pictures_move'),
	                    marqueeSpeed = $this.data('marquee-speed') || 1,
	                	speed = marqueeSpeed,
	                    position = 0,
	                    animationFrame,
	                    wrapperWidth = $wrapper[0].offsetWidth,
	                    direction = 'left',
	                    isInMiddle = false,
	                    totalWidth = 0;
	
	                if (!s3LP.is_cms) {
	                	
	                    $marquee.find('.lpc_moving_pictures_item').each(function () {
	                        totalWidth += $(this).outerWidth(true);
	                    });
	
	                    while (totalWidth < wrapperWidth) {
	                        $marquee.find('.lpc_moving_pictures_item').each(function () {
	                            let $clone = $(this).clone();
	                            $marquee.append($clone);
	                            totalWidth += $clone.outerWidth(true);
	                        });
	                    }
	
	                    let clonedContent = $marquee.html();
	                    $marquee.html(clonedContent + clonedContent);
	                    
	                } else {
	                	
	                	function s3lazyLoadImages() {
	                		
		                	const $s3lazyImage = $(".lpc-ticker__carousel-mask-item img[data-src]");
							
		                    const s3LoadImage = (image) => {
		                        const src = $(image).attr('data-src');
								
		                        if (src) {
		                            $(image).attr('src', src);
		                            $(image).removeAttr('data-src');
		                        }
		                    };
		                    
		                    $s3lazyImage.each(function () {
		                        s3LoadImage(this);
		                    });
		                }
		                
		                s3lazyLoadImages();
	                }
	
	                let marqueeWidth = totalWidth;
	                
	                function lazyLoadImages() {
						const $lazyImage = $(".lpc-ticker__carousel-mask-item img[data-src]");
						
	                    const loadImage = (image) => {
	                        const src = $(image).attr('data-src');
							
	                        if (src) {
	                            $(image).attr('src', src);
	                            $(image).removeAttr('data-src');
	                        }
	                    };
	                    
	                    const isImageVisible = (image) => {
	                        let imgLeft = $(image).offset().left,
	                            imgRight = imgLeft + $(image).outerWidth(),
	                            wrapperLeft = $wrapper.offset().left,
	                            wrapperRight = wrapperLeft + $wrapper.outerWidth();
	
	                        return imgRight > wrapperLeft && imgLeft < wrapperRight;
	                    };
	                    
	                    $lazyImage.each(function () {
	                        if (isImageVisible(this)) {
	                            loadImage(this);
	                        }
	                    });
	                }
	
	                function move() {
	                    window.cancelAnimationFrame(animationFrame);
	
	                    if (direction === 'left') {
	                        position -= speed;
	                    } else {
	                        position += speed;
	                    }
	
	                    if (!s3LP.is_cms) {
	                    	
	                        if (direction === 'left' && position <= -marqueeWidth) {
	                            position = 0;
	                        } else if (direction === 'right' && position >= 0) {
	                            position = -marqueeWidth;
	                        }
	
	                        $marquee.css('transform', 'translate3d(' + position + 'px, 0, 0)');
	
	                        animationFrame = window.requestAnimationFrame(move);
	                        
	                        lazyLoadImages();
	
	                    } else {
	                    	
	                        if (direction === 'left' && position <= -(marqueeWidth - wrapperWidth)) {
	                            window.cancelAnimationFrame(animationFrame);
	                            return;
	                        } else if (direction === 'right' && position >= 0) {
	                            window.cancelAnimationFrame(animationFrame);
	                            return;
	                        }
	
	                        $marquee.css('transform', 'translate3d(' + position + 'px, 0, 0)');
	
	                        animationFrame = window.requestAnimationFrame(move);
	                    }
	                }
	
	                move();
	
	                var leftRightZoneWidth = wrapperWidth * 0.4;
	                var middleZoneWidth = wrapperWidth * 0.2;
	
	                var getZone = function (posX) {
	                    if (posX < leftRightZoneWidth) {
	                        return 'left';
	                    } else if (posX > wrapperWidth - leftRightZoneWidth) {
	                        return 'right';
	                    } else {
	                        return 'middle';
	                    }
	                };
	
	                var prevMouseX;
	                var minSpeed = speed;
	
	                var handleMove = function (event, isTouch = false) {
	                    var posX = isTouch ? event.originalEvent.touches[0].pageX - $wrapper[0].getBoundingClientRect().left : event.pageX - $wrapper[0].getBoundingClientRect().left;
	                    var zone = getZone(posX);
	                    var speedIncrement = 0.03;
	                    var maxSpeed = speed + (speed * 0.5);
	
	                    if (zone === 'left') {
	                        direction = 'right';
	
	                        if (prevMouseX !== undefined) {
	                            var distanceMoved = prevMouseX - posX;
	                            speed += distanceMoved * speedIncrement;
	                            speed = Math.max(minSpeed, Math.min(speed, maxSpeed));
	                        }
	
	                        prevMouseX = posX;
	
	                    } else if (zone === 'right') {
	                        direction = 'left';
	
	                        if (prevMouseX !== undefined) {
	                            var distanceMoved = posX - prevMouseX;
	                            speed += distanceMoved * speedIncrement;
	                            speed = Math.max(minSpeed, Math.min(speed, maxSpeed));
	                        }
	
	                        prevMouseX = posX;
	
	                    } else if (zone === 'middle') {
	                        window.cancelAnimationFrame(animationFrame);
	                        isInMiddle = true;
	                        prevMouseX = posX;
	                        return;
	                    }
	
	                    if (isInMiddle) {
	                        isInMiddle = false;
	                        move();
	                    }
	                };
	
	                if (isMobile) {
	                    $wrapper.on('touchmove', function (event) {
	                        handleMove(event, true);
	                    });
	
	                    $wrapper.on('touchend', function () {
	                        speed = minSpeed;
	                        prevMouseX = undefined;
	                        move();
	                    });
	                } else {
	                    $wrapper.on('mousemove', handleMove);
	
	                    $wrapper.on('mouseleave', function () {
	                        speed = minSpeed;
	                        prevMouseX = undefined;
	                        move();
	                    });
	                }
	            });
	            
	            lpc_template.queue.lgNew($block);
	
	        }, 500);
	    }
	};
	
	lpc_template.queue.QRcode = function ($self) {
		let $block = $self.find('.lpc_qr_init');
	
		if ($block.length) {
			$block.each(function () {
				let item = $(this);
				let messengerWrap = item.find('.lpc_qr_code_item');
			
				messengerWrap.each(function () {
					let item = $(this);
					let containerQr = item.find('.lpc_qr_code_container');
					let containerQrPhone = item.find('.lpc_qr_code_container_phone');
			
					let messengerLinks = item.find('.lpc_qr_code_link');
					let messengerLinksPhone = item.find('.lpc_qr_code_link_phone');
			
					let urls = messengerLinks.map(function () {
						return $(this).attr('href');
					}).get();
			
					let urlsPhone = messengerLinksPhone.map(function () {
						return $(this).attr('href').replace(/[^\d+]/g, '');
					}).get();
			
					let sizes = messengerLinks.map(function () {
						return $(this).attr('data-qr-code-size');
					}).get();
			
					let sizesPhone = messengerLinksPhone.map(function () {
						return $(this).attr('data-qr-code-size');
					}).get();
			
					urls.forEach(function (url, index) {
						if (containerQr.length) {
							createQR(containerQr.eq(index), sizes[index], url);
							$('body').append(containerQr.eq(index));
						}
					});
			
					urlsPhone.forEach(function (url, index) {
						if (containerQrPhone.length) {
							createQR(containerQrPhone.eq(index), sizesPhone[index], url);
							$('body').append(containerQrPhone.eq(index));
						}
					});
			
					messengerLinks.hover(function () {
						let index = messengerLinks.index(this);
						showQR(containerQr.eq(index), $(this));
					}, function () {
						let index = messengerLinks.index(this);
						hideQR(containerQr.eq(index));
					});
			
					messengerLinksPhone.hover(function () {
						let index = messengerLinksPhone.index(this);
						showQR(containerQrPhone.eq(index), $(this));
					}, function () {
						let index = messengerLinksPhone.index(this);
						hideQR(containerQrPhone.eq(index));
					});
			
					let activeQR = null;
			
					function createQR(container, size, url) {
						container.qrcode({
							width: size,
							height: size,
							text: url
						}).css({
							position: 'absolute',
							display: 'none',
							zIndex: 10
						});
					}
			
					function showQR(container, link) {
						const linkRect = link[0].getBoundingClientRect();
						const containerWidth = container.outerWidth();
						const containerHeight = container.outerHeight();
			
						let left = linkRect.left;
						let top = linkRect.top - containerHeight - 10;
			
						if (left + containerWidth > $(window).width()) {
							left = linkRect.left + link.outerWidth() - containerWidth;
						}
			
						container.css({
							top: top + 'px',
							left: left + 'px',
							display: 'block',
							position: 'fixed'
						});
			
						activeQR = container;
					}
			
					function hideQR(container) {
						container.css({
							display: 'none'
						});
			
						if (activeQR && container.is(activeQR)) {
							activeQR = null;
						}
					}
					
					$(window).off('scroll.hideQR').on('scroll.hideQR', function () {
						if (activeQR) {
							activeQR.hide();
							activeQR = null;
						}
					});
				});
			});
		}
	};
	
	
	
	lpc_template.queue.rowMenu = function ($self) {
		let $block = $self.find('.lpc-row-menu');
	
		function rowMenuItems() {
			$block.each(function () {
				let $this = $(this);
				let $menu = $this.find('.lpc-menu-horizontal__list');
				let $toggleButton = $this.find('.lpc-menu-horizontal__more');
	
				let hideText = document.querySelector('html').getAttribute('lang') === 'ru' ? 'Скрыть' : 'Hide';
				let currentText = document.querySelector('html').getAttribute('lang') === 'ru' ? 'Ещё' : 'Show more';
	
				let $insTextButton = $toggleButton.find('ins');
				let $hiddenItems = $menu.find('li:not(.lpc-menu-horizontal__more):hidden');
				
				if ($hiddenItems.length) {
					$toggleButton.addClass('show');
				}
				
				$toggleButton.off('click').on('click', function () {
					$toggleButton.toggleClass('active');
					$menu.toggleClass('lpc-menu-horizontal__list--show-items');
					$insTextButton.text($toggleButton.hasClass('active') ? hideText : currentText);
				});
			});
		}
	
		rowMenuItems();
	
		document.addEventListener('dataMediaSourceChange', rowMenuItems);
	};
	
	
	lpc_template.queue.lpcFlexImageBlock = function ($self) {
		const paramsGet = new URLSearchParams(window.location.search);
		if(paramsGet.has('lpc_test')){	
			if(typeof ReactLPConstructor == 'object') {
				var $block = $self.find('.lpc-flexible-image-js') ? $self : $self.hasClass('.lpc-flexible-image-js');
			}else {
				var $block = $self.hasClass('.lpc-flexible-image-js') ? $self : $self.find('.lpc-flexible-image-js');
			}
	
			if($block.length) {
				$block.each(function () {
					let $item = $(this);
					let $itemId = $item.attr('id');			
					
					let $imgInit = `#${$itemId}.lpc-flexible-image-js`;
					
					function flexibleImage(parent){
						
						let blockParent = document.querySelector(parent);
						let inner = blockParent.querySelector('.lpc-flexible-image__inner-js');
						let list = blockParent.querySelector('.lpc-flexible-image__list-js'); 
						
						let wrap = blockParent.querySelector('.lpc-flexible-image__wrap-js');
						let wrapWidth = wrap.offsetWidth;
						
						let blockParentWidth = blockParent.offsetWidth;
						
						list.style.width = blockParentWidth + 'px';
						
						let inWrap = blockParent.querySelector('.lpc-flexible-image__in-wrap-js');
						
						let docWidth = document.documentElement.clientWidth;
						
						let WrapPos = wrap.getBoundingClientRect();
						
						//console.log(WrapPos.left)
						
						//inWrap.style.marginLeft = -WrapPos.left + 'px';
						//inWrap.style.marginRight = -(WrapPos.right - wrapWidth) + 'px';
						
						let inWrapMarginLeft = WrapPos.left;
						let inWrapMarginRight = (docWidth - WrapPos.right);
						
						inWrap.style.marginLeft = -inWrapMarginLeft + 'px';
						inWrap.style.marginRight = -inWrapMarginRight + 'px';
						
						//console.log(inWrapMarginLeft)
						//console.log(inWrapMarginRight)
						
						//let itemMarginRight = docWidth - slideWrap.getBoundingClientRect().right;
							
						inner.classList.add('load');
						
						
						let listGapStr = getComputedStyle(list).gridGap
						
						if(listGapStr === 'normal'){
							listGapStr = '32px';
						}
						
						let listGap = parseInt(listGapStr);
						
						
						let blockOutDivision = 8;
						let innerMargin = (wrapWidth - (listGap * 3)) / blockOutDivision;
						
						//console.log(innerMargin)
						
						let innerMarginLeft = 0;
						let innerMarginRight = 0;
						
						if(inWrapMarginLeft !== inWrapMarginRight){
							innerMarginLeft = innerMargin - ((inWrapMarginLeft - inWrapMarginRight) / 2);
							innerMarginRight = innerMargin + ((inWrapMarginLeft - inWrapMarginRight) / 2);
						}  else {
							innerMarginLeft = innerMargin;
							innerMarginRight = innerMargin;
						}
						
						inner.style.marginLeft = -innerMarginLeft + 'px';
						inner.style.marginRight = -innerMarginRight + 'px';
						
						let innerWidth = inner.offsetWidth;
						let innerHeight = inner.offsetHeight;
						
						let listStageWidth = innerWidth - blockParentWidth;
						
						//console.log(innerWidth)
						
						let images = blockParent.querySelectorAll('.lpc-flexible-image__image-js');
						
						let miniImageWidth = (blockParentWidth - listGap * 3) / 4;
						
						
						list.style.gridTemplateColumns = miniImageWidth + 'px ' + 'auto ' + 'auto ' + miniImageWidth + 'px';
						
						if(images[0]){
						
							let imageBig = images[0];
							
							if(imageBig.classList.contains('_1_1')) {
								
								imageBig.style.height = blockParentWidth / 2  + 'px';
								
							} else if (imageBig.classList.contains('_4_3h')) {
								
								
								imageBig.style.height = blockParentWidth * 3 / 8 + 'px';
								
							} else if (imageBig.classList.contains('_3_2h')) {
								
								imageBig.style.height = blockParentWidth / 3 + 'px';
								
							} else if (imageBig.classList.contains('_16_9h')) {
							
								
								imageBig.style.height = blockParentWidth * 9 / 30 + 'px';
								
							} else if (imageBig.classList.contains('_4_3v')) {
							
								
								imageBig.style.height = blockParentWidth * 2 / 3 + 'px';
								
							} else if (imageBig.classList.contains('_3_2v')) {
							
								
								imageBig.style.height = blockParentWidth * 3 / 4 + 'px';
								
							} else if (imageBig.classList.contains('_16_9v')) {
							
								
								imageBig.style.height = blockParentWidth * 8 / 9 + 'px';
								
							}
							
							
							
						}
						
						let heightStep = 0;
						
						heightStep = 40;
						
						
						function updateHeightStep() {
						    const decorWrap = document.querySelector('.decor-wrap');
						    if (decorWrap) {
						        const mediaSource = decorWrap.getAttribute('data-media-source');
						        if (mediaSource === 'media-xl' || mediaSource === 'media-lg' || mediaSource === 'media-md') {
						            heightStep = 40;
						        } else if (mediaSource === 'media-sm' || mediaSource === 'media-xs') {
						            heightStep = 60;
						        }
						    }
						}
						
						// Наблюдатель за изменениями атрибута data-media-source
						const observer = new MutationObserver(updateHeightStep);
						
						// Начало наблюдения за элементом
						const decorWrap = document.querySelector('.decor-wrap');
						if (decorWrap) {
						    observer.observe(decorWrap, {
						        attributes: true, // Наблюдаем за изменениями атрибутов
						        attributeFilter: ['data-media-source'] // Фильтруем только изменения атрибута data-media-source
						    });
						}
						
						// Вызов функции для первоначальной установки значения
						updateHeightStep();
						
						
						
						
						let heightStepArr = [heightStep, heightStep - 10, heightStep - 20, heightStep - 30]
						
						
						//console.log(heightStepArr)
						
						
						
						let listNewWidth = blockParentWidth;
						
						let windowHeight = document.documentElement.clientHeight;
						
						let topStagePercent = 0;
						
						let debounceTimer;
						
						window.addEventListener('scroll', function(event){
							clearTimeout(debounceTimer);
							
							debounceTimer = setTimeout(function () {
								updateListWidth()
							}, 5);
						})
						
						updateListWidth()
						
						function updateListWidth() {
							topStagePercent = Math.round(list.getBoundingClientRect().top / windowHeight * 100);
						
							//console.log(topStagePercent);
							
							if(inner.classList.contains('_rotate_left')){
								
								if(topStagePercent < heightStepArr[0] && topStagePercent >= heightStepArr[1]){
									list.style.width = listNewWidth + (listStageWidth / 4)  + 'px';
									inner.style.transform = 'rotate(-' + 1 + 'deg)';
									
								} else if (topStagePercent < heightStepArr[1] && topStagePercent >= heightStepArr[2])	{	
									list.style.width = listNewWidth + (listStageWidth / 2)  + 'px';
									inner.style.transform = 'rotate(-' + 2 + 'deg)';
									
								} else if (topStagePercent < heightStepArr[2] && topStagePercent >= heightStepArr[3])	{
									list.style.width = listNewWidth + (listStageWidth / 4 * 3)  + 'px';
									inner.style.transform = 'rotate(-' + 3 + 'deg)';
									
								} else if (topStagePercent < heightStepArr[3])	{
									list.style.width = listNewWidth + listStageWidth  + 'px';
									inner.style.transform = 'rotate(-' + 4 + 'deg)';
									
								} else {
									listNewWidth = blockParentWidth
									list.style.width = listNewWidth + 'px';
									inner.style.transform = 'rotate(' + 0 + 'deg)';
									
								}
								
							} else if(inner.classList.contains('_rotate_right')){
							
								if(topStagePercent < heightStepArr[0] && topStagePercent >= heightStepArr[1]){
									list.style.width = listNewWidth + (listStageWidth / 4)  + 'px';
									inner.style.transform = 'rotate(' + 1 + 'deg)';
									
								} else if (topStagePercent < heightStepArr[1] && topStagePercent >= heightStepArr[2])	{	
									list.style.width = listNewWidth + (listStageWidth / 2)  + 'px';
									inner.style.transform = 'rotate(' + 2 + 'deg)';
									
								} else if (topStagePercent < heightStepArr[2] && topStagePercent >= heightStepArr[3])	{
									list.style.width = listNewWidth + (listStageWidth / 4 * 3)  + 'px';
									inner.style.transform = 'rotate(' + 3 + 'deg)';
									
								} else if (topStagePercent < heightStepArr[3])	{
									list.style.width = listNewWidth + listStageWidth  + 'px';
									inner.style.transform = 'rotate(' + 4 + 'deg)';
									
								} else {
									listNewWidth = blockParentWidth
									list.style.width = listNewWidth + 'px';
									inner.style.transform = 'rotate(' + 0 + 'deg)';
									
								}
								
							} else {
							
							//console.log(listNewWidth)
								
								if(topStagePercent < heightStepArr[0] && topStagePercent >= heightStepArr[1]){
									list.style.width = listNewWidth + (listStageWidth / 4)  + 'px';
									
								} else if (topStagePercent < heightStepArr[1] && topStagePercent >= heightStepArr[2])	{	
									list.style.width = listNewWidth + (listStageWidth / 2)  + 'px';
									
								} else if (topStagePercent < heightStepArr[2] && topStagePercent >= heightStepArr[3])	{
									list.style.width = listNewWidth + (listStageWidth / 4 * 3)  + 'px';
									
								} else if (topStagePercent < heightStepArr[3])	{
									list.style.width = listNewWidth + listStageWidth  + 'px';
									
								} else {
									listNewWidth = blockParentWidth
									list.style.width = listNewWidth + 'px';
									
								}
								
							}
						}
							
					}
	
	
					if (s3LP.is_cms) {
						if(document.querySelector($imgInit)){	
						
							document.addEventListener('lpcLoadingDone', function(){
								flexibleImage($imgInit);
							});
							
							setTimeout(function(){
								flexibleImage($imgInit);
							}, 1000)
								
						}
						
					}else{
						document.addEventListener('lpc_init_after', function () {
							let lpc_block = document.querySelector($imgInit);
							
							if (lpc_block) {
						        let observer = new IntersectionObserver((entries, observer) => {
						            entries.forEach(entry => {
						                if (entry.isIntersecting) {
						                    flexibleImage($imgInit);
						                    observer.unobserve(entry.target); // Остановить наблюдение после первого появления
						                }
						            });
						        }, { threshold: 0.1 }); // Запускать, когда хотя бы 10% блока в зоне видимости
						
						        observer.observe(lpc_block);
						    }
						});
						
						// Отслеживание изменения размера окна
						let currentWidth = window.innerWidth;
						
						window.addEventListener('resize', function () {
							
							setTimeout(function(){
							    if (window.innerWidth !== currentWidth) {
							        currentWidth = window.innerWidth;
							        let lpc_block = document.querySelector($imgInit);
							
							        if (lpc_block) {
							            let observer = new IntersectionObserver((entries, observer) => {
							                entries.forEach(entry => {
							                    if (entry.isIntersecting) {
							                        flexibleImage($imgInit);
							                        observer.unobserve(entry.target); // Остановить наблюдение после первого появления
							                    }
							                });
							            }, { threshold: 0.1 });
							
							            observer.observe(lpc_block);
							        }
							    }
							}, 500)
						    
						}, true);
						
					}
				});
			}
		}
	}	
	
	
	lpc_template.queue.lpcSliderMagic = function ($self) {
		
			//var $block = $self.hasClass('.lpc-flexible-image-js') ? $self : $self.find('.lpc-flexible-image-js');
	var $block = $self.hasClass('magic-slider') ? $self : $self.find('.magic-slider');
	if($block.length) {
		
		$block.each(function () {
			
			let $item = $(this);
			let $itemId = $item.attr('id');		
			
			let $sliderMagic = `#${$itemId}.magic-slider`;

			function sliderInit(parent){
		
				let sliderBlock = document.querySelector(parent);
				
				let decorWrap = document.querySelector('.decor-wrap');
				
				let mediaSource = decorWrap.getAttribute('data-media-source');
				
				if (!sliderBlock) return; // Проверка на существование элемента
				
				let sliderTrigger = Number(sliderBlock.getAttribute('data-trigger-hook'));
				
				let sliderContainer = sliderBlock.querySelector('.lpc-prods-m__magic-slider-container');
				
				let slider = sliderBlock.querySelector('.lpc-prods-m__magic-slider');
				
				let scrollWidth = 0;
				
				let slideBox = sliderBlock.querySelector('.lpc-prods-m__wrap-box');
				
				let sliderTitle = sliderBlock.querySelector('.magic-slider-header');
				
				//let sliderContainerWidth = sliderContainer;
				//слайды
				let slideItem = sliderBlock.querySelectorAll('.lpc-prods-m__magic-slide');
				
				// Количество слайдов
				let slideCount = slideItem.length;
				//console.log(sliderTrigger)
				
				let progress = 0;
				
				let itemGap = 0;
				
				let slideWrap = sliderBlock.querySelector('.lpc-magic-full-width-init');
				
				
				function sliderInitInter() {	
						
						let slideWidth = slideWrap.offsetWidth;
						
						let docWidth = document.documentElement.clientWidth;
						
						//let itemMargin = (docWidth - slideWidth) / 2;
						//console.log(slideWrap.getBoundingClientRect().left);
						//console.log(slideWrap.getBoundingClientRect().right - slideWidth);
						
						let itemMarginLeft = slideWrap.getBoundingClientRect().left;
						
						//let itemMarginRight = slideWrap.getBoundingClientRect().right - slideWidth
						let itemMarginRight = docWidth - slideWrap.getBoundingClientRect().right;
						
						//console.log(itemMarginLeft)
						//console.log(itemMarginRight)
						/*if(sliderBlock.classList.contains('magic-slider-full-width')){
							slideBox.style.marginLeft = '-' + itemMargin + 'px';
							slideBox.style.marginRight = '-' + itemMargin + 'px';
						}
						slideBox.style.marginLeft = '-' + itemMargin + 'px';
						slideBox.style.marginRight = '-' + itemMargin + 'px';*/
						
						slideBox.style.marginLeft = '-' + itemMarginLeft + 'px';
						slideBox.style.marginRight = '-' + itemMarginRight + 'px';
						
						/*if(!sliderBlock.classList.contains('magic-slider-full-width') && slideBox.classList.contains('magic-slider-container-block')){
							slideBox.style.marginLeft = 0;
							slideBox.style.marginRight = 0;
						}*/
						
						// Элементы
						
						if(sliderTitle){
							
							
							if(!sliderBlock.classList.contains('magic-slider-full-width')){
								sliderTitle.style.width = slideWidth + 'px';
								sliderTitle.style.marginLeft = itemMarginLeft + 'px';
							}
							
							if(!sliderBlock.classList.contains('magic-slider-full-width') && slideBox.classList.contains('magic-slider-container-block')){
								sliderTitle.style.marginLeft = 0;
							}
							
							if(sliderBlock.classList.contains('magic-slider-full-width') && slideBox.classList.contains('magic-slider-container-block')){
								sliderTitle.style.width = slideWidth + 'px';
								sliderTitle.style.marginLeft = itemMarginLeft + 'px';
							}
						}
						
						let itemWidth = 0;
						
						let coefficient = 0;
						
						if(sliderBlock.classList.contains('magic-slider-middle') && decorWrap.getAttribute('data-media-source') !== 'media-xs'){
							itemWidth = slideWidth / 3 * 2;
							coefficient = itemWidth / 2
							
						} else if (sliderBlock.classList.contains('magic-slider-small') && decorWrap.getAttribute('data-media-source') !== 'media-xs'){
							itemWidth = slideWidth / 2;
							coefficient = itemWidth
						} else {
							itemWidth = slideWidth;
						}
						
						let slideItemMarginLeft = 0;
						
						slideItemMarginLeft = parseInt(getComputedStyle(slideItem[0]).marginLeft);
						
						//let itemGap = 0;
						
						for(let i = 0; i < slideItem.length - 1; i++){
							itemGap += parseInt(getComputedStyle(slideItem[i]).marginRight);
						}
						
						//console.log(itemGap)
						
						//если контейнер и не на всю ширину блок
						
						if(!sliderBlock.classList.contains('magic-slider-full-width') && slideBox.classList.contains('magic-slider-container-block')){
						
							itemWidth = itemWidth - slideItemMarginLeft;
							
						}
						
						//настройка максимальной ширины слайда чтобы высота слайда не превышала 78vh
						
						let itemMaxHeight = window.innerHeight * 0.78;
						let aspectRatio = 16 / 9;
						
						let itemMaxWidth = itemMaxHeight * aspectRatio;
						
						let itemsCountWidth = 0
						let itemMathWidth = 0;
						let itemCount = 0;
						
						function slideSheetTarget(){
							slider.addEventListener('click', function(event){
								
								if(event.target.classList.contains('magic-item-sheet-btn')){
									let sheetBtn = event.target;
									let itemSheetContainer = sheetBtn.closest('.magic-item-column-slide');
									let sheet = itemSheetContainer.querySelector('.magic-item-sheet');
									let sheetClose = itemSheetContainer.querySelector('.magic-item-sheet-close');
									let sheetContainer = itemSheetContainer.querySelector('.magic-item-column-text');
									let itemSheetImage = itemSheetContainer.querySelector('.magic-item-column-image');
									
									let sheetContainerHeight = sheetContainer.offsetHeight;
									sheetContainer.style.minHeight = sheetContainerHeight + 'px';
									sheet.classList.remove('hidden-text');
									itemSheetContainer.classList.add('active');
									itemSheetImage.style.opacity = 0;
									
									/*************************************/
									
									if(progress !== 0 && progress !== 1){
										let transformMatrix = window.getComputedStyle(slider).transform;
										let translateX = 0;
										
										if (transformMatrix !== 'none') {
										    const matrixValues = transformMatrix.match(/matrix\((.+)\)/)[1].split(', ');
										    translateX = parseFloat(matrixValues[4]); 
										}
										
										/*let progressStatus = Math.round(progress * 100);
										
										console.log(progressStatus)*/
										
										//let itemScrollAmount = translateX;
										
										let itemScrollAmount = 0;
										
										//let scrollWidth = sliderBlock.scene.duration();
										
										//console.log(itemScrollAmount)
										
										let rect = itemSheetContainer.getBoundingClientRect();
									    let leftDistance = rect.left; // Расстояние от левого края экрана
									    let rightDistance = window.innerWidth - rect.right; // Расстояние от правого края экрана
									
									    //console.log("Левый край: " + leftDistance + "px, Правый край: " + rightDistance + "px");
									    
									    let windowWidth = document.documentElement.clientWidth;
									    
									    //console.log("Ширина viewport " + windowWidth)
									    
									    let itemSheetContainerWidth = itemSheetContainer.offsetWidth;
									    
									    //console.log("Ширина слайда " + itemSheetContainerWidth)
									    
									    let itemSheetContainerCenter = (windowWidth - itemSheetContainerWidth) / 2
									    
									    //console.log("количество пикселей для центровки " + itemSheetContainerCenter)
									    //console.log("полоса прокрутки " + scrollWidth)
									    
									    if(leftDistance > rightDistance){
									    	itemScrollAmount = leftDistance - itemSheetContainerCenter;
									    	
									    	//console.log("нужно прокрутить вправо на " + itemScrollAmount)
									    } else if(rightDistance > leftDistance){
									    	
									    	itemScrollAmount = rightDistance - itemSheetContainerCenter
									    	itemScrollAmount = -itemScrollAmount
									    
									    	//console.log("нужно прокрутить влево на " + itemScrollAmount)
									    }
										
										//itemScrollAmount = itemSheetContainer.offsetWidth + parseInt(getComputedStyle(itemSheetContainer).marginRight);
										
										let itemsSheet = [...slider.children]; // Преобразуем в массив
										
										// Определяем, первый ли это элемент
								        /*if (itemsSheet[0] === itemSheetContainer) {
								            console.log('Это первый элемент:');
								        }*/
								        // Определяем, последний ли это элемент
								        /*if (itemsSheet[itemsSheet.length - 1] === itemSheetContainer) {
								            console.log('Это последний элемент:');
								        }*/
										
										
										window.scrollBy({ top: itemScrollAmount, left: 0, behavior: "smooth" });
										//console.log(itemScrollAmount)
									}
									
									/*************************************/
									
									sheetClose.addEventListener('click', function(event){
										sheetContainer.style.minHeight = 0;
										sheet.classList.add('hidden-text');
										itemSheetContainer.classList.remove('active');
										itemSheetImage.style.opacity = 1;
									});
									
									window.addEventListener('resize', function(){
										sheetContainer.style.minHeight = 0;
										sheet.classList.add('hidden-text');
										itemSheetContainer.classList.remove('active');
										itemSheetImage.style.opacity = 1;
									})
									
									document.addEventListener('click', function(e){
										if (!e.target.closest('.lpc-prods-m-item')) {
											sheetContainer.style.minHeight = 0;
											sheet.classList.add('hidden-text');
											itemSheetContainer.classList.remove('active');
											itemSheetImage.style.opacity = 1;
										}
									});
								}
								
								
							});
						}
						
						slideSheetTarget()
						
						for(let i = 0; i < slideItem.length; i++){
							slideItem[i].style.width = itemWidth + 'px';
							slideItem[i].style.maxWidth = itemMaxWidth + 'px';
							
							
							let slideItemRow = slideItem[i].querySelector('.magic-slide-item-row');
								
							let slideItemRowHeight = slideItemRow.offsetHeight;
							
							let slideItemRowImage = slideItemRow.querySelector('.magic-item-column-image')
							let slideItemRowText = slideItemRow.querySelector('.magic-item-column-text')
							
							if (slideItemRowImage){
								let slideItemRowImageHeight = slideItemRowImage.offsetHeight;
								
								let newWidth = 0;
								
								if(decorWrap.getAttribute('data-media-source') === 'media-xs'){
								
									
									let slideItemRowTextTitle = slideItemRow.querySelector('.magic-item-column-text-title');
									let slideItemRowTextDesc = slideItemRow.querySelector('.magic-item-column-text-desc');
									let slideItemRowTextMobHeight = 0;
									
									if (slideItemRowTextTitle){
										let slideItemRowTextTitleHeight = slideItemRowTextTitle.offsetHeight;
										let slideItemRowTextTitleMargin = parseInt(getComputedStyle(slideItemRowTextTitle).marginBottom)
										
										slideItemRowTextMobHeight += slideItemRowTextTitleHeight + slideItemRowTextTitleMargin
									}
									
									if (slideItemRowTextDesc){
										let slideItemRowTextDescHeight = slideItemRowTextDesc.offsetHeight;
										
										slideItemRowTextMobHeight += slideItemRowTextDescHeight
										
									}
									
									if(slideItemRowImageHeight + slideItemRowTextMobHeight > slideItemRowHeight){
										
										while (slideItemRowImageHeight + slideItemRowTextMobHeight > slideItemRowHeight) {
											newWidth = slideItem[i].offsetWidth;
											slideItem[i].style.width = newWidth - 10 + "px";
											
											slideItemRowImageHeight = slideItemRowImage.offsetHeight;
											slideItemRowHeight = slideItemRow.offsetHeight;
											
											if(slideItemRowImageHeight + slideItemRowTextMobHeight <= slideItemRowHeight){
											
												break
											
											}
											
										}
									
									}
								
								
									
								} else {
								
									if(slideItemRowImageHeight > slideItemRowHeight){
										
										while (slideItemRowImageHeight > slideItemRowHeight) {
											newWidth = slideItem[i].offsetWidth;
											slideItem[i].style.width = newWidth - 10 + "px";
											
											slideItemRowImageHeight = slideItemRowImage.offsetHeight;
											slideItemRowHeight = slideItemRow.offsetHeight;
											
											if(slideItemRowImageHeight <= slideItemRowHeight){
											
												break
											
											}
											
										}
										
									}
								}
								
							}
							
							
							itemsCountWidth = itemsCountWidth + slideItem[i].offsetWidth;
							++itemCount;
							
							
						}
						
						
						itemMathWidth = itemsCountWidth / itemCount;
						
						
						
						if(sliderBlock.classList.contains('magic-slider-full-width')){
							
							let boxWidth = slideBox.clientWidth;
							sliderContainer.style.maxWidth = boxWidth + 'px';
						
							//scrollWidth = (itemMathWidth  * (slideCount - 1)) - (itemMargin * 2) + (slideItemMarginLeft * 2) + itemGap - coefficient - (itemWidth - itemMathWidth);
							
							scrollWidth = (itemMathWidth  * (slideCount - 1)) - (itemMarginLeft + itemMarginRight) + (slideItemMarginLeft * 2) + itemGap - coefficient - (itemWidth - itemMathWidth);
							
							
							if(slideBox.classList.contains('magic-slider-container-block')){
								
								let boxWidth = slideBox.clientWidth;
								sliderContainer.style.maxWidth = boxWidth + 'px';
								
								slideItem[0].style.marginLeft = itemMarginLeft + 'px';
								scrollWidth = itemMathWidth  * (slideCount - 1) + itemGap - coefficient - (itemWidth - itemMathWidth);
								
							}
							
						} else {
							
							/*if(!sliderBlock.classList.contains('magic-slider-full-width') && slideBox.classList.contains('magic-slider-container-block')){*/
							if(slideBox.classList.contains('magic-slider-container-block')){
							
								slideBox.style.marginLeft = 0;
								slideBox.style.marginRight = 0;
								
								let boxWidth = slideBox.clientWidth;
								
								sliderContainer.style.maxWidth = boxWidth + 'px';
								
								
								//scrollWidth = itemMathWidth  * (slideCount - 1) + itemGap - coefficient + (slideItemMarginLeft * 1);
								scrollWidth = itemMathWidth  * (slideCount - 1) + itemGap - coefficient - (itemWidth - itemMathWidth) + slideItemMarginLeft;
								
							
							} else {
								
								let boxWidth = slideBox.clientWidth;
								sliderContainer.style.maxWidth = boxWidth + 'px';
								
								slideItem[0].style.marginLeft = itemMarginLeft + 'px';
								scrollWidth = itemMathWidth  * (slideCount - 1) + itemGap - coefficient - (itemWidth - itemMathWidth);
								
							}
							
							
						}
				}		
				
				
				function sliderInitRemoveStyle(){
					slideBox.removeAttribute('style');
					
					if(sliderTitle) {
						sliderTitle.removeAttribute('style');
					}
					
					
					for(let i = 0; i < slideItem.length; i++){
						slideItem[i].removeAttribute('style');
					}
				}
				
				//тут был расчет ширины блоков, уехал на верх
				
				let controller = null; // Контроллер объявляем глобально
				let scene = null;
				
				destroySlider();
				
				function initSlider() {
					console.log("test");
				
					if(scrollWidth > 0) {
				
						controller = new ScrollMagic.Controller();
			    		sliderBlock.controller = controller;
			    		
			    		scene = new ScrollMagic.Scene({
					        triggerElement: sliderContainer,
					        duration: scrollWidth,
					        triggerHook: sliderTrigger,
					        offset: 0
					    })
					    .setPin(sliderContainer)
					    .on("progress", function (event) {
					        progress = event.progress;
					        let transformPos = Math.round(-scrollWidth * progress);
					        slider.style.transform = "translateX(" + transformPos + "px)";
					    })
					    .addTo(controller);
					
					    sliderBlock.scene = scene; // Сохраняем сцену
				    
				    } else {
				    	//console.log('off')
				    	
				    	sliderContainer.style.height = 'auto';
				    }
				
				}
				
				
				// Функция для уничтожения слайдера
				function destroySlider() {
				    if (sliderBlock.controller) {
				        sliderBlock.controller.destroy(true);
				        sliderBlock.controller = null;
				        slider.style.transform = "translateX(" + 0 + ")";
				        scene = null;
				    }
				}
				
				
				// Функция для обработки изменений атрибута
				function handleAttributeChange() {
				    mediaSource = decorWrap.getAttribute('data-media-source');
				    
				    if(sliderBlock.classList.contains('lpc_scroll_disable')) {
				
					    if (mediaSource === 'media-xs' || mediaSource === 'media-md' || mediaSource === 'media-sm') {
					    	
					    	sliderInitRemoveStyle()
					        destroySlider();
					    } else if (mediaSource === 'media-xl' || mediaSource === 'media-lg') {
					        if (!sliderBlock.controller) {
					        	sliderInitInter()
					            initSlider();
					        }
					    }
					    
					} else {
						if (!sliderBlock.controller) {
				            
				            if (mediaSource === 'media-xs') {
				            
				             	sliderInitInter()
				            	initSlider();
			            	
			            	} else if (mediaSource === 'media-xl' || mediaSource === 'media-lg' || mediaSource === 'media-md' || mediaSource === 'media-sm') {
			            		sliderInitInter()
				            	initSlider();
			            	}
				            
				        }
					}
				}
				
				// Запускаем наблюдатель за атрибутами
				let observer = new MutationObserver(handleAttributeChange);
				observer.observe(decorWrap, { attributes: true, attributeFilter: ['data-media-source'] });
				
				// Запускаем слайдер, если сразу media-xl
				handleAttributeChange();
				
			}

			if (s3LP.is_cms){
				
				if(document.querySelector($sliderMagic)){	
				
					document.addEventListener('lpcLoadingDone', function(){
						sliderInit($sliderMagic);
					});
					
					setTimeout(function(){
						sliderInit($sliderMagic);
					}, 1000)						
						
				}
				
			}else{
				
				document.addEventListener('lpc_init_after', function() {
					var sliderSelector = $sliderMagic;
					var sliderEl = document.querySelector(sliderSelector);
					if (!sliderEl) return; // если блока нет — выходим
					
					var sliderInitialized = false;
					
					// Функция для инициализации слайдера (однократно)
					function initSlider() {
						if (!sliderInitialized) {
							sliderInit(sliderSelector);
							sliderInitialized = true;
							// Если инициализация требуется только один раз, можно убрать слушатель скролла:
							window.removeEventListener('scroll', scrollHandler);
						}
					}
					
					// Проверяем, виден ли блок или уже был показан (например, если мы перезагрузили страницу ниже блока)
					function checkVisibility() {
						var rect = sliderEl.getBoundingClientRect();
						// Если верхняя граница блока меньше высоты окна – значит, блок либо виден, либо уже прошёл мимо
						if (rect.top < window.innerHeight) {
							initSlider();
						}
					}
					
					function scrollHandler() {
						checkVisibility();
					}
					
					// При загрузке страницы проверяем видимость блока
					checkVisibility();
					// Если блок ещё не был показан, следим за прокруткой
					window.addEventListener('scroll', scrollHandler);
					
					// При изменении размеров окна перезапускаем слайдер (как в исходном варианте)
					window.addEventListener('resize', function(){
						setTimeout(function(){
							// Если слайдер уже был инициализирован – обновляем его,
							// если ещё нет – проверяем видимость блока
							if (sliderInitialized) {
								sliderInit(sliderSelector);
							} else {
								checkVisibility();
							}
						}, 500);
					});
				});

			
			}
		});
	}
	}	
	
	
	let bgWatchers = {};

	lpc_template.queue.lpcDecorText = function($self) {
		var $block = $self.hasClass('lpc-elements-dynamic-headline') ? $self : $self.find('.lpc-elements-dynamic-headline');
		
		function initHeadline() {
			if($block.length) {
				$block.each(function () {
					let $item = $(this);
					let $itemId = $item.attr('id');
					let $title = `#${$itemId} .lpc-elements-dynamic-headline__title`;
					let $titleInit = `#${$itemId} .lpc-dynamic-title-init`;
					let $bgItem = `#${$itemId} .lp-block-bg_item`;
					let $overlayItem = `#${$itemId} .lp-block-overlay_item`;
					
	
					dynamicTextWidth($titleInit, $title);
	
					if (document.querySelector($title) && document.querySelector($title).classList.contains('bg_clip')) {
						dynamicTextBg($titleInit, $title, $bgItem, $overlayItem);
					};
	
					let observerTitle = bindObserver($title, $titleInit, $bgItem, $overlayItem);
	
	
					// Отслеживание изменений фона
					if (document.querySelector($title) && document.querySelector($title).classList.contains('bg_clip')) {
						let bgPrev, ovPrev;
	
						if (bgWatchers[$itemId]) {
							clearInterval(bgWatchers[$itemId]);
						}
						
						bgWatchers[$itemId] = setInterval(() => {
							const t = document.querySelector($title);
							if (!t || !t.classList.contains('bg_clip')) return;
						
							const bg = document.querySelector($bgItem);
							const ov = document.querySelector($overlayItem);
							if (!bg || !ov) return;
						
							const bgNow = getComputedStyle(bg).background;
							const ovNow = getComputedStyle(ov).background;
						
							if ((bgPrev && bgPrev !== bgNow) || (ovPrev && ovPrev !== ovNow)) {
								dynamicTextBg($titleInit, $title, $bgItem, $overlayItem);
							}
						
							bgPrev = bgNow;
							ovPrev = ovNow;
						}, 300);
					};
					
					$(document).on('click', '#publish_button, #cancel_all_button, .clear-control', function() {
						setTimeout(function () {
							// пересчёт размера
							dynamicTextWidth($titleInit, $title);
	
							// проверка фона
							dynamicTextBg($titleInit, $title, $bgItem, $overlayItem);
					
							// перезапуск наблюдения
							if (observerTitle) observerTitle.disconnect();
							observerTitle = bindObserver($title, $titleInit, $bgItem, $overlayItem);
						}, 50);
					});
	
	
					// Для ЛПЦ
					function waitForStylesheet(callback, delay = 500) {
						const interval = setInterval(() => {
							if (document.getElementById('lpc-stylesheet')) {
								clearInterval(interval);
								setTimeout(callback, delay);
							}
						}, 250);
					}
	
					waitForStylesheet(() => {
						dynamicTextWidth($titleInit, $title);
					}, 500);
					
					if (!s3LP.is_cms) {
						let initTimeout;
						
						$(window).on('resize', function(){
							clearInterval(initTimeout);
	
							initTimeout = setTimeout(function(){
								dynamicTextWidth($titleInit, $title);
	
								if (document.querySelector($title) && document.querySelector($title).classList.contains('bg_clip')) {
									dynamicTextBg($titleInit, $title, $bgItem, $overlayItem);
								};
							}, 50);
						});
					};
				});
			}
		};
	
		function bindObserver($title, $titleInit, $bgItem, $overlayItem) {
			let contentTitle = document.querySelector($title);
			if (!contentTitle) return;
		
			let observerTitle = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					if ($(mutation.target).closest('.lpc-dynamic-title-init').length) {
		
						if (mutation.type === "characterData" || mutation.type === "childList") {
							dynamicTextWidth($titleInit, $title);
	
							setTimeout(function () {
								let el = document.querySelector($title);
								if (el && el.classList.contains('bg_clip')) {
									dynamicTextBg($titleInit, $title, $bgItem, $overlayItem);
								}
							}, 100);
						}
					}
				});
			});
		
			observerTitle.observe(contentTitle, {
				childList: true,
				subtree: true,
				characterData: true
			});
		
			return observerTitle;
		};
		
		function dynamicTextWidth(parent, child) {
			let $dynamicWrap = $(parent);
			let $dynamicTitle = $(child);
		
			let dynamicTitleMinSize = 2;
			let dynamicTitleMaxSize = 55;
		
			function isMobile() {
				return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent)
					|| window.matchMedia("(max-width: 768px)").matches;
			}
		
			if (isMobile()) {
				dynamicTitleMinSize = 4.2;
			} else {
				if ($dynamicWrap.hasClass('lpc-full-width-init')) {
					dynamicTitleMinSize = 3.2;
				} else {
					dynamicTitleMinSize = 2;
				}
			}
		
			// Для центрирования блока если полная ширина
			if ($dynamicWrap.hasClass('lpc-full-width-init')) {
				let $dynamicBlockWrap = $dynamicWrap.closest('.lpc-full-width');
				let $dynamicBlockIn = $dynamicWrap.closest('.lpc-elements-dynamic-headline__wrap');
				let viewportWidth = $(window).width();
				let dynamicWrapMargin = (viewportWidth - $dynamicBlockWrap.outerWidth()) / 2;
		
				$dynamicBlockIn.css({
					'margin-left': `-${dynamicWrapMargin}px`,
					'margin-right': `-${dynamicWrapMargin}px`
				});
			}
		
			let min = dynamicTitleMinSize;
			let max = dynamicTitleMaxSize;
			let attempts = 0;
			let maxAttempts = 20; // защита от проклятий
		
			$dynamicTitle.css('white-space', 'nowrap');
		
			while (attempts < maxAttempts) {
				let mid = (min + max) / 2;
				$dynamicTitle.css('font-size', mid + 'vw');
		
				if ($dynamicTitle.outerWidth() > $dynamicWrap.outerWidth()) {
					max = mid;  // слишком большой размер
				} else {
					min = mid;  // можно попробовать больше
				}
		
				attempts++;
			}
		
			$dynamicTitle.css('font-size', min + 'vw');
			$dynamicTitle.css('opacity', 1);
		
			// Если крошечный текст — ворочаем переносы
			if (min <= dynamicTitleMinSize + 0.2) {
				$dynamicTitle.css('white-space', 'normal');
			}
		};
	
	
		function dynamicTextBg(parent, child, overlays, overlayItem) {
			if (document.querySelector(parent)) {
				let dynamicWrap = document.querySelector(parent);
				let dynamicTitle = dynamicWrap.querySelector(child);
		
				let titleOverlays = dynamicWrap.querySelectorAll(overlays);
				let titleOverlayLast = titleOverlays[titleOverlays.length - 1]
				let titleOverlayItem = titleOverlayLast.querySelector(overlayItem);
		
				if (titleOverlayLast) {
		
					let titleOverlayItemBg = getComputedStyle(titleOverlayItem).backgroundImage;
					let titleOverlayItemBgCol = getComputedStyle(titleOverlayItem).backgroundColor;
					let titleOverlayLastBg = getComputedStyle(titleOverlayLast).backgroundImage;
		
		
					if (titleOverlayItemBg !== 'none') {
		
						let computedStyles = window.getComputedStyle(titleOverlayLast);
		
						let bgProperties = [
							'background-image',
							'background-position',
							'background-size',
							'background-repeat',
							'background-attachment'
						];
		
						bgProperties.forEach(function (properties) {
							dynamicTitle.style[properties] = computedStyles.getPropertyValue(properties);
		
						})
		
						dynamicTitle.style.backgroundImage = titleOverlayItemBg + ', ' + titleOverlayLastBg;
		
					} else if (titleOverlayItemBgCol !== 'transparent' && titleOverlayItemBgCol !== 'rgba(0, 0, 0, 0)' && titleOverlayItemBgCol !== 'rgba(255, 255, 255, 0)') {
		
						let computedStyles = window.getComputedStyle(titleOverlayLast);
		
		
						let bgProperties = [
							'background-image',
							'background-position',
							'background-size',
							'background-repeat',
							'background-attachment'
						];
		
						bgProperties.forEach(function (properties) {
							if (bgProperties !== 'background-image') {
								dynamicTitle.style[properties] = computedStyles.getPropertyValue(properties);
							}
						})
		
						dynamicTitle.style.backgroundImage = 'linear-gradient(to right,' + titleOverlayItemBgCol + ', ' + titleOverlayItemBgCol + ')' + ', ' + titleOverlayLastBg;
		
					} else if ((titleOverlayItemBgCol === 'transparent' || titleOverlayItemBgCol === 'rgba(0, 0, 0, 0)') && titleOverlayLastBg === 'none') {
		
						let rootStyles = getComputedStyle(document.documentElement); // :root стили
						let bgColor = rootStyles.getPropertyValue('--text-color-base').trim();
		
						dynamicTitle.style.backgroundColor = bgColor;
						dynamicTitle.style.backgroundImage = 'none';
		
		
					} else {
		
						let computedStyles = window.getComputedStyle(titleOverlayLast);
						let bgProperties = [
							'background-image',
							'background-position',
							'background-size',
							'background-repeat',
							'background-attachment'
						];
		
						bgProperties.forEach(function (properties) {
							if (bgProperties !== 'background-image') {
								dynamicTitle.style[properties] = computedStyles.getPropertyValue(properties);
							}
		
							let value = computedStyles.getPropertyValue(properties);
							if (properties === 'background-image' && value === 'none') {
								dynamicTitle.style.removeProperty('background-image');
							}
						})
					}
		
					if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
						dynamicTitle.style.backgroundAttachment = 'scroll';
					}
				}
			}
		};
	
		document.addEventListener("lpc_init_after", function () {
			if (s3LP.is_cms) {
				setTimeout(function(){
					initHeadline();
				}, 200)
			};
		});
	};
	
	
	/*lpc_template.queue.lpcDecorText = function ($self) {
		var $block = $self.hasClass('lpc-elements-dynamic-headline') ? $self : $self.find('.lpc-elements-dynamic-headline');
		
		//const paramsGet = new URLSearchParams(window.location.search);
		//if(paramsGet.has('lpc_test')){
			
			if($block.length) {
				$block.each(function () {
					let $item = $(this);
					let $itemId = $item.attr('id');
	
					let $title = `#${$itemId} .lpc-elements-dynamic-headline__title`;
					let $titleInit = `#${$itemId} .lpc-dynamic-title-init`;
					let $bgItem = `#${$itemId} .lp-block-bg_item`;
					let $overlayItem = `#${$itemId} .lp-block-overlay_item`;
	
	
					function dynamicTextBg(parent, child, overlays, overlayItem){
						
						if(document.querySelector(parent)){
							let dynamicWrap = document.querySelector(parent);
							let dynamicTitle = dynamicWrap.querySelector(child);
							
							let titleOverlays = dynamicWrap.querySelectorAll(overlays);
							let titleOverlayLast = titleOverlays[titleOverlays.length - 1]
							let titleOverlayItem = titleOverlayLast.querySelector(overlayItem);
						
							if (titleOverlayLast) {
								
								let titleOverlayItemBg = getComputedStyle(titleOverlayItem).backgroundImage;
								let titleOverlayItemBgCol = getComputedStyle(titleOverlayItem).backgroundColor;				
								let titleOverlayLastBg = getComputedStyle(titleOverlayLast).backgroundImage;
							
								
								if(titleOverlayItemBg !== 'none'){
									
									let computedStyles = window.getComputedStyle(titleOverlayLast);
	
									let bgProperties = [
										'background-image',
										'background-position',
										'background-size',
										'background-repeat',
										'background-attachment'
									];
	
									bgProperties.forEach(function(properties){
										dynamicTitle.style[properties] = computedStyles.getPropertyValue(properties);
										
									})
									
									dynamicTitle.style.backgroundImage = titleOverlayItemBg + ', ' + titleOverlayLastBg;
									
								} else if(titleOverlayItemBgCol !== 'transparent' && titleOverlayItemBgCol !== 'rgba(0, 0, 0, 0)' && titleOverlayItemBgCol !== 'rgba(255, 255, 255, 0)'){
									
									let computedStyles = window.getComputedStyle(titleOverlayLast);
	
								
									let bgProperties = [
										'background-image',
										'background-position',
										'background-size',
										'background-repeat',
										'background-attachment'
									];
									
									bgProperties.forEach(function(properties){
										if(bgProperties !== 'background-image'){
											dynamicTitle.style[properties] = computedStyles.getPropertyValue(properties);
										}
									})
									
									dynamicTitle.style.backgroundImage = 'linear-gradient(to right,' + titleOverlayItemBgCol + ', ' + titleOverlayItemBgCol + ')' + ', ' + titleOverlayLastBg;
									
								} else if((titleOverlayItemBgCol === 'transparent' || titleOverlayItemBgCol === 'rgba(0, 0, 0, 0)') && titleOverlayLastBg === 'none') {
								
									let rootStyles = getComputedStyle(document.documentElement); // :root стили
									let bgColor = rootStyles.getPropertyValue('--text-color-base-header').trim();
									
									dynamicTitle.style.backgroundColor = bgColor;
									dynamicTitle.style.backgroundImage = 'none';
									
									
								} else {
								
									let computedStyles = window.getComputedStyle(titleOverlayLast);
									let bgProperties = [
										'background-image',
										'background-position',
										'background-size',
										'background-repeat',
										'background-attachment'
									];
									
									bgProperties.forEach(function(properties){
										if(bgProperties !== 'background-image'){
											dynamicTitle.style[properties] = computedStyles.getPropertyValue(properties);
										}	
	
										let value = computedStyles.getPropertyValue(properties);
										if (properties === 'background-image' && value === 'none') {
											dynamicTitle.style.removeProperty('background-image');
										}
									})
								}
								
								if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
									dynamicTitle.style.backgroundAttachment = 'scroll';
								}	
							}
						}
					}
					
					function dynamicTextWidth(parent, child){
						if (typeof ReactLPConstructor == 'object') {
							if (document.querySelector(parent) && document.querySelector(child)) {
						        let dynamicWrap = document.querySelector(parent);
						        let dynamicTitle = dynamicWrap.querySelector(child);
						
						        let dynamicTitleMinSize = 3.2;
						        let dynamicTitleMaxSize = 55;
						
						        // Определение мобильного
						        function isMobile() {
						            return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent) 
						                   || window.matchMedia("(max-width: 768px)").matches;
						        }
						
						        if (isMobile()) {
						            dynamicTitleMinSize = 4.2;
						        } else {
						            if (dynamicWrap.classList.contains('lpc-full-width-init')) {
						                dynamicTitleMinSize = 3.2;
						            } else {
						                dynamicTitleMinSize = 2;
						            }
						        }
						
						        // Если full-width, задаем отступы
						        if (dynamicWrap.classList.contains('lpc-full-width-init')) {
						            let dynamicBlockWrap = dynamicWrap.closest('.lpc-full-width');
						            let dynamicBlockIn = dynamicWrap.closest('.lpc-elements-dynamic-headline__wrap');				
						            let viewportWidth = window.innerWidth;
						            let dynamicWrapMargin = (viewportWidth - dynamicBlockWrap.offsetWidth) / 2;
						
						            $(dynamicBlockIn).css({
						                'margin-left': '-' + dynamicWrapMargin + 'px',
						                'margin-right': '-' + dynamicWrapMargin + 'px'
						            });
						        }
						
						        // --- Новый способ подбора font-size ---
						        let wrapWidth = dynamicWrap.offsetWidth;
						        let titleWidth = dynamicTitle.scrollWidth; // берём полную ширину текста
						
						        if (titleWidth > 0) {
						            // вычисляем нужный font-size (в vw) пропорционально
						            let scale = wrapWidth / titleWidth;
						            let currentFontSize = parseFloat(getComputedStyle(dynamicTitle).fontSize);
						            let newFontSizeVW = ((currentFontSize * scale) / window.innerWidth) * 100;
						
						            // ограничиваем
						            if (newFontSizeVW < dynamicTitleMinSize) newFontSizeVW = dynamicTitleMinSize;
						            if (newFontSizeVW > dynamicTitleMaxSize) newFontSizeVW = dynamicTitleMaxSize;
						
						            dynamicTitle.style.fontSize = newFontSizeVW + 'vw';
						        }
						
						        dynamicTitle.style.opacity = 1;
						    }
						} else{
							if(document.querySelector(parent) && document.querySelector(child)){
								
								let dynamicWrap = document.querySelector(parent);
								let dynamicTitle = dynamicWrap.querySelector(child);
								let dynamicTitleFontSize = parseFloat(getComputedStyle(dynamicTitle).fontSize);
								let dynamicTitleFontSizeVW = (dynamicTitleFontSize / window.innerWidth) * 100;
							
								let dynamicTitleMInSize = 3.2;
								let dynamicTitleMaxSize = 55;
								
								function isMobile() {
									return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent) || window.matchMedia("(max-width: 768px)").matches;
								}
								
								if (isMobile()) {
									dynamicTitleMInSize = 4.2;
								} else {
									
									if(dynamicWrap.classList.contains('lpc-full-width-init')){
										dynamicTitleMInSize = 3.2;
									} else {
										dynamicTitleMInSize = 2;
									}
								}
								
								
								if (dynamicWrap.classList.contains('lpc-full-width-init')) {
									let dynamicBlockWrap = dynamicWrap.closest('.lpc-full-width');
									let dynamicBlockIn = dynamicWrap.closest('.lpc-elements-dynamic-headline__wrap');				
									let viewportWidth = $(window).width();
									let dynamicWrapMargin = (viewportWidth - dynamicBlockWrap.offsetWidth) / 2;
		
									$(dynamicBlockIn).css({
										'margin-left': '-' + (dynamicWrapMargin) + 'px',
										'margin-right': '-' + (dynamicWrapMargin) + 'px'
									});
								}
								
								
								if(dynamicWrap.offsetWidth > dynamicTitle.offsetWidth){
									while (dynamicWrap.offsetWidth > dynamicTitle.offsetWidth) {
										dynamicTitleFontSizeVW = dynamicTitleFontSizeVW + 0.05;
										dynamicTitle.style.fontSize = dynamicTitleFontSizeVW + 'vw';
										if(dynamicTitleFontSizeVW >= dynamicTitleMaxSize){
											break;
										}
									}
									
									dynamicTitle.style.fontSize = (dynamicTitleFontSizeVW - 0.05) + 'vw';			
									dynamicTitle.style.opacity = 1;
									
									if(dynamicTitleFontSizeVW <= dynamicTitleMInSize){
										dynamicTitle.style.fontSize = dynamicTitleMInSize + 'vw';
									}
									
									return;
								}
								
								if(dynamicWrap.offsetWidth <= dynamicTitle.offsetWidth){
								
									while(dynamicWrap.offsetWidth <= dynamicTitle.offsetWidth) {
										dynamicTitleFontSizeVW = dynamicTitleFontSizeVW - 0.05;
										
										dynamicTitle.style.fontSize = dynamicTitleFontSizeVW + 'vw';
										
										
										if(dynamicTitleFontSizeVW <= dynamicTitleMInSize){
											break;
										}
									}
									dynamicTitle.style.opacity = 1;
									
									if(dynamicTitleFontSizeVW <= dynamicTitleMInSize){
										dynamicTitle.style.fontSize = dynamicTitleMInSize + 'vw';
									}
									
									return;
								}
								
								dynamicTitle.style.opacity = 1;
								
								return;
							}
						}
						
					}
	
	
	
	
					if (s3LP.is_cms) {
						if (document.querySelector(`${$titleInit} .lpc-elements-dynamic-headline__title`)) {
	
							document.addEventListener('lpcLoadingDone', function () {
								setTimeout(function () {
									dynamicTextWidth($titleInit, $title);
	
									if (document.querySelector($title) && document.querySelector($title).classList.contains('bg_clip')) {
										dynamicTextBg($titleInit, $title, $bgItem, $overlayItem);
									}
	
								}, 1000);
	
								function waitForStylesheet(callback, delay = 500) {
									const interval = setInterval(() => {
										if (document.getElementById('lpc-stylesheet')) {
											clearInterval(interval);
											setTimeout(callback, delay);
										}
									}, 250);
								}
	
								waitForStylesheet(() => {
									dynamicTextWidth($titleInit, $title);
								}, 500);
							});
	
							// Watch bg and overlay style changes
							if (document.querySelector($title) && document.querySelector($title).classList.contains('bg_clip')) {
								let elementBg = document.querySelector($bgItem);
								let elementOverlay = document.querySelector($overlayItem);
	
								let observerBg = new MutationObserver((mutationsList) => {
									mutationsList.forEach((mutation) => {
										if (mutation.type === "attributes" && mutation.attributeName === "style") {
											dynamicTextBg($titleInit, $title, $bgItem, $overlayItem);
										}
									});
								});
	
								let config = {
									attributes: true,
									attributeFilter: ["style"]
								};
	
								observerBg.observe(elementBg, config);
								observerBg.observe(elementOverlay, config);
							}
	
							// Watch text content changes
							let contentTitle = document.querySelector($title);
	
							let observerTitle = new MutationObserver((mutations) => {
								mutations.forEach((mutation) => {
									dynamicTextWidth($titleInit, $title);
								});
							});
	
							observerTitle.observe(contentTitle, {
								childList: true,
								subtree: true,
								characterData: true
							});
	
							// On style removed (eraser)
							function observeStyleChanges(targetSelector, dynamicFunction) {
								let targetTitle = document.querySelector(targetSelector);
	
								if (!targetTitle) return;
	
								const observerBlock = new MutationObserver((mutationsList) => {
									for (const mutation of mutationsList) {
										if (mutation.type === "attributes" && mutation.attributeName === "style") {
											if (!targetTitle.getAttribute("style")) {
												dynamicFunction();
											}
										}
									}
								});
	
								observerBlock.observe(targetTitle, {
									attributes: true,
									attributeFilter: ["style"]
								});
	
								dynamicFunction();
							}
	
							observeStyleChanges(
								$title,
								() => dynamicTextWidth($titleInit, $title)
							);
	
							// On publish
							const targetElement = document.querySelector($title);
	
							if (targetElement) {
								const observer = new MutationObserver((mutationsList) => {
									mutationsList.forEach((mutation) => {
										if (mutation.type === "attributes" && mutation.attributeName === "class") {
											if (!targetElement.classList.contains("modified")) {
												setTimeout(function () {
													dynamicTextWidth($titleInit, $title);
	
													if (document.querySelector($title) && document.querySelector($title).classList.contains('bg_clip')) {
														dynamicTextBg($titleInit, $title, $bgItem, $overlayItem);
													}
												}, 200);
											}
										}
									});
								});
								observer.observe(targetElement, { attributes: true });
							}
						}
	
					} else {
	
						function observeElementWithClass(targetClass) {
							let widthTitleObserver = new MutationObserver((mutationsList, observer) => {
								let targetElement = document.querySelector('.' + targetClass);
								if (targetElement) {
									if (document.querySelector(`${$titleInit} .lpc-elements-dynamic-headline__title`)) {
										setTimeout(function () {
											dynamicTextWidth($titleInit, $title);
										}, 500);
	
										let currentWidth = window.innerWidth;
	
										window.addEventListener('resize', function () {
											if (window.innerWidth !== currentWidth) {
												currentWidth = window.innerWidth;
	
												setTimeout(function () {
													dynamicTextWidth($titleInit, $title);
												}, 500);
											}
										}, true);
									}
	
									observer.disconnect();
								}
							});
	
							widthTitleObserver.observe(document.body, { childList: true, subtree: true });
						}
	
						observeElementWithClass('lpc-content-wrapper');
	
						document.addEventListener('DOMContentLoaded', function () {
							let dynamic = setInterval(function () {
								dynamicTextWidth($titleInit, $title);
								clearInterval(dynamic);
							}, 1000);
	
							if (document.querySelector($title) && document.querySelector($title).classList.contains('bg_clip')) {
								dynamicTextBg($titleInit, $title, $bgItem, $overlayItem);
							}
						});
					}			
				});
			}
		//}
	};*/
	
	
	lpc_template.queue.fullWidthS3 = function ($self) {

	    const fullWidth = function() {
	        const $blocks = $self.find('.lpc-full-width-init');
	        if (!$blocks.length) return;
	
	        $blocks.each(function() {
	            const $block = $(this);
	            const $wrap = $block.closest('.lpc-full-width');
	            if (!$wrap.length) return;
	           
	            const blockOffsetLeft = $wrap.offset().left;
	            const blockWidth = $wrap.outerWidth();
	            const windowWidth = $(window).width();
	
	            const marginL = Math.max(0, blockOffsetLeft);
	            const marginR = Math.max(0, windowWidth - (blockOffsetLeft + blockWidth));
	
	            $block.css({
	                marginLeft: -marginL + "px",
	                marginRight: -marginR + "px"
	            });
	            
	            $block.find('.lpc-full-width-content').css({
	                maxWidth: blockWidth + "px",
	                margin: "0 auto"
	            });
	            
	            $block.find('.lpc-full-width-splide-arrow').css({
	                maxWidth: blockWidth + "px",
	                margin: "0 auto"
	            });
	        });
	    };
	  
	    if (typeof s3LP !== "undefined" && s3LP.is_cms) {
	        setTimeout(fullWidth, 2000);
	    }
	};
	
	lpc_template.queue.spoilerText = function ($self) {
		if (typeof ReactLPConstructor !== 'undefined') {
			return;
		}
		let $block = $self.find('.lpc-spoiler-text-init');
	
		if ($block.length) {
			$block.each(function () {
				let $this = $(this);
				let $item = $this.find('.lpc-spoiler-text-item');
	
				if ($item.length != 0) {
					$item.each(function () {
						let $title = $(this).find('.lpc-spoiler-title-click');
						let $text = $(this).find('.lpc-spoiler-text-hide');
						let $button = $(this).find('.lpc-spoiler-more');
	
						let hideText = document.querySelector('html').getAttribute('lang') === 'ru' ? 'Свернуть' : 'Collapse';
						let currentText = document.querySelector('html').getAttribute('lang') === 'ru' ? 'Читать полностью' : 'Read completely';
	
						let originalText = $text.html().trim(); // Используем .html() вместо .text() чтобы сохранить HTML-структуру.
						let limit = parseInt($text.attr('data-limit'), 10);
	
						if (isNaN(limit)) {
							limit = 200;
						}
	
						function expandText() {
							$text.html(originalText);
							$button.text(hideText).show();
						}
	
						function collapseText() {
							let trimmedText = originalText.substr(0, limit);
							$text.html(trimmedText + '...');
							$button.text(currentText).hide();
							$block.addClass('is-active');
						}
	
						function toggleText() {
							if ($text.html() === originalText) {
								collapseText();
							} else {
								expandText();
							}
						}
	
						if (limit === 0) {
							expandText();
							$button.hide();
							$title.off('click').removeClass('lpc-spoiler-title-click');
						} else if (originalText.length > limit) {
							collapseText();
							$title.click(function () {
								expandText();
							});
						} else if (limit > originalText.length) {
							expandText();
							$button.hide();
							$title.off('click');
							$block.addClass('is-active');
						} else {
							$button.hide();
							$title.off('click');
						}
	
						$button.click(function () {
							collapseText();
						});
					});
				}
			});
		}
	};

	lpc_template.queue.aroundMagic = function ($self) {
		const $animation = $self.find('.lpc-recalculation');
		if (!$animation.length) return;
	
		const items = $animation.find('.lpc-features-1__item-title');
		if (!items.length) return;
	
		const observer = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				if (!entry.isIntersecting) return;
	
				const el = entry.target;
				const text = el.textContent.trim();
				
				const match = text.match(/\d[\d\s\u00A0]*/);
				if (!match) return;
	
				const rawNumber = match[0];
				
				const finalNumber = parseInt(rawNumber.replace(/[\s\u00A0]/g, ''), 10);
				if (isNaN(finalNumber)) return;
	
				if (el.dataset.animated) return;
				el.dataset.animated = "true";
	
				let current = 0;
				const duration = 1500;
				const fps = 60;
				const totalFrames = Math.round(duration / (1000 / fps));
				let frame = 0;
	
				const counter = setInterval(() => {
					frame++;
					current = Math.round((frame / totalFrames) * finalNumber);
				
					const formatted = current.toLocaleString('ru-RU');
					el.textContent = text.replace(rawNumber, formatted);
	
					if (frame >= totalFrames) {
						el.textContent = text.replace(
							rawNumber,
							finalNumber.toLocaleString('ru-RU')
						);
						clearInterval(counter);
					}
				}, 1000 / fps);
	
				observer.unobserve(el);
			});
		}, { threshold: 0.3 });
	
		items.each(function () {
			observer.observe(this);
		});
	};
	
	lpc_template.queue.accordeon = function ($self) {
	    var $block = $self.find('.lpc-accordion');
	
	    $block.each(function () {
	        let $this = $(this);
	        let $accordionItem = $this.find('.lpc-accordion-item');
	        let $accordionHeader = $this.find('.lpc-accordion-header');
	        let $accordionItemWrap = $this.find('.lpc-accordion-cards__item');
	        
	        $accordionItemWrap.click(function(event){
        		if (!$(this).hasClass("active") && !$(event.target).closest($accordionHeader).length){
        			console.log($(this).hasClass("active"));
        			console.log($(event.target).closest($accordionHeader).length);
        			$(this).find(".lpc-accordion-header").trigger("click");
        		}
	        });
	
	        function setCookie(name, value, days) {
	            let expires = "";
	            if (days) {
	                let date = new Date();
	                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
	                expires = "; expires=" + date.toUTCString();
	            }
	            document.cookie = name + "=" + value + expires + "; path=/";
	        }
	
	        function getCookie(name) {
	            let nameEQ = name + "=";
	            let ca = document.cookie.split(';');
	            for (let i = 0; i < ca.length; i++) {
	                let c = ca[i];
	                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
	                if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
	            }
	            return null;
	        }
	
	        // функция инициализации карты
	        function initMap($map) {
	            if ($map.length && !$map.hasClass('initialized')) {
	                $map.addClass('initialized'); // ставим сразу
	                setTimeout(function () {
	                    lpc_template.checkMapInitialization($map);
	                }, 400);
	            }
	        }
	
	        if (!s3LP.is_cms && $('.lpc-accordeon-manager').length) {
	            let activeTabs = getCookie("activeTabs");
	            if (activeTabs && activeTabs.length > 0) {
	                activeTabs = activeTabs.split(',').filter(index => !isNaN(index));
	                activeTabs.forEach(index => {
	                    let item = $accordionItem.eq(parseInt(index));
	                    if (item.length) {
	                        item.addClass('active');
	                        item.find('.lpc-accordion-content').show();
	                        initMap(item.find('.js-lpc-simple-map').first());
	                    }
	                });
	            } else {
	                $accordionItem.each(function () {
	                    if ($(this).data('accordeon-opened')) {
	                        $(this).addClass('active');
	                        $(this).find('.lpc-accordion-content').show();
	                        initMap($(this).find('.js-lpc-simple-map').first());
	                    }
	                });
	            }
	        } else {
	            $accordionItem.each(function () {
	                if ($(this).data('accordeon-opened')) {
	                    $(this).addClass('active');
	                    $(this).find('.lpc-accordion-content').show();
	                    initMap($(this).find('.js-lpc-simple-map').first());
	                }
	            });
	        }
	        
	        
	        $accordionHeader.click(function () {
	            let parent = $(this).closest('.lpc-accordion-item');
	            let $map = parent.find('.js-lpc-simple-map').first();
	
	            parent.toggleClass('active');
	            parent.find('.lpc-accordion-content').toggle();
	
	            initMap($map);
	
	            if (!s3LP.is_cms && $('.lpc-accordeon-manager').length) {
	                let activeItems = [];
	                $accordionItem.each(function (index) {
	                    if ($(this).hasClass('active')) {
	                        activeItems.push(index);
	                    }
	                });
	                setCookie("activeTabs", activeItems.join(','), 7);
	            }
	        });
	        
	        
	       /* if($this.find('.lpc-elements-list-3__item').length!=0) {
				$this.find('.lpc-elements-list-3__item').each(function(){
					let appendItem = $this.find('.lpc-elements-list-3__title');
					$this.find('.lpc-elements-list-3__icon').appendTo(appendItem);
				});
			}*/
	        
	        
	    });
	};

	
	
	lpc_template.queue.cmsFormGlobalStyles = function($self) {
		function observeIframe() {
			let iframe = document.querySelector('.lp-panel-iframe') || document.querySelector('._frame_4flwn_1');

			if (!iframe || !iframe.contentWindow || !iframe.contentDocument) {
				return;
			}
			
			let iframeDoc = iframe.contentDocument || iframe.contentWindow.document; // Доступ к контенту iframe
			
			$(iframeDoc).find('[data-element-alias=".lpc-block .lp-form-tpl__field-text"]').addClass('lp-form-tpl__field-text');
		}
		$('._live__settings-list li:first a').on('click', function() {
			setTimeout(function() {
				observeIframe();
			}, 3200);
		});
	};

	lpc_template.queue.lpcSimpleAccordeon = function ($self) {
		var $block = $self.find(".js_accordeon_title"),
			activeClass = "active";
	
		if ($block.length) {
			$block.on("click", function (e) {
				e.preventDefault();
	
				var $this = $(this),
					$ymap = $this
						.closest("[data-block-layout]")
						.find(".js-lpc-simple-map");
				($thisParent = $this.closest("._parent")),
					($thisBody = $thisParent.find("._content"));
	
				if ($thisParent.hasClass(activeClass)) {
					$thisBody.slideUp(400, function () {
						$thisParent.removeClass(activeClass);
						if ($ymap.length && $ymap.data("ymaps")) {
							$ymap.data("ymaps").container.fitToViewport();
						}
					});
				} else {
					$thisBody.slideDown(400, function () {
						$thisParent.addClass(activeClass);
						if ($ymap.length && $ymap.data("ymaps")) {
							$ymap.data("ymaps").container.fitToViewport();
						}
					});
				}
			});
		}
	};

	lpc_template.queue.lpcSimpleColumn = function ($self) {
		var $block = $self.find(".js-lpc-simple-colum");
	
		if ($block.length) {
			$block.each(function () {
				var $this = $(this),
					$items = $this.find("._parent");
				countArray = $this.data("column-count");
	
				$doc.on("checkDeviceType", function (e, param) {
					var thisCount =
						param === "mobile"
							? countArray[2]
							: param === "tablet"
								? countArray[1]
								: countArray[0];
	
					unwrap($items);
	
					if (thisCount == 1) {
						$items.wrap('<div class="_simple-col"></div>');
						return;
					}
	
					var itemsLengthInColumn = Math.round($items.length / thisCount);
	
					for (let i = 1; i < thisCount + 1; i += 1) {
						$items
							.filter(function (index) {
								return (
									index >= (i - 1) * itemsLengthInColumn &&
									index < i * itemsLengthInColumn
								);
							})
							.wrapAll('<div class="_simple-col"></div>');
					}
				});
			});
	
			function unwrap($list) {
				$list.each(function () {
					if (!this.parentNode.classList.contains("_simple-col")) return;
					$(this).unwrap();
				});
			}
		}
	};
	
	lpc_template.queue.blockAfterBefore = function ($self) {
		var $block = $self.find(".lpc-before-and-after-init");
	
		if ($block.length) {
			(() => {'use strict';
	
				class BeforeAfter {
					constructor(selector = '.before-after') {
						this.selector = selector;
						this.items = [];
					}
	
					init() {
						let wrappers = document.querySelectorAll(this.selector);
	
						for (let wrapper of wrappers) {
							if (wrapper.dataset.beforeAfterInitialized === 'true') {
								continue;
							}
							let item = new BeforeAfterItem(wrapper).init();
							this.items.push(item);
							
							wrapper.dataset.beforeAfterInitialized = 'true';
							
							let observer = new MutationObserver(function (mutations) {
								mutations.forEach(function (mutation) {
									if ($(mutation.target).hasClass('lp-selected-element')) {
										$(mutation.target).parent().addClass('active');
									} else {
										$(mutation.target).parent().removeClass('active');
									}
								});
							});
							let config = {
								attributes: true,
								attributeFilter: ['class']
							};
							
							observer.observe($(wrapper).find('.before-after__img-before')[0], config);
							observer.observe($(wrapper).find('.before-after__img-after')[0], config);
						}
					}
				}
	
				class BeforeAfterItem {
					constructor(el) {
						this.wrapper = el;
						this.dragElWrapper = null;
						this.viewport = null;
						this.before = null;
						this.after = null;
						this.offset = 0;
						this.pageXStart = 0;
						this.startOffset = 0;
						this.onPointerDown = this.onPointerDown.bind(this);
						this.onPointerMove = this.onPointerMove.bind(this);
						this.onPointerUp = this.onPointerUp.bind(this);
					}
					init() {
						let wrapper = this.wrapper;
	
						let dragElWrapper = this.dragElWrapper = document.createElement('div');
	
						dragElWrapper.classList.add('before-after__drag-wrapper');
						dragElWrapper.style.left = '50%';
	
						let dragEl = document.createElement('div');
	
						dragEl.classList.add('before-after__drag');
	
						dragElWrapper.append(dragEl);
	
						let viewport = this.viewport = wrapper.querySelector('.before-after__viewport');
	
						viewport.append(dragElWrapper);
						wrapper.classList.add('before-after--loaded');
	
						this.before = viewport.querySelector('.lpc-image-before');
						this.after = viewport.querySelector('.lpc-image-after');
	
						this.move(this.offset);
	
						dragElWrapper.addEventListener('mousedown', this.onPointerDown);
						dragElWrapper.addEventListener('touchstart', this.onPointerDown);
	
						dragElWrapper.addEventListener('dragstart', () => {
							return false;
						});
	
						return this;
					}
	
					onPointerDown(e) {
						e.stopPropagation();
	
						if (e.touches) {
							this.pageXStart = e.touches[0].pageX;
						} else {
							this.pageXStart = e.pageX;
						}
						this.startOffset = this.offset;
	
						document.addEventListener('mousemove', this.onPointerMove);
						document.addEventListener('touchmove', this.onPointerMove);
						document.addEventListener('mouseup', this.onPointerUp);
						document.addEventListener('touchend', this.onPointerUp);
					}
	
					onPointerMove(e) {
						let viewport = this.viewport,
							pxOffset = 0,
							percentOffset = 0;
	
						if (e.touches) {
							pxOffset = e.touches[0].pageX - this.pageXStart;
						} else {
							pxOffset = e.pageX - this.pageXStart;
						}
	
						percentOffset = parseFloat((pxOffset / viewport.clientWidth * 100).toFixed(6));
	
						this.offset = this.startOffset + percentOffset;
	
						if (this.offset >= 50) {
							this.offset = 50;
						} else if (this.offset <= -50) {
							this.offset = -50;
						}
	
						this.move(this.offset);
					}
	
					onPointerUp() {
						document.removeEventListener('mousemove', this.onPointerMove);
						document.removeEventListener('touchmove', this.onPointerMove);
						document.removeEventListener('mouseup', this.onPointerUp);
						document.removeEventListener('touchend', this.onPointerUp);
					}
	
					move(offset) {
						this.dragElWrapper.style.left = 'calc(50% + ' + offset + '%)';
						this.before.style.clipPath = 'inset(0 calc(50% - ' + offset + '%) 0 0)';
						this.after.style.clipPath = 'inset(0 0 0 calc(50% + ' + offset + '%))';
					}
	
				}
				window.BeforeAfter = BeforeAfter;
			})();
	
			new BeforeAfter().init();
		}
	};
	
	lpc_template.queue.spoilerBlock = function ($self) {
	    let $block = $self.hasClass('spoiler-init') ? $self : $self.find('.spoiler-init');

		$block.each(function(){
			let $this = $(this);

			initSpoiler();
			document.addEventListener('dataMediaSourceChange', initSpoiler);
			
			function initSpoiler() {
				let $hidden = $this.find('.spoiler-item:hidden');
				let $firstNotHidden = $this.find('.spoiler-item').first();
				let $btn = $this.find('.spoiler-btn');
				let $btnWrap = $this.find('.spoiler-btn-wrap');


				if ($hidden.length) {
					$btnWrap.addClass('show_spoiler');
					
					$btn.on('click', function(){
						$hidden.slideDown('150', function(){
							if ($firstNotHidden.css('display') == 'flex') {
								$hidden.css('display', 'flex');
							}
						});
						$(this).hide();
					});
				} else  {
					$btnWrap.removeClass('show_spoiler');
				}
			}
		});
	};
	
	lpc_template.queue.iframeLazyLoading = function($self) {
		var $block = $self.find('.lpc-lazy-iframe-js');
		var iframes = $block.find($('iframe'));
		
		if($block.length && iframes.length) {
		  iframes.each(function() {
		      var iframe = $(this);
			  /*var src = iframe.attr('src');
			  iframe.removeAttr('src');
			  iframe.attr('loading', 'lazy');
			  iframe.attr('data-src', src);*/
		      iframe.addClass('lazy lazyload');
		  });
		}
	};
	
	lpc_template.queue.lazyLoading = function($self) {
		var $block = $self.find('.lpc-lazy-loading-init');
	
		if ($block.length) {
			$block.each(function () {
				const $this = $(this);
				const blocks = $this.find('.lpc-lazy-loading-item');
				const blocksScrollShow = 1;
				let visibleBlockCount = blocksScrollShow;
	
				function showBlocks(startIndex, endIndex) {
					for (let i = startIndex; i < endIndex; i++) {
						blocks.eq(i).removeClass('hidden');
					}
				}
	
				function hideAllBlocks() {
					blocks.addClass('hidden');
				}
	
				hideAllBlocks();
				showBlocks(0, 3);
	
				function handleScroll() {
					const scrollTop = $(window).scrollTop();
					const windowHeight = $(window).height();
					const totalBlockCount = blocks.length;
					const totalVisibleBlocks = Math.min(visibleBlockCount, totalBlockCount);
					const lazyLoadingListBottom = $this.find('.lpc-lazy-loading-list').offset().top + $this.find('.lpc-lazy-loading-list').outerHeight() + 100;
	
					if (scrollTop + windowHeight >= lazyLoadingListBottom) {
						if (visibleBlockCount < totalBlockCount) {
							const newVisibleCount = Math.min(visibleBlockCount + blocksScrollShow, totalBlockCount);
							showBlocks(visibleBlockCount, newVisibleCount);
							visibleBlockCount = newVisibleCount;
						}
					}
				}
	
				$(window).on('scroll', handleScroll);
			});
		}
	};
	
	lpc_template.queue.typeWriter = function ($self) {
		let $block = $self.find('.lpc-typewriter-init');
	
		if ($block.length) {
			$block.each(function () {
				const $this = $(this);
				const stringElements = $this.find(".lpc-typewriter-string");
				const delay = $this.attr("data-delay");
				const delayDeletion = $this.attr("data-delay-deletion");
				const stopDialing = $this.attr("data-stop-dialing");
	
				function typeText(element, text, delay, callback) {
					let index = 0;
					const textLength = text.length;
	
					function addCharacter() {
						if (index < textLength) {
							element.textContent += text.charAt(index);
							index++;
							setTimeout(addCharacter, delay);
						} else {
							setTimeout(callback, delayDeletion);
						}
					}
	
					addCharacter();
				}
	
				function eraseText(element, delay, callback) {
					const text = element.textContent;
					let index = text.length;
	
					function removeCharacter() {
						if (index > 0) {
							element.textContent = text.substring(0, index - 1);
							index--;
							setTimeout(removeCharacter, delay);
						} else {
							callback();
						}
					}
	
					removeCharacter();
				}
	
				function animateElements(index) {
					if (index < stringElements.length) {
						const element = stringElements[index];
						const text = element.getAttribute("data-text");
				
						typeText(element, text, delay, function () {
							if (index === stringElements.length - 1 && stopDialing === "1") {
								
								setTimeout(function () {
									element.style.display = "inline";
									animateElements(index + 1);
								}, 250);
								
							} else {
								
								eraseText(element, delay, function () {
									element.style.display = "none";
									setTimeout(function () {
										animateElements(index + 1);
									}, 250);
								});
							}
						});
					} else {
						if (stopDialing === "1") {
							const lastElement = stringElements[stringElements.length - 1];
							const lastText = lastElement.getAttribute("data-text");
							lastElement.textContent = lastText;
						} else {
							setTimeout(function () {
								$this.find(".lpc-typewriter-string").each(function () {
									$(this).text(""); 
									$(this).css("display", "inline");
								});
								animateElements(0);
							}, delay);
						}
					}
				}
	
				animateElements(0);
			});
		}
	};
	
	lpc_template.queue.variableSlider = function ($self) {

		const $block = $self.attr('data-variable-slider-init') ? $self : $self.find('[data-variable-slider-init]');
		if (!$block.length) return;
	
		$block.each(function () {
			const $this = $(this);
			const mediaGap = $this.data('margin');
			const $splideEl = $this.find('.splide').not('.is-active')[0];
			
			if (!$splideEl) return;
			
			const initSlider = function () {
				
				const slider = new Splide($splideEl, {
					focus: $this.data('focus'),
					autoWidth: true,
					height: 'auto',
					autoplay: $this.data('autoplay'),
					speed: $this.data('speed'),
					interval: $this.data('pause'),
					lazyLoad: $this.data('lazy-load'),
					perMove: 1,
				}).mount();
	
				updateSlider();
				document.addEventListener('dataMediaSourceChange', updateSlider);
	
				function updateSlider() {
					const media = document.querySelector('.decor-wrap')?.dataset.mediaSource;
					if (!media) return;
	
					const config = {
						'media-xl': { arrows: true, gap: mediaGap[0] },
						'media-lg': { arrows: true, gap: mediaGap[1] },
						'media-md': { arrows: false, gap: mediaGap[2] },
						'media-sm': { arrows: false, gap: mediaGap[3] },
						'media-xs': { arrows: false, gap: mediaGap[4] },
					};
	
					slider.options = {
						...slider.options,
						pagination: true,
						...config[media],
					};
	
					slider.refresh();
				}
			};
			
			if (typeof s3LP !== 'undefined' && s3LP.is_cms) {
				setTimeout(initSlider, 1000);
			} else {
				initSlider();
			}
		});
	};
	
	lpc_template.queue.albumGallery = function ($self) {
	    let $block = $self.find('.lpc-album-gallery-init');
	
	    if ($block.length) {
	        $block.each(function () {
	            let $this = $(this);
	            let item = $this.find('.lpc-gallery-click');
	            let popup = $this.find('.lpc-album-gallery-popup');
	            let popupItems = $this.find('.lpc-album-gallery-popup__item');
	            let buttonBack = $this.find('.lpc-album-gallery-popup__back');
	            let buttonClose = $this.find('.lpc-album-gallery-popup__close');
	
	            let body = $('body');
	            let popupImageBox = popup.find('.lpc-album-gallery-popup__image-box');
				let mosaicWrap = $(document).find('.mosaic-wrap');
				
				setTimeout(function(){
					if (mosaicWrap.length && !$block.hasClass('lpc_constructor')) {
					    mosaicWrap.prepend(popup);
					    popup.addClass('lpc-block');
					}
				}, 300);
	            
	            if (popup.find('.js-new-lg-init').length) {
	            	
	            	popupImageBox.click(function () {
		                popup.addClass('is-hidden'); 
		            });
		
		            body.on('click', function (event) {
		                if (!$(event.target).closest('.lg-prev, .lg-next, .lg-toolbar, .lg-image, .lpc-album-gallery-popup, .lpc-album-gallery-popup__image-box').length) {
		                    popup.removeClass('is-hidden');
		                }
		                
		                if ($(event.target).closest('.lg-close').length) {
		                	popup.removeClass('is-hidden');
		                } 
		            });
	            }
	
	            item.click(function () {
	                let dataIndex = $(this).data("index");
	
	                popup.fadeIn().addClass("active");
	
	                if (!isMobile) {
	                    $("body").css({ 'padding-right': '17px' });
	                }
	
	                $("html").addClass("lpc-no-scroll");
	                popupItems.removeClass("active");
	                popupItems.filter("[data-index='" + dataIndex + "']").addClass("active");
	            });
	
	            buttonBack.click(function () {
	                popup.fadeOut().removeClass("active");
	                $("body").css({ 'padding-right': '' });
	                $("html").removeClass("lpc-no-scroll"); 
	                popupItems.removeClass("active");
	            });
	
	            buttonClose.click(function () {
	                popup.fadeOut().removeClass("active");
	                $("body").css({ 'padding-right': '' });
	                $("html").removeClass("lpc-no-scroll"); 
	                popupItems.removeClass("active");
	            });
	
				$(document).keydown(function (e) {
					if (e.keyCode === 27 && !$('.lg-outer').length) { 
						popup.fadeOut().removeClass("active");
						$("body").css({ 'padding-right': '' });
						$("html").removeClass("lpc-no-scroll"); 
						popupItems.removeClass("active");
					}
					
					popup.removeClass('is-hidden');
				});
	        });
	    }
	};
	
	lpc_template.queue.splideMarquee = function ($self) {
		let $block = $self.attr('data-marquee-init') ? $self : $self.find('[data-marquee-init]');
	
		setTimeout(function(){
		
			if ($block.length) {
				$block.each(function () {
					let $this = $(this);
					let mediaGap = $this.data('marquee-margin');
					let mediaPerPage = $this.data('marquee-count');
					let margueeDrag = $this.data('marquee-drag');
					let margueePause = $this.data('marquee-pause');
					let margueeSpeed = $this.data('marquee-speed');
					let margueeReverse = $this.data('marquee-revese');
	
					let autoScrollSpeed = (margueeReverse === true || margueeReverse === 'true') ? -margueeSpeed : margueeSpeed;
		
					if ($(this).data('move')) {
						var $mediaMove = $(this).data('move');
					} else {
						var $mediaMove = 1;
					}
		
					if ($this.find('.splide').not('.is-active').length != 0) {
		
						$this.find('.splide').not('.is-active').each(function () {
						
							let splide = new Splide($(this)[0], {
								type: 'loop',
								drag: margueeDrag,
								focus: 'center',
								arrows: false,
								pagination: false,
								perMove: $mediaMove,
								perPage: checkInitPerPage(),
								lazyLoad: 'nearby',
								autoScroll: {
									speed: autoScrollSpeed,
									pauseOnHover: margueePause,
									pauseOnFocus: margueePause,
								}
							});
							
							splide.mount(window.splide.Extensions);
		
							sliderBreakPoints();
		
							document.addEventListener('dataMediaSourceChange', sliderBreakPoints);
		
							function sliderBreakPoints() {
								let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
		
								switch (dataMediaSource) {
									case 'media-xl':
										splide.options = {
											gap: mediaGap[0],
											perPage: mediaPerPage[0],
										};
										break;
									case 'media-lg':
										splide.options = {
											gap: mediaGap[1],
											perPage: mediaPerPage[1],
										};
										break;
									case 'media-md':
										splide.options = {
											gap: mediaGap[2],
											perPage: mediaPerPage[2],
										};
										break;
									case 'media-sm':
										splide.options = {
											gap: mediaGap[3],
											perPage: mediaPerPage[3],
										};
										break;
									case 'media-xs':
										splide.options = {
											gap: mediaGap[4],
											perPage: mediaPerPage[4],
										};
										break;
								}
							};
		
							function checkInitPerPage() {
								let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
		
								switch (dataMediaSource) {
									case 'media-xl':
										return mediaPerPage[0]
										break;
									case 'media-lg':
										return mediaPerPage[1]
										break;
									case 'media-md':
										return mediaPerPage[2]
										break;
									case 'media-sm':
										return mediaPerPage[3]
										break;
									case 'media-xs':
										return mediaPerPage[4]
										break;
								};
							};
						});
					}
				});
			}
		
		}, 1000);
	};
	
	
	lpc_template.queue.wizardStepForm = function ($self) {
		
	    let $block = $self.find('.wizard-step-init');
	
	    if ($block.length) {
	        $block.each(function () {
	            const wrap = this;
	            const stepsWrap = wrap.querySelector(".lpc-wizard-step__steps");
	            const coverWrap = wrap.querySelector(".lpc-wizard-cover");
	            const coverBtn = wrap.querySelector(".lpc-wizard-cover__btn");
	
	            const steps = wrap.querySelectorAll(".lpc-wizard-step__options");
	            const nextBtn = wrap.querySelector(".lpc-wizard-step__next");
	            const prevBtn = wrap.querySelector(".lpc-wizard-step__prev");
	            const buttonsWrap = wrap.querySelector(".lpc-wizard-step__button");
	            const finalForm = wrap.querySelector(".lpc-wizard-step__standalone-form");
	            
	            const progressBar = wrap.querySelector(".lpc-wizard-progress__bar");
	            const progressCounter = wrap.querySelector(".lpc-wizard-progress__counter");
	
	            let currentStep = 0;
	
	            finalForm.style.display = "none";
	            nextBtn.disabled = true;
	            nextBtn.classList.add("disabled");
	            
	            let allowAutoStep = true;
	            steps.forEach(step => {
	                if (step.querySelectorAll("input[type='checkbox']").length > 0) {
	                    allowAutoStep = false;
	                }
	            });
	
	            if (stepsWrap && stepsWrap.classList.contains("_hidden_steps_form")) {
	                if (coverWrap) coverWrap.style.display = "block";
	            }
	
	            if (coverBtn) {
	                coverBtn.addEventListener("click", function () {
	                    stepsWrap.style.display = "block";
	                    stepsWrap.classList.remove("_hidden_steps_form");
	                    if (coverWrap) coverWrap.style.display = "none";
	                    updateSteps();
	                });
	            }
	           
	            function getCompletedStepsCount() {
	                let completed = 0;
	            
	                steps.forEach(step => {
	                    const inputs = step.querySelectorAll("input[type='radio'], input[type='checkbox'], select");
	            
	                    const isDone = Array.from(inputs).some(el => {
	                        if (el.type === "checkbox") return el.checked;
	                        if (el.type === "radio") return el.checked;
	                        if (el.tagName === "SELECT") return el.value.trim() !== "";
	                    });
	            
	                    if (isDone) completed++;
	                });
	            
	                return completed;
	            }
	           
	            function updateProgress() {
	                const completed = getCompletedStepsCount();
	                const percent = (completed / steps.length) * 100;
	            
	                if (progressBar) {
	                    progressBar.style.width = percent + "%";
	                }
	            
	                if (progressCounter) {
	                    progressCounter.textContent = `${completed} / ${steps.length}`;
	                }
	            }
	           
	            function updateSteps() {
	                steps.forEach((step, i) => {
	                    step.style.display = i === currentStep ? "flex" : "none";
	                });
	            
	                prevBtn.style.display = currentStep === 0 ? "none" : "inline-block";
	                nextBtn.textContent = currentStep === steps.length - 1 ? "Завершить" : "Далее";
	            
	                updateProgress();
	                validateStep();
	            }
	            
	            steps.forEach(step => {
	                step.addEventListener("change", () => {
	                    updateProgress();
	                });
	            });
	            
	            function validateStep() {
				    const stepEl = steps[currentStep];
				    const isMandatory = stepEl.getAttribute("data-mandatory") === "true";
				    
				    if (!isMandatory) {
				        nextBtn.disabled = false;
				        nextBtn.classList.remove("disabled");
				        return true;
				    }
				    
				    const currentInputs = stepEl.querySelectorAll("input[type='radio'], input[type='checkbox']");
				    const hasChecked = Array.from(currentInputs).some(i => i.checked);
				
				    nextBtn.disabled = !hasChecked;
				    nextBtn.classList.toggle("disabled", !hasChecked);
				
				    return hasChecked;
				}
	           
	            function getCleanLabelText(input) {
	                const label = input.closest("label");
	                return label ? label.innerText.trim() : input.value.trim();
	            }
	           
	            function collectWizardDataReadable() {
	                let result = [];
	
	                steps.forEach((step, index) => {
	                    const checked = step.querySelectorAll("input:checked");
	                    const title = step.querySelector(".lpc-wizard-step__title")?.innerText.trim() || `Шаг-${index + 1}`;
	
	                    let text = checked.length
	                        ? Array.from(checked).map(i => getCleanLabelText(i)).join(", ")
	                        : "(не выбран)";
	
	                    result.push(`${title}: ${text}`);
	                });
	
	                return result.join("; ");
	            }
	            
	            function putDataIntoHiddenField(dataStr) {
	                const hiddenInput = finalForm.querySelector('input[data-alias="wizard_data"]');
	                if (hiddenInput) hiddenInput.value = dataStr;
	            }
	           
	            steps.forEach(step => step.addEventListener("change", validateStep));
	            
	            if (allowAutoStep) {
				    steps.forEach((step, index) => {
				        const radios = step.querySelectorAll("input[type='radio']");
				
				        if (radios.length) {
				            radios.forEach(radio => {
				                radio.addEventListener("change", () => {
				
				                    updateProgress();
				
				                    if (step.classList.contains("_automatic_step") && currentStep === index) {
				
				                        if (!validateStep()) return;
				                        
				                        if (currentStep < steps.length - 1) {
				                            currentStep++;
				                            updateSteps();
				                            updateProgress();
				                        } else {
				                            if (allowAutoStep) {
				                                const dataStr = collectWizardDataReadable();
				                                putDataIntoHiddenField(dataStr);
				
				                                finalForm.style.display = "flex";
				                                stepsWrap.style.display = "none";
				                                buttonsWrap.style.display = "none";
				                            }
				                        }
				                    }
				                });
				            });
				        }
				    });
				}
	
	            nextBtn.addEventListener("click", function () {
	                if (!validateStep()) return;
	
	                if (currentStep < steps.length - 1) {
	                    currentStep++;
	                    updateSteps();
	                    updateProgress();
	                } else {
	                    const dataStr = collectWizardDataReadable();
	                    putDataIntoHiddenField(dataStr);
	
	                    finalForm.style.display = "flex";
	                    stepsWrap.style.display = "none";
	                    buttonsWrap.style.display = "none";
	                }
	            });
	
	            prevBtn.addEventListener("click", function () {
	                if (currentStep > 0) {
	                    currentStep--;
	                    updateSteps();
	                    updateProgress();
	                }
	            });
	
	            if (!stepsWrap.classList.contains("_hidden_steps_form")) {
	                updateSteps();
	            }
	
	        });
	    }
	};
	
	
	lpc_template.queue.wizardStepFormPopup = function ($self) {

	    let $block = $self.find('.popup-wizard-step-init');
	
	    if (!$block.length) return;
	
	    $block.each(function () {
	
	        const wrap = this;
	
	        const stepsWrap = wrap.querySelector(".lpc-popup-wizard-step__steps");
	        const steps = wrap.querySelectorAll(".lpc-popup-wizard-step__options");
	
	        const nextBtn = wrap.querySelector(".lpc-popup-wizard-step__next");
	        const prevBtn = wrap.querySelector(".lpc-popup-wizard-step__prev");
	        const buttonsWrap = wrap.querySelector(".lpc-popup-wizard-step__button");
	        const finalForm = wrap.querySelector(".lpc-popup-wizard-step__standalone-form");
	
	        const progressBar = wrap.querySelector(".lpc-popup-wizard-progress__bar");
	        const progressCounter = wrap.querySelector(".lpc-popup-wizard-progress__counter");
	
	        let currentStep = 0;
	
	        finalForm.style.display = "none";
	        nextBtn.disabled = true;
	        nextBtn.classList.add("disabled");
	
	        let allowAutoStep = true;
	        steps.forEach(step => {
	            if (step.querySelectorAll("input[type='checkbox']").length > 0) {
	                allowAutoStep = false;
	            }
	        });
	
	        function getCompletedStepsCount() {
	            let completed = 0;
	
	            steps.forEach(step => {
	                const inputs = step.querySelectorAll(
	                    "input[type='radio'], input[type='checkbox'], select"
	                );
	
	                const isDone = Array.from(inputs).some(el => {
	                    if (el.type === "checkbox") return el.checked;
	                    if (el.type === "radio") return el.checked;
	                    if (el.tagName === "SELECT") return el.value.trim() !== "";
	                });
	
	                if (isDone) completed++;
	            });
	
	            return completed;
	        }
	
	        function updateProgress() {
	            const completed = getCompletedStepsCount();
	            const percent = (completed / steps.length) * 100;
	
	            if (progressBar) {
	                progressBar.style.width = percent + "%";
	            }
	
	            if (progressCounter) {
	                progressCounter.textContent = `${completed} / ${steps.length}`;
	            }
	        }
	
	        function validateStep() {
	            const stepEl = steps[currentStep];
	            const isMandatory = stepEl.getAttribute("data-mandatory") === "true";
	
	            if (!isMandatory) {
	                nextBtn.disabled = false;
	                nextBtn.classList.remove("disabled");
	                return true;
	            }
	
	            const inputs = stepEl.querySelectorAll(
	                "input[type='radio'], input[type='checkbox']"
	            );
	
	            const hasChecked = Array.from(inputs).some(i => i.checked);
	
	            nextBtn.disabled = !hasChecked;
	            nextBtn.classList.toggle("disabled", !hasChecked);
	
	            return hasChecked;
	        }
	
	        function updateSteps() {
	            steps.forEach((step, i) => {
	                step.style.display = i === currentStep ? "flex" : "none";
	            });
	
	            prevBtn.style.display = currentStep === 0 ? "none" : "inline-block";
	            nextBtn.textContent =
	                currentStep === steps.length - 1 ? "Завершить" : "Далее";
	
	            updateProgress();
	            validateStep();
	        }
	
	        function getCleanLabelText(input) {
	            const label = input.closest("label");
	            return label ? label.innerText.trim() : input.value.trim();
	        }
	
	        function collectWizardDataReadable() {
	            let result = [];
	
	            steps.forEach((step, index) => {
	                const checked = step.querySelectorAll("input:checked");
	                const title =
	                    step.querySelector(".lpc-popup-wizard-step__options-title")?.innerText.trim() ||
	                    `Шаг-${index + 1}`;
	
	                const text = checked.length
	                    ? Array.from(checked)
	                        .map(i => getCleanLabelText(i))
	                        .join(", ")
	                    : "(не выбран)";
	
	                result.push(`${title}: ${text}`);
	            });
	
	            return result.join("; ");
	        }
	
	        function putDataIntoHiddenField(dataStr) {
	            const hiddenInput = finalForm.querySelector(
	                'input[data-alias="wizard_data"]'
	            );
	            if (hiddenInput) hiddenInput.value = dataStr;
	        }
	
	        steps.forEach(step => {
	            step.addEventListener("change", () => {
	                updateProgress();
	                validateStep();
	            });
	        });
	
	        if (allowAutoStep) {
	            steps.forEach((step, index) => {
	                const radios = step.querySelectorAll("input[type='radio']");
	
	                radios.forEach(radio => {
	                    radio.addEventListener("change", () => {
	
	                        if (!step.classList.contains("_automatic_step")) return;
	                        if (currentStep !== index) return;
	                        if (!validateStep()) return;
	
	                        if (currentStep < steps.length - 1) {
	                            currentStep++;
	                            updateSteps();
	                        } else {
	                            const dataStr = collectWizardDataReadable();
	                            putDataIntoHiddenField(dataStr);
	
	                            finalForm.style.display = "flex";
	                            stepsWrap.style.display = "none";
	                            buttonsWrap.style.display = "none";
	                        }
	                    });
	                });
	            });
	        }
	
	        nextBtn.addEventListener("click", () => {
	            if (!validateStep()) return;
	
	            if (currentStep < steps.length - 1) {
	                currentStep++;
	                updateSteps();
	            } else {
	                const dataStr = collectWizardDataReadable();
	                putDataIntoHiddenField(dataStr);
	
	                finalForm.style.display = "flex";
	                stepsWrap.style.display = "none";
	                buttonsWrap.style.display = "none";
	            }
	        });
	
	        prevBtn.addEventListener("click", () => {
	            if (currentStep > 0) {
	                currentStep--;
	                updateSteps();
	            }
	        });
	
	        updateSteps();
	
	    });
	};
	
	
	lpc_template.queue.masonGallery = function ($self) {
	    let $block = $self.find('.lpc-masonry-init');
	
	    if ($block.length) {
	        $block.each(function () {
	            let $this = $(this);
	            let listbox = $this.find(".lpc-image-mason__list");
	            let lazyItems = $this.find(".lpc-image-mason__item img[data-src]");
	            let windowHeight = $(window).height();
	
	            function loadVisibleItems() {
	                lazyItems.each(function (index, item) {
	                    const rect = item.getBoundingClientRect();
	
	                    if (rect.top < windowHeight) {
	                        const img = $(item);
	
	                        if (!img.hasClass('is-loaded')) {
	                            img.on('load', function () {
	                                img.closest('.lpc-image-mason__item').addClass('is-show');
	                                resizeGridItem(img.closest('.lpc-image-mason__item'));
	                            });
	
	                            img.attr('src', img.data('src'));
	                            img.addClass('is-loaded');
	                        }
	                    }
	                });
	
	                lazyItems = $this.find(".lpc-image-mason__item img[data-src]");
	            }
	
	            function resizeGridItem(item) {
	                let grid = $this.find('.lpc-image-mason__list');
	                let rowHeight = parseInt(grid.css("grid-auto-rows"));
	                let rowGap = parseInt(grid.css("grid-row-gap"));
	
	                let rowSpan = Math.ceil(
	                    (item.find('.lpc-image-mason__image').outerHeight() + rowGap) / (rowHeight + rowGap)
	                );
	                item.css("grid-row-end", "span " + rowSpan);
	
	                let image = item.find('.lpc-image-mason__image');
	                image.css("height", "100%");
	            }
	
	            $(window).on('scroll', function () {
	                loadVisibleItems();
	            });
	
	            loadVisibleItems();
	        });
	    }
	};
	
	lpc_template.queue.dinamicPadding = function ($self) {
	    let $block = $self.find('.lpc-vertical-wrap');
	
	    if ($block.length) {
	        let item = $block.find('.lpc-timeline-vertical__item');
	
	        function updatePadding() {
	            item.each(function() {
	                let $this = $(this);
	                let numBlock = $this.find('#numBlock');
	                let bodyBlock = $this.find('#bodyBlock');
	                let stringBlock = $this.find('#stringBlock');

					if (stringBlock.length) {
						let numBlockHeight = numBlock.outerHeight() / 2 - stringBlock.outerHeight() / 2;
		                bodyBlock.css('padding-top', `${numBlockHeight}px`);
					}
	            });
	        }
	
	        updatePadding();
			
			if (!s3LP.is_cms) {
				let resizeTimeout;

				$(window).on('resize', function () {
					if (resizeTimeout) {
						clearTimeout(resizeTimeout);
					}

					resizeTimeout = setTimeout(function () {
						updatePadding();
					}, 50);
				});
			};
	    }
	};
	
	lpc_template.queue.visibleBlock = function ($self) {
		var $block = $self.find('.lpc-opacity-block');
	
		if (!s3LP.is_cms) {
			
			var $images = $self.find('lpc-promotion-slider__image img, .lpc-form-substrate__background img');
		
			function removeOpacityClass() {
				$block.removeClass('lpc-opacity-block');
			}
			
			var imageCount = $images.length;
			
			if (imageCount === 0) {
				removeOpacityClass();
				
			} else {
				
				$images.each(function () {
	                if (this.complete) {
	                    imageCount--;
	                } else {
	                    $(this).on('load', function () {
	                        imageCount--;
	                        
	                        if (imageCount === 0) {
	                            removeOpacityClass();
	                        }
	                    });
	                }
	            });
	
				if (imageCount === 0) {
					removeOpacityClass();
				}
			}
		}
	};
	
	lpc_template.queue.constructorClick = function ($self) {
		let $block = $self.find('.lpc-constructor');
	
		if ($block.length) {
			$block.each(function () {
				let $this = $(this);
				let lpcClick = $this.find(".lpc-active-click");
				let item = $this.find(".lpc-constructor-click");
	
				if (s3LP.is_cms) {
					lpcClick.on('click', function () {
						item.toggleClass('lpc-image-show');
					});
				}
			});
		}
	};
	
	lpc_template.queue.tabsInit = function ($self) {
        let $block = $self.find('.lpc-tabs-init');
    
        if ($block.length) {
            $block.each(function () {
                let $this = $(this);
                let $tab = $this.find('.lpc-tabs-title');
                let $acc = $this.find('.lpc-accord-title');
                let $body = $this.find('.lpc-tabs-body');
                let blockId = $this.data('blockId');
                let isVertical = $this.hasClass('lpc-tabs-vertical');
                let hasTabManager = $this.hasClass('lpc-tab-manager');
    
                function accord() {
                    $tab.off('click.tabs');
                    $acc.off('click.accorDeon').on('click.accorDeon', function () {
                        let $currentAcc = $(this);
                        let $currentBody = $currentAcc.next('.lpc-tabs-body');
                        let isActive = $currentAcc.hasClass('active');
    
                        $acc.removeClass('active');
                        $body.slideUp(200).removeClass('active');
    
                        if (!isActive) {
                            $currentAcc.addClass('active');
                            $currentBody.slideDown(200).addClass('active');
                            
                            if (hasTabManager) {
	                            let index = $currentAcc.data('index');
	                            localStorage.setItem('activeTab_' + blockId, index);
                            }
                        }
    
                        if ($currentAcc.hasClass('active')) {
                            setTimeout(function(){
                                $('html, body').stop().animate({
                                    scrollTop: $currentAcc.offset().top - 50
                                }, 500);
                            }, 301);
                        }
                    });
                }
    
                function tabs() {
                    $acc.off('click.accorDeon');
                    $tab.off('click.tabs').on('click.tabs', function () {
                        let $currentTab = $(this);
                        let index = $currentTab.data('index');
                        let $currentBody = $this.find('.lpc-tabs-body[data-index="' + index + '"]');
    
                        if (!$currentTab.hasClass('active')) {
                            $tab.removeClass('active');
                            $body.removeClass('active');
                            $currentTab.addClass('active');
                            $currentBody.addClass('active');
    						
    						if (hasTabManager) {
                            	localStorage.setItem('activeTab_' + blockId, index);
    						}
                        }
                    });
                }
    
                function updateActiveTab() {
                    let dataMedia = document.querySelector('.decor-wrap').dataset.mediaSource;
    
                    if ((isVertical && (dataMedia === 'media-md' || dataMedia === 'media-sm' || dataMedia === 'media-xs')) || (!isVertical && dataMedia === 'media-xs')) {
                        accord();
                    } else {
                        tabs();
                    }                   
    
    				if (hasTabManager) {
	                    let activeBlockId = localStorage.getItem('activeTab_' + blockId);
	                    let index = parseInt(activeBlockId, 10) || 0;
	    
	                    if ((isVertical && (dataMedia === 'media-md' || dataMedia === 'media-sm' || dataMedia === 'media-xs')) || (!isVertical && dataMedia === 'media-xs')) {
	                        $acc.removeClass('active');
	                        $body.hide().removeClass('active');
	    
	                        $acc.eq(index).addClass('active');
	                        $body.eq(index).toggle().addClass('active');
	    
	                    } else {
	                        $tab.removeClass('active').removeAttr('style');
	                        $body.removeClass('active').removeAttr('style');
	    
	                        $tab.eq(index).addClass('active').removeAttr('style');
	                        $body.eq(index).addClass('active').removeAttr('style');
	                    }
    				}
                }
    
                updateActiveTab();
 
                window.addEventListener('orientationchange', function () {
                    setTimeout(function () {
                        updateActiveTab();
                    }, 300); 
                });
            });
        }
    };
    
    lpc_template.queue.sliderBlockTabs = function ($self) {
	    let $block = $self.attr('data-slider-tabs-init') ? $self : $self.find('[data-slider-tabs-init]');
	    
	    if ($block.length) {
	        if ($block.data('data-slider-tabs-init') != true) {
	
	            $block.each(function () {
	                let $this = $(this);
	                let $alignItem = $this.find($this.data('align-item'));
	
	                let $splideEl = $this.find('.splide:not(.is-active)').first();
	                if (!$splideEl.length) return;
	                
	                let splide = new Splide($splideEl[0], {
	                    autoplay: $this.data('autoplay'),
	                    speed: $this.data('speed'),
	                    interval: $this.data('pause'),
	                    rewind: true,
	                    lazyLoad: $this.data('lazy-load'),
	                    perPage: 1,
	                    perMove: 1,
	                    gap: 20,
	                    pagination: false
	                });
	               
	                let $customPagination = $this.find('.splide__custom__pagination');
	                let $customButtons = $customPagination.find('.splide__pagination__page');
	
	                $customButtons.each(function (index) {
	                    $(this).on('click', function () {
	                        splide.go(index);
	                    });
	                });
	
	                splide.on('move mounted', function () {
	                    let active = splide.index;
	                    $customButtons.removeClass('is-active');
	                    $customButtons.eq(active).addClass('is-active');
	                });
	
	                splide.mount();
	
	                sliderBreakPoints();
	                
	                document.addEventListener('lpcPopupOpened', function () {
	                    splide.refresh();
	                });
	
	                document.addEventListener('dataMediaSourceChange', sliderBreakPoints);
	
	                function sliderBreakPoints() {
	                    let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
	
	                    setTimeout(function () {
	                        if ($alignItem.length) {
	                            let itemHeight = $alignItem.outerHeight() / 2;
	                            let arrowsPosition = itemHeight + $alignItem.position().top;
	                            $this.find('.splide__arrow').css('top', arrowsPosition);
	                        }
	                    }, 100);
	                    
	                    switch (dataMediaSource) {
	                        case 'media-xl':
	                        case 'media-lg':
	                            splide.options = {
	                                arrows: true,
	                                perPage: 1,
	                                gap: 20,
	                            };
	                        break;
	
	                        case 'media-md':
	                            splide.options = {
	                                arrows: false,
	                                perPage: 1,
	                                gap: 20,
	                            };
	                        break;
	
	                        case 'media-sm':
	                        case 'media-xs':
	                            splide.options = {
	                                arrows: false,
	                                rewindByDrag: true,
	                                perPage: 1,
	                                gap: 16,
	                            };
	                        break;
	                    }
	                }
	            });
	        }
	    }
	};
	
	lpc_template.queue.initVideoBlocks = function () {
		/*const blocks = document.querySelectorAll(".lpc-block");
	
		blocks.forEach((block) => {
			const videoPosters = block.querySelectorAll(".lpc-video-poster");
			const videoContainers = block.querySelectorAll(".lpc-video-container");
	
			videoPosters.forEach((videoPoster, index) => {
				const iframe = videoContainers[index].querySelector("iframe");
	
				videoPoster.addEventListener("click", function () {
					const dataSrc = videoPoster.getAttribute("data-youtube-id");
	
					if (dataSrc) {
						iframe.setAttribute("src", "https://www.youtube.com/embed/" + dataSrc + "?autoplay=1&mute=0");
						videoPoster.removeAttribute("data-youtube-id");
						videoPoster.style.display = "none";
						videoContainers[index].style.display = "block";
					}
				});
			});
		});*/
		const blocks = document.querySelectorAll(".lpc-block");
		
	    blocks.forEach((block) => {
	        const videoPosters = block.querySelectorAll(".lpc-video-poster");
	        const videoContainers = block.querySelectorAll(".lpc-video-container");
	
	        videoPosters.forEach((videoPoster, index) => {
	            
	            videoPoster.addEventListener("click", function () {
	                let _this = this;
	                let parent = _this.closest('.lp-video-block-wrappper');
	                let container = parent.querySelector(".lpc-video-container");
	                let iframe = container.querySelector("iframe");
	                let src = iframe.getAttribute("data-src").replace('autoplay=0','autoplay=1');
	                
	                iframe.setAttribute("src", src);
	                videoPoster.style.display = "none";
	                container.style.display = "block";
	            });
	        });
	    });
	};
	
	document.addEventListener("lpc_init_after", function () { // вместо  DOMContentLoaded используем lpc_init_after чтобы работало в новом конструкторе, так как там нет события DOMContentLoaded
		lpc_template.queue.initVideoBlocks();
	});
	
	lpc_template.queue.sliderReviews = function ($self) {
		let $block = $self.attr('data-slider-reviews-init') ? $self : $self.find('[data-slider-reviews-init]');
	
		if ($block.length) {
			$block.each(function () {
				let $this = $(this);
				let $alignItem = $this.find($this.data('align-item'));
	
				if ($this.find('.splide').not('.is-active').length != 0) {
					$this.find('.splide').not('.is-active').each(function () {
						
						let splide = new Splide($(this)[0], {
							autoplay: $this.data('autoplay'),
							speed: $this.data('speed'),
							interval: $this.data('pause'),
							lazyLoad: $this.data('lazy-load'),
							rewind: true,
							arrows: true,
							pagination: true,
							gap: 0,
							perPage: 1
						});
						
						splide.mount();
						
						if ($(this).find('.lpc-reviews-4__item').length <= 1) {
							$(this).addClass('splide--pointer-events');
						}
					});
				}
			});
		}
	};
	
	lpc_template.queue.sliderBlockBanner = function ($self) {
	    let $block = $self.attr('data-slider-banner-init') ? $self : $self.find('[data-slider-banner-init]');
	    if ($block.length) {
		if ($block.data('slider-thumb-init') != true) {
	        $block.each(function(){
	            let $this = $(this);
				let $alignItem = $this.find($this.data('align-item'));
				let mediaGap = $this.data('margin');
				let mediaPerPage = $(this).data('count');
				if ($(this).data('move')) {
					var $mediaMove = $(this).data('move');
					
				} else {
					var $mediaMove = 1;
				}

	            if($this.find('.splide').not('.is-active').length != 0) {
	                let splide = new Splide( $this.find('.splide').not('.is-active')[0], {
						autoplay: $this.data('autoplay'),
						speed: $this.data('speed'),
						interval: $this.data('pause'),
	                    lazyLoad: $this.data('lazy-load'),
	                    rewind: true,
	                    perMove: $mediaMove,
						perPage: checkInitPerPage()
	                });
	                splide.mount();
	                
					sliderBreakPoints();
					
					document.addEventListener('lpcPopupOpened', function(){
						splide.refresh();
					});
					
					document.addEventListener('dataMediaSourceChange', sliderBreakPoints);
					
					function sliderBreakPoints() {
		                let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
		
						setTimeout(function(){
							if ($alignItem.length) {
								let itemHeight = $alignItem.outerHeight() / 2;
								let arrowsPosition = itemHeight + $alignItem.position().top;
	
								$this.find('.splide__arrow').css('top', arrowsPosition);
							}
						}, 100);
						
		                switch (dataMediaSource) {
		                    case 'media-xl':
		                        splide.options = {
									arrows: true,
									pagination: true,
		                            gap: mediaGap[0],
		                            perPage: mediaPerPage[0],
		                        };
		
		                        break;
		                    case 'media-lg':
		                        splide.options = {
									arrows: true,
									pagination: true,
		                            gap: mediaGap[1],
		                            perPage: mediaPerPage[1],
		                        };
		
		                        break;
		                    case 'media-md':
		                        splide.options = {
									arrows: true,
									pagination: true,
		                            gap: mediaGap[2],
		                            perPage: mediaPerPage[2],
		                        };
		
		                        break;
		                    case 'media-sm':
		                        splide.options = {
									arrows: true,
									pagination: true,
		                            gap: mediaGap[3],
		                            perPage: mediaPerPage[3],
		                        };
		
		                        break;
		                    case 'media-xs':
		                        splide.options = {
									arrows: true,
									pagination: true,
		                            gap: mediaGap[4],
		                            perPage: mediaPerPage[4],
		                        };
		                        
		                        break;
		                }
					};
					
					function checkInitPerPage() {
						let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
					
						switch (dataMediaSource) {
							case 'media-xl':
								return mediaPerPage[0]
								break;
							case 'media-lg':
								return mediaPerPage[1]
								break;
							case 'media-md':
								return mediaPerPage[2]
								break;
							case 'media-sm':
								return mediaPerPage[3]
								break;
							case 'media-xs':
								return mediaPerPage[4]
								break;
						};
					};
	            }
	        });
	    }
	    }
	};
	 	
	lpc_template.queue.sliderBlock = function ($self) {
		
	    let $block = $self.attr('data-slider-init') ? $self : $self.find('[data-slider-init]');
	    
	    if ($block.length) {
		if ($block.data('slider-thumb-init') != true) {
	        $block.each(function(){
	            let $this = $(this);
				let $alignItem = $this.find($this.data('align-item'));
				let mediaGap = $this.data('margin');
				let mediaPerPage = $(this).data('count');
				if ($(this).data('move')) {
					var $mediaMove = $(this).data('move');
					
				} else {
					var $mediaMove = 1;
				}

	            if($this.find('.splide').not('.is-active').length != 0) {
	                let splide = new Splide( $this.find('.splide').not('.is-active')[0], {
						autoplay: $this.data('autoplay'),
						speed: $this.data('speed'),
						interval: $this.data('pause'),
	                    rewind: $this.data('infinite'),
	                    lazyLoad: $this.data('lazy-load'),
	                    rewind: true,
	                    /*rewindByDrag: true,*/
	                    perMove: $mediaMove,
						perPage: checkInitPerPage()
	                });
	                splide.mount();
	                
					sliderBreakPoints();
					
					document.addEventListener('lpcPopupOpened', function(){
						splide.refresh();
					});
					
					document.addEventListener('dataMediaSourceChange', sliderBreakPoints);
					
					function sliderBreakPoints() {
		                let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
		
						setTimeout(function(){
							if ($alignItem.length) {
								let itemHeight = $alignItem.outerHeight() / 2;
								let arrowsPosition = itemHeight + $alignItem.position().top;
	
								$this.find('.splide__arrow').css('top', arrowsPosition);
							}
						}, 100);
						
		                switch (dataMediaSource) {
		                    case 'media-xl':
		                        splide.options = {
									arrows: true,
									pagination: true,
		                            gap: mediaGap[0],
		                            perPage: mediaPerPage[0],
		                        };
		
		                        break;
		                    case 'media-lg':
		                        splide.options = {
									arrows: true,
									pagination: true,
		                            gap: mediaGap[1],
		                            perPage: mediaPerPage[1],
		                        };
		
		                        break;
		                    case 'media-md':
		                        splide.options = {
									arrows: false,
									pagination: true,
		                            gap: mediaGap[2],
		                            perPage: mediaPerPage[2],
		                        };
		
		                        break;
		                    case 'media-sm':
		                        splide.options = {
									arrows: false,
									pagination: true,
									rewindByDrag: true,
		                            gap: mediaGap[3],
		                            perPage: mediaPerPage[3],
		                        };
		
		                        break;
		                    case 'media-xs':
		                        splide.options = {
									arrows: false,
									pagination: true,
									rewindByDrag: true,
		                            gap: mediaGap[4],
		                            perPage: mediaPerPage[4],
		                        };
		                        
		                        break;
		                }
					};
					
					function checkInitPerPage() {
						let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
					
						switch (dataMediaSource) {
							case 'media-xl':
								return mediaPerPage[0]
								break;
							case 'media-lg':
								return mediaPerPage[1]
								break;
							case 'media-md':
								return mediaPerPage[2]
								break;
							case 'media-sm':
								return mediaPerPage[3]
								break;
							case 'media-xs':
								return mediaPerPage[4]
								break;
						};
					};
	            }
	        });
	    }
	    }
	};
	
	lpc_template.queue.sliderTabBlock = function ($self) {
		
	    let $block = $self.attr('data-slider-tab-init') ? $self : $self.find('[data-slider-tab-init]');
	    
	    if ($block.length) {
		if ($block.data('slider-thumb-init') != true) {
	        $block.each(function(){
	            let $this = $(this);
				let $alignItem = $this.find($this.data('align-item'));
				let mediaGap = $this.data('margin');
				let mediaPerPage = $(this).data('count');
				if ($(this).data('move')) {
					var $mediaMove = $(this).data('move');
					
				} else {
					var $mediaMove = 1;
				}

	            if($this.find('.splide').not('.is-active').length != 0) {
	                let splide = new Splide( $this.find('.splide').not('.is-active')[0], {
						autoplay: $this.data('autoplay'),
						speed: $this.data('speed'),
						interval: $this.data('pause'),
	                    rewind: $this.data('infinite'),
	                    lazyLoad: $this.data('lazy-load'),
	                    rewind: true,
	                    rewindByDrag: true,
						autoWidth: true,
	                    perMove: $mediaMove,
						perPage: checkInitPerPage()
	                });
	                splide.mount();
	                
					sliderBreakPoints();
					
					document.addEventListener('lpcPopupOpened', function(){
						splide.refresh();
					});
					
					document.addEventListener('dataMediaSourceChange', sliderBreakPoints);
					
					function sliderBreakPoints() {
		                let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
		
						setTimeout(function(){
							if ($alignItem.length) {
								let itemHeight = $alignItem.outerHeight() / 2;
								let arrowsPosition = itemHeight + $alignItem.position().top;
	
								$this.find('.splide__arrow').css('top', arrowsPosition);
							}
						}, 100);
						
		                switch (dataMediaSource) {
		                    case 'media-xl':
		                        splide.options = {
									arrows: true,
									pagination: false,
		                            gap: mediaGap[0],
		                            perPage: mediaPerPage[0],
		                        };
		
		                        break;
		                    case 'media-lg':
		                        splide.options = {
									arrows: true,
									pagination: false,
		                            gap: mediaGap[1],
		                            perPage: mediaPerPage[1],
		                        };
		
		                        break;
		                    case 'media-md':
		                        splide.options = {
									arrows: true,
									pagination: false,
		                            gap: mediaGap[2],
		                            perPage: mediaPerPage[2],
		                        };
		
		                        break;
		                    case 'media-sm':
		                        splide.options = {
									arrows: false,
									pagination: false,
									rewindByDrag: true,
		                            gap: mediaGap[3],
		                            perPage: mediaPerPage[3],
		                        };
		
		                        break;
		                    case 'media-xs':
		                        splide.options = {
									arrows: false,
									pagination: false,
									rewindByDrag: true,
		                            gap: mediaGap[4],
		                            perPage: mediaPerPage[4],
		                        };
		                        
		                        break;
		                }
					};
					
					function checkInitPerPage() {
						let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
					
						switch (dataMediaSource) {
							case 'media-xl':
								return mediaPerPage[0]
								break;
							case 'media-lg':
								return mediaPerPage[1]
								break;
							case 'media-md':
								return mediaPerPage[2]
								break;
							case 'media-sm':
								return mediaPerPage[3]
								break;
							case 'media-xs':
								return mediaPerPage[4]
								break;
						};
					};
	            }
	        });
	    }
	    }
	};
	
	lpc_template.queue.sliderBlockThumb = function ($self) {
	    var $block = $self.attr('data-slider-thumb-init') ? $self : $self.find('[data-slider-thumb-init]');
	    if ($block.length) {
	        $block.each(function(){
	            let $this = $(this);
				let $alignItem = $this.find($this.data('align-item'));
				let mediaGap = $this.data('margin');
				let mediaPerPage = $(this).data('count');
				let mediaThumbGap = $this.data('thumb-margin');
				let mediaThumbFixedWidth = $this.data('thumb-width');
				let mediaThumbFixedHeight = $this.data('thumb-height');
	                
	            if($this.find('#main-slider').not('.is-active').length != 0 ) {
	                let splideThumb = new Splide( $this.find('.splide').not('.is-active')[0], {
						autoplay: $this.data('autoplay'),
						speed: $this.data('speed'),
						interval: $this.data('pause'),
	                    rewind: $this.data('infinite'),
	                    lazyLoad: $this.data('lazy-load'),
	                    rewind: true,
	                    perMove: 1,
						perPage: checkInitPerPage(),
						dragMinThreshold: {
						    mouse: 5,
						    touch: 10,
						}	
	                });
	                
	                let thumbnails = new Splide($this.find('.thumbnail-slider').not('.is-active')[0], {
					  rewind          : $this.data('rewind'),
					  fixedWidth      : checkInitThumbWidth(),
					  fixedHeight     : checkInitThumbHeight(),
					  isNavigation    : true,
					  focus           : $this.data('thumb-focus'),
					  pagination      : false,
					  cover           : false,
					  arrows     	  : $this.data('thumb-arrow'),
                	  drag            : false,
                	  padding         : 4,
					  gap             : checkInitThumbGap(),
					  dragMinThreshold: {
					    mouse: 5,
					    touch: 10,
					  }	,
					  classes 		  : {
					  	arrows: "splide__arrows splide__custom__arrows"
					  }
					});

	                splideThumb.sync( thumbnails );
	                
	                splideThumb.mount();
	                
            		thumbnails.mount();
                	
					sliderBreakPoints();
					
					sliderPaginationChecking();
					
					document.addEventListener('dataMediaSourceChange', sliderBreakPoints);
					
					
					
					function sliderBreakPoints() {
		                let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
		
						setTimeout(function(){
							if ($alignItem.length) {
								let itemHeight = $alignItem.outerHeight() / 2;
								let arrowsPosition = itemHeight + $alignItem.position().top;
	
								$this.find('.splide__arrow').css('top', arrowsPosition);
							}
						}, 100);
						
		                switch (dataMediaSource) {
		                    case 'media-xl':
		                        splideThumb.options = {
									arrows: true,
									pagination: true,
		                            gap: mediaGap[0],
		                            perPage: mediaPerPage[0],
		                        };

		                        break;
		                    case 'media-lg':
		                        splideThumb.options = {
									arrows: true,
									pagination: true,
		                            gap: mediaGap[1],
		                            perPage: mediaPerPage[1],
		                        };
		
		                        break;
		                    case 'media-md':
		                        splideThumb.options = {
									arrows: true,
									pagination: true,
		                            gap: mediaGap[2],
		                            perPage: mediaPerPage[2],
		                        };
		                        break;
		                    case 'media-sm':
		                        splideThumb.options = {
									arrows: false,
									pagination: true,
		                            gap: mediaGap[3],
		                            perPage: mediaPerPage[3],
		                        };
		
		                        break;
		                    case 'media-xs':
		                        splideThumb.options = {
									arrows: false,
									pagination: true,
		                            gap: mediaGap[4],
		                            perPage: mediaPerPage[4],
		                        };

		                        break;
		                }
		                if($block.data('slider-thumb-init') == true) {
							switch (dataMediaSource) {
			                    case 'media-xl':
			                        thumbnails.options = {
			                            gap: mediaThumbGap[0],
			                            fixedWidth: mediaThumbFixedWidth[0],
			                            fixedHeight: mediaThumbFixedHeight[0],
			                        };
			
			                        break;
			                    case 'media-lg':
			                        thumbnails.options = {
			                            gap: mediaThumbGap[1],
			                            fixedWidth: mediaThumbFixedWidth[1],
			                            fixedHeight: mediaThumbFixedHeight[1],
			                        };
			
			                        break;
			                    case 'media-md':
			                        thumbnails.options = {
			                            gap: mediaThumbGap[2],
			                            fixedWidth: mediaThumbFixedWidth[2],
			                            fixedHeight: mediaThumbFixedHeight[2],
			                        };
			
			                        break;
			                    case 'media-sm':
			                        thumbnails.options = {
			                            gap: mediaThumbGap[3],
			                            fixedWidth: mediaThumbFixedWidth[3],
			                            fixedHeight: mediaThumbFixedHeight[3],
			                        };
			
			                        break;
			                    case 'media-xs':
			                        thumbnails.options = {
			                            gap: mediaThumbGap[4],
			                            fixedWidth: mediaThumbFixedWidth[4],
			                            fixedHeight: mediaThumbFixedHeight[4],
			                        };
			                        
			                        break;
			                }
						}
					};
					
					function checkInitPerPage() {
						let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
					
						switch (dataMediaSource) {
							case 'media-xl':
								return mediaPerPage[0]
								break;
							case 'media-lg':
								return mediaPerPage[1]
								break;
							case 'media-md':
								return mediaPerPage[2]
								break;
							case 'media-sm':
								return mediaPerPage[3]
								break;
							case 'media-xs':
								return mediaPerPage[4]
								break;
						};
					};
					
					function checkInitThumbWidth() {
						let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
					
						switch (dataMediaSource) {
							case 'media-xl':
								return mediaThumbFixedWidth[0]
								break;
							case 'media-lg':
								return mediaThumbFixedWidth[1]
								break;
							case 'media-md':
								return mediaThumbFixedWidth[2]
								break;
							case 'media-sm':
								return mediaThumbFixedWidth[3]
								break;
							case 'media-xs':
								return mediaThumbFixedWidth[4]
								break;
						};
					};
					
					function checkInitThumbHeight() {
						let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
					
						switch (dataMediaSource) {
							case 'media-xl':
								return mediaThumbFixedHeight[0]
								break;
							case 'media-lg':
								return mediaThumbFixedHeight[1]
								break;
							case 'media-md':
								return mediaThumbFixedHeight[2]
								break;
							case 'media-sm':
								return mediaThumbFixedHeight[3]
								break;
							case 'media-xs':
								return mediaThumbFixedHeight[4]
								break;
						};
					};
					
					function checkInitThumbGap() {
						let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
					
						switch (dataMediaSource) {
							case 'media-xl':
								return mediaThumbGap[0]
								break;
							case 'media-lg':
								return mediaThumbGap[1]
								break;
							case 'media-md':
								return mediaThumbGap[2]
								break;
							case 'media-sm':
								return mediaThumbGap[3]
								break;
							case 'media-xs':
								return mediaThumbGap[4]
								break;
						};
					};
					function sliderPaginationChecking() {
						let sliderPaginationBlock = $this.find('.splide__custom__pagination');
						setTimeout(function() {
						if (sliderPaginationBlock.find('li').length == 1) {
							sliderPaginationBlock.hide();
						}
						 }, 200);
						
					};
	            }
	        });
	    }	
	};
	
	lpc_template.queue.sliderBlockThumbGallery = function ($self) {
	    var $block = $self.attr('data-slider-gallary-thumb-init') ? $self : $self.find('[data-slider-gallary-thumb-init]');
	    
	    if ($block.length) {
	        $block.each(function(){
	            let $this = $(this);
				let $alignItem = $this.find($this.data('align-item'));
				let mediaGap = $this.data('margin');
				let mediaPerPage = $(this).data('count');
				let mediaThumbGap = $this.data('thumb-margin');
				let mediaThumbFixedWidth = $this.data('thumb-width');
				let mediaThumbFixedHeight = $this.data('thumb-height');
				let mediaThumbDirectionItems = $this.data('thumb-direction');
				let mediaThumbDirection = [];

				mediaThumbDirectionItems.forEach(function (item){
					if(item == 1) {
						item = 'ttb'
					}
					if(item == 0) {
						item = 'ltr'
					}
					mediaThumbDirection.push(item)
				});
	                
	            if($this.find('#main-slider').not('.is-active').length != 0 ) {
	                let splideThumbGallary = new Splide( $this.find('.splide').not('.is-active')[0], {
						autoplay: $this.data('autoplay'),
						speed: $this.data('speed'),
						interval: $this.data('pause'),
	                    rewind: $this.data('infinite'),
	                    lazyLoad: $this.data('lazy-load'),
	                    rewind: true,
	                    perMove: 1,
						perPage: checkInitPerPage(),
						dragMinThreshold: {
						    mouse: 5,
						    touch: 10,
						}	
	                });
	                
	                let thumbnailsGallary = new Splide($this.find('.thumbnail-slider').not('.is-active')[0], {
	                  direction       : checkInitThumbDirection(),
					  rewind          : true,
					  count			  : 6,
					  fixedWidth      : checkInitThumbWidth(),
					  fixedHeight     : checkInitThumbHeight(),
					  isNavigation    : true,
					  pagination      : false,
					  perPage		  : 6,
					  cover           : false,
					  arrows     	  : $this.data('thumb-arrow'),
                	  drag            : true,
                	  padding         : 4,
					  gap             : checkInitThumbGap(),
					  clones          : 5,
					  heightRatio     : $this.data('height'),
					  dragMinThreshold: {
					    mouse: 5,
					    touch: 10,
					  }	,
					  classes 		  : {
					  	arrows: "splide__arrows splide__custom__arrows"
					  }
					});

	                splideThumbGallary.sync( thumbnailsGallary );
	                
	                splideThumbGallary.mount();
	                
            		thumbnailsGallary.mount();
                	
					sliderBreakPoints();
					
					sliderPaginationChecking();
					
					document.addEventListener('dataMediaSourceChange', sliderBreakPoints);
					
					function sliderBreakPoints() {
						
		                let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
						setTimeout(function(){
							if ($alignItem.length) {
								let itemHeight = $alignItem.outerHeight() / 2;
								let arrowsPosition = itemHeight + $alignItem.position().top;
	
								$this.find('.splide__arrow').css('top', arrowsPosition);
							}
						}, 100);
						
		                switch (dataMediaSource) {
		                    case 'media-xl':
		                        splideThumbGallary.options = {
									arrows: true,
									pagination: true,
		                            gap: mediaGap[0],
		                            perPage: mediaPerPage[0],
		                            
		                        };

		                        break;
		                    case 'media-lg':
		                        splideThumbGallary.options = {
									arrows: true,
									pagination: true,
		                            gap: mediaGap[1],
		                            perPage: mediaPerPage[1],
		                        };
		
		                        break;
		                    case 'media-md':
		                        splideThumbGallary.options = {
									arrows: true,
									pagination: true,
		                            gap: mediaGap[2],
		                            perPage: mediaPerPage[2],
		                        };
		                        break;
		                    case 'media-sm':
		                        splideThumbGallary.options = {
									arrows: false,
									pagination: true,
		                            gap: mediaGap[3],
		                            perPage: mediaPerPage[3],
		                        };
		
		                        break;
		                    case 'media-xs':
		                        splideThumbGallary.options = {
									arrows: false,
									pagination: true,
		                            gap: mediaGap[4],
		                            perPage: mediaPerPage[4],
		                        };

		                        break;
		                }
		                if($block.data('slider-gallary-thumb-init') == true) {
							switch (dataMediaSource) {
			                    case 'media-xl':
			                        thumbnailsGallary.options = {
			                            gap: mediaThumbGap[0],
			                            fixedWidth: mediaThumbFixedWidth[0],
			                            fixedHeight: mediaThumbFixedHeight[0],
			                            direction: mediaThumbDirection[0],
		                        		heightRatio     : 3.2,
			                        };
			
			                        break;
			                    case 'media-lg':
			                        thumbnailsGallary.options = {
			                            gap: mediaThumbGap[1],
			                            fixedWidth: mediaThumbFixedWidth[1],
			                            fixedHeight: mediaThumbFixedHeight[1],
			                            direction: mediaThumbDirection[1],
			                            heightRatio     : 3.2,
			                        };
			
			                        break;
			                    case 'media-md':
			                        thumbnailsGallary.options = {
			                            gap: mediaThumbGap[2],
			                            fixedWidth: mediaThumbFixedWidth[2],
			                            fixedHeight: mediaThumbFixedHeight[2],
			                            direction: mediaThumbDirection[2],
			                            heightRatio     : 3.2,
			                        };
			
			                        break;
			                    case 'media-sm':
			                        thumbnailsGallary.options = {
			                            gap: mediaThumbGap[3],
			                            fixedWidth: mediaThumbFixedWidth[3],
			                            fixedHeight: mediaThumbFixedHeight[3],
			                            direction: mediaThumbDirection[3],
			                            heightRatio     : 3.2,
			                        };
			
			                        break;
			                    case 'media-xs':
			                        thumbnailsGallary.options = {
			                            gap: mediaThumbGap[4],
			                            fixedWidth: mediaThumbFixedWidth[4],
			                            fixedHeight: mediaThumbFixedHeight[4],
			                            direction: mediaThumbDirection[4],
			                            heightRatio     : 3.2,
			                        };
			                        
			                        break;
			                }
						}
					};
					
					function checkInitPerPage() {
						let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
					
						switch (dataMediaSource) {
							case 'media-xl':
								return mediaPerPage[0]
								break;
							case 'media-lg':
								return mediaPerPage[1]
								break;
							case 'media-md':
								return mediaPerPage[2]
								break;
							case 'media-sm':
								return mediaPerPage[3]
								break;
							case 'media-xs':
								return mediaPerPage[4]
								break;
						};
					};
					
					function checkInitThumbWidth() {
						let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
					
						switch (dataMediaSource) {
							case 'media-xl':
								return mediaThumbFixedWidth[0]
								break;
							case 'media-lg':
								return mediaThumbFixedWidth[1]
								break;
							case 'media-md':
								return mediaThumbFixedWidth[2]
								break;
							case 'media-sm':
								return mediaThumbFixedWidth[3]
								break;
							case 'media-xs':
								return mediaThumbFixedWidth[4]
								break;
						};
					};
					
					function checkInitThumbHeight() {
						let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
					
						switch (dataMediaSource) {
							case 'media-xl':
								return mediaThumbFixedHeight[0]
								break;
							case 'media-lg':
								return mediaThumbFixedHeight[1]
								break;
							case 'media-md':
								return mediaThumbFixedHeight[2]
								break;
							case 'media-sm':
								return mediaThumbFixedHeight[3]
								break;
							case 'media-xs':
								return mediaThumbFixedHeight[4]
								break;
						};
					};
					
					function checkInitThumbGap() {
						let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
					
						switch (dataMediaSource) {
							case 'media-xl':
								return mediaThumbGap[0]
								break;
							case 'media-lg':
								return mediaThumbGap[1]
								break;
							case 'media-md':
								return mediaThumbGap[2]
								break;
							case 'media-sm':
								return mediaThumbGap[3]
								break;
							case 'media-xs':
								return mediaThumbGap[4]
								break;
						};
					};
					
					function checkInitThumbDirection() {
						let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
					
						switch (dataMediaSource) {
							case 'media-xl':
								return mediaThumbDirection[0]
								break;
							case 'media-lg':
								return mediaThumbDirection[1]
								break;
							case 'media-md':
								return mediaThumbDirection[2]
								break;
							case 'media-sm':
								return mediaThumbDirection[3]
								break;
							case 'media-xs':
								return mediaThumbDirection[4]
								break;
						};
					};
					
					function sliderPaginationChecking() {
						let sliderPaginationBlock = $this.find('.splide__custom__pagination');
						
						setTimeout(function() {
						if (sliderPaginationBlock.find('li').length == 1) {
							sliderPaginationBlock.hide();
						}
						 }, 200);
						
					};
	            }
	        });
	    }	
	};
	
	
	lpc_template.queue.tabsBlocks = function($self) {
		var $block = $self.find('.lp-js-tabs');
		if ($block.length) {
			$block.each(function() {
				let $this = $(this);
				var $tab = $this.find(".lpc-tab-gallery__tab");
				var $tabs = $this.find(".lpc-tab-gallery__tabs");
				var $item = $this.find(".lpc-tab-gallery__image");
				
				if ($tabs.hasClass('_type-group') || $tabs.hasClass('_type-btn')) {
					$tab.first().find('.lp-button').addClass('lpc-button--type-1');
					$tab.first().find('.lp-button').removeClass('lpc-button--type-3');
					$tab.first().find('.lp-button').removeClass('lpc-button--type-2');
					
					setTimeout(function() { 
					let lpcButtonType1 = $this.find('.lpc-button--type-1'); // Ищем внутри текущего блока
        			let borderRadiusValue = lpcButtonType1.css('border-radius'); // Получаем border-radius
        
        			$('.lpc-tab-gallery__tabs._type-group').css('border-radius', borderRadiusValue); // Применяем border-radius только внутри этого блока
					}, 50);
				}
				$tab.first().addClass('active');
			    $item.first().addClass('active');
			
						
			    $tab.on('click', function () {
			        const index = $(this).index(); 
			
			        $tab.removeClass('active');
			        
			        $item.removeClass('active');
			
			        $(this).addClass('active');
			        $item.eq(index).addClass('active');
			        if ($(this).closest('._type-group').length){
			        	if ($(this).hasClass('active')) {
			        		$(this).find('.lp-button').removeClass('lpc-button--type-2', 'lpc-button--type-3');
			        		$(this).find('.lp-button').addClass('lpc-button--type-1');
			        		$(this).siblings('.lpc-tab-gallery__tab').find('.lp-button').removeClass('lpc-button--type-1');
			        		$(this).siblings('.lpc-tab-gallery__tab').find('.lp-button').addClass('lpc-button--type-2', 'lpc-button--type-3');
			        	}
			        }
			        if ($(this).closest('._type-btn').length){
			        	if ($(this).hasClass('active')) {
			        		$(this).find('.lp-button').removeClass('lpc-button--type-2');
			        		$(this).find('.lp-button').addClass('lpc-button--type-1');
			        		$(this).siblings('.lpc-tab-gallery__tab').find('.lp-button').removeClass('lpc-button--type-1');
			        		$(this).siblings('.lpc-tab-gallery__tab').find('.lp-button').addClass('lpc-button--type-2');
			        	}
			        }
				});
			});	
		}
	};
	
	
	lpc_template.queue.fixingPanelShow = function($self) {
		var $fixPanelBasis = $self.find('.lpc-block-fix-panel-basis');
		if($fixPanelBasis.length) {
			$fixPanelBasis.each(function(){
				var $fixPanel = $(this).closest('.lpc-block').find('.lpc-block-fix-panel');
				var $fixPanelWrap = $(this).closest('.lpc-block-fix-panel-wrap');
				
				function isElementInViewport($el) {
				    var rect = $el[0].getBoundingClientRect();
				    return (
				        rect.top >= 0 &&
				        rect.left >= 0 &&
				        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
				        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
				    );
				    
				}
				
				var $sectionTarget = $(this);
				
				if (isElementInViewport($sectionTarget)) {
					 $fixPanel.hide();
				}
				
				$fixPanelWrap.on("scroll", function () {
			        if (isElementInViewport($sectionTarget)) {
			            $fixPanel.hide();
			        } else {
			            $fixPanel.css("display", "flex");
			        }
			    });
			});
		}
	};
	
	lpc_template.queue.videoHoverPlay = function ($self) {
		const $blocks = $self.find('.lpc_hover_play_video');
		
		if (!$blocks.length) return;
	
		let hoverTimeout;
		let leaveTimeout;
	
		$blocks.off('mouseenter.videoHover mouseleave.videoHover');
	
		function setIframeAllowAutoplay($iframe) {
			try {
				const iframe = $iframe[0];
				if (!iframe) return;
				const allow = iframe.getAttribute('allow') || '';
				if (!/autoplay/.test(allow)) {
					iframe.setAttribute('allow', (allow + ' autoplay').trim());
				}
			} catch (e) {
				console.warn('setIframeAllowAutoplay error', e);
			}
		}
	
		function updateQueryParam(url, key, value) {
			try {
				const u = new URL(url, location.href);
				if (value === null) u.searchParams.delete(key);
				else u.searchParams.set(key, value);
				return u.toString();
			} catch (e) {
				if (url.indexOf('?') === -1) return url + '?' + key + '=' + value;
				if (new RegExp('([?&])' + key + '=').test(url)) {
					return url.replace(new RegExp('([?&])' + key + '=[^&]*'), '$1' + key + '=' + value);
				}
				return url + '&' + key + '=' + value;
			}
		}
	
		function getPlatformFromSrc(src) {
			if (!src) return null;
			if (src.includes('youtube.com') || src.includes('youtu.be')) return 'youtube';
			if (src.includes('vk.com')) return 'vk';
			if (src.includes('rutube.ru')) return 'rutube';
			if (src.includes('ok.ru') || src.includes('odnoklassniki')) return 'ok';
			if (src.includes('dzen.ru') || src.includes('zen.yandex')) return 'dzen';
			return null;
		}
	
		function sendCommandToIframe(iframe, platform, command) {
			try {
				if (!iframe || !iframe.contentWindow) return;
				if (platform === 'youtube') {
					iframe.contentWindow.postMessage(
						`{"event":"command","func":"${command === 'play' ? 'playVideo' : 'pauseVideo'}","args":""}`,
						'*'
					);
				} else if (platform === 'vk') {
					iframe.contentWindow.postMessage({ api: 1, method: command }, '*');
				} else if (platform === 'rutube') {
					iframe.contentWindow.postMessage({ type: command }, '*');
				} else if (platform === 'ok') {
					iframe.contentWindow.postMessage({ cmd: command }, '*');
				}
				// Dzen не поддерживает postMessage, поэтому управляем через src
			} catch (e) {
				console.warn('sendCommandToIframe error', e);
			}
		}
	
		function triggerPlay($container) {
			const $iframe = $container.find('iframe').first();
			const $video = $container.find('video').first();
	
			// --- Обычное видео ---
			if ($video.length) {
				const video = $video[0];
				video.muted = true;
				video.setAttribute('playsinline', '');
				video.play().catch(() => {});
				return;
			}
	
			// --- iframe ---
			if (!$iframe.length) return;
	
			const iframe = $iframe[0];
			setIframeAllowAutoplay($iframe);
	
			let src = iframe.getAttribute('src') || '';
			const platform = getPlatformFromSrc(src);
	
			if (platform === 'dzen') {
				src = updateQueryParam(src, 'autoplay', '1');
				src = updateQueryParam(src, 'mute', '1');
				iframe.setAttribute('src', src);
				console.log('Dzen autoplay forced:', src);
				return;
			}
	
			sendCommandToIframe(iframe, platform, 'play');
	
			if (!/autoplay=1/.test(src)) {
				src = updateQueryParam(src, 'autoplay', '1');
				src = updateQueryParam(src, 'mute', '1');
				iframe.setAttribute('src', src);
				console.log('iframe autoplay forced:', src);
			}
		}
	
		function triggerPause($container) {
			const $iframe = $container.find('iframe').first();
			const $video = $container.find('video').first();
	
			// --- Обычное видео ---
			if ($video.length) {
				const video = $video[0];
				video.pause();
				return;
			}
	
			// --- iframe ---
			if (!$iframe.length) return;
	
			const iframe = $iframe[0];
			let src = iframe.getAttribute('src') || '';
			const platform = getPlatformFromSrc(src);
	
			if (platform === 'dzen') {
				src = updateQueryParam(src, 'autoplay', '0');
				iframe.setAttribute('src', src);
				console.log('Dzen autoplay stopped:', src);
				return;
			}
	
			sendCommandToIframe(iframe, platform, 'pause');
	
			if (/autoplay=1/.test(src)) {
				src = updateQueryParam(src, 'autoplay', '0');
				iframe.setAttribute('src', src);
				console.log('iframe autoplay stopped:', src);
			}
		}
	
		$blocks.on('mouseenter.videoHover', function () {
			clearTimeout(leaveTimeout);
			const $this = $(this);
			hoverTimeout = setTimeout(() => {
				triggerPlay($this);
			}, 500);
		});
	
		$blocks.on('mouseleave.videoHover', function () {
			clearTimeout(hoverTimeout);
			const $this = $(this);
			leaveTimeout = setTimeout(() => {
				triggerPause($this);
			}, 500);
		});
	};
	
	lpc_template.queue.videoPlayButtonDefolt = function($self) {
	    var $allVideoParents = $self.find('.js-lp-play-video').closest('.lp-video-block-wrappper');
	
	    $self.on('touchend click', '.js-lp-play-video', function(e) {
	        e.preventDefault();
	
	        var $this = $(this);
	        var thisVideo = $this.parent('.lp-video-block-wrappper').find('video')[0];
	
	        $this.addClass('hide');
	        thisVideo.setAttribute('controls', 1);
	        thisVideo.play();
	        
	    });
	    
	    $allVideoParents.find('video').each(function(){
			var $video = $(this);
			
			this.addEventListener('play', function() {
				$video.parent('.lp-video-block-wrappper').find('.js-lp-play-video').addClass('hide');
			});
			
			this.addEventListener('pause', function(){
				$video.parent('.lp-video-block-wrappper').find('.js-lp-play-video').removeClass('hide');
			});
		});
	};
	
	lpc_template.queue.videoPlayButton = function($self) {
	    let $block = $self.find('.lpc-play-video-init');
	    
	    if ($block.length) {
	        $block.each(function() {
	            let $this = $(this);
	            let $videoPlayButton = $this.find('.js-lp-play-video');
	            let $allVideoParets = $this.find('.lp-video-block-wrappper');
	            let thisVideo = $allVideoParets.find('video')[0];
	            	
	            function isMobile() {
	                return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent) || window.innerWidth <= 768;
	            }
	
	            function togglePlayButton($video, show) {
	                let $button = $video.parent('.lp-video-block-wrappper').find('.js-lp-play-video');
	                if (show) {
	                    $button.removeClass('hide');
	                } else {
	                    $button.addClass('hide');
	                }
	            }
	                        
	            if (isMobile()) {
	                $videoPlayButton.addClass('hide');
	                if (thisVideo) {
	                    thisVideo.play();
	                    thisVideo.setAttribute('controls', 1);
	                }
	                return;
	            }
	            
	            $videoPlayButton.on('touchstart click', function(event) {
	                event.preventDefault();
	                let $this = $(this);
	
	                if (thisVideo) {
	                    $this.addClass('hide');
	                    thisVideo.play();
	                    thisVideo.setAttribute('controls', 1);
	                }
	            });
	
	            $allVideoParets.find('video').each(function() {
	                let $video = $(this);
	                
	                this.addEventListener('play', function() {
	                    togglePlayButton($video, false);
	                });
	        
	                this.addEventListener('pause', function() {
	                    togglePlayButton($video, true);
	                });
	            });
	        });
	    }
	};

	lpc_template.queue.autoplayVideo = function ($self) {
    var $block = $self.find('[data-autoplay-video="1"]');
	
    if ($block.length) {
      $block.on("autoplayVideo", function (e, type, nodeName) {
        var video = this.querySelector(nodeName);

        if (nodeName === "video") {
          if (type === "play") {
            video.play();
          } else {
            video.pause();
          }
        } else if (nodeName === "iframe") {
          var video = $(video).data("youtube");

          if (type === "play") {
            video.playVideo();
          } else {
            video.pauseVideo();
          }
        }
      });
    }

    //setTimeout(function(){
    //	$win.trigger('scroll');
    //}, 1000);
  };
  
  	lpc_template.queue.audioBlock = function ($self) {
	    var $block = $self.find('.lpc-audio');
	
	    let observer = new IntersectionObserver((entries, observer) => {
	        entries.forEach(entry => {
	            if (entry.isIntersecting) {
	                let $block = $(entry.target);
	                initAudioBlock($block);
	                observer.unobserve(entry.target); // Убираем наблюдение после инициализации
	            }
	        });
	    }, { threshold: 0.3 }); // Настроен на 30% видимости
	
	    $block.each(function () {
	        observer.observe(this);
	    });
	
	    
	    
	    function initAudioBlock($block) {
	    let audios = $block.find("audio");
	    let playPauseButtons = $block.find(".audio-play-pause");
	    let progressBars = $block.find(".audio-progress");
	    let timeDisplays = $block.find(".audio-time");
	    let volumeSliders = $block.find(".audio-volume");
	    let downloadButtons = $block.find(".audio-download");
	    let muteButtons = $block.find(".audio-muted");
	    let moreBtns = $block.find('.audio-more-btn');
	    let speedSelects = $block.find('.audio-speed-select');
	
	    playPauseButtons.each(function (index) {
	        let playPause = $(this);
	        let audio = audios[index];
	        let volumeSlider = volumeSliders.eq(index);
	        let downloadButton = downloadButtons.eq(index);
	        let muteButton = muteButtons.eq(index);
	        let moreBtn = moreBtns.eq(index);
	        let speedSelect = speedSelects.eq(index);
	        let progressBar = progressBars.eq(index);
	        let timeDisplay = timeDisplays.eq(index);
	
	        let computedColor = '#ffffff'; // fallback по умолчанию
	
	        setTimeout(() => {
	            let audioPlayer = playPause.closest('.audio-player')[0];
	            if (audioPlayer) {
	                computedColor = getComputedStyle(audioPlayer).color;
	            }
	
	            // Установка градиента громкости при инициализации
	            volumeSlider.css('background', `linear-gradient(to right, var(--primary-color-base) 100%, ${computedColor} 100%)`);
	        }, 50);
	
	        let playIcon = '<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.6235 17.8087L17.5059 13.3848C17.8353 13.1724 18 12.8775 18 12.5C18 12.1225 17.8353 11.8276 17.5059 11.6152L10.6235 7.1913C10.2706 6.95536 9.91177 6.93767 9.54706 7.13822C9.18235 7.33877 9 7.65139 9 8.07609V16.9239C9 17.3486 9.18235 17.6612 9.54706 17.8618C9.91177 18.0623 10.2706 18.0446 10.6235 17.8087Z"/></svg>';
			let pauseIcon = '<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 17C8 17.5523 8.44772 18 9 18H10C10.5523 18 11 17.5523 11 17V8C11 7.44771 10.5523 7 10 7H9C8.44772 7 8 7.44772 8 8V17ZM14 17C14 17.5523 14.4477 18 15 18H16C16.5523 18 17 17.5523 17 17V8C17 7.44771 16.5523 7 16 7H15C14.4477 7 14 7.44772 14 8V17Z" fill="#1F1F1F"/></svg>';
	
	        playPause.on("click", function () {
	            if (audio.paused) {
	                $("audio").each(function () { this.pause(); });
	                $(".audio-play-pause").html(playIcon);
	                audio.play();
	                playPause.html(pauseIcon);
	            } else {
	                audio.pause();
	                playPause.html(playIcon);
	            }
	        });
	
	        $(audio).on("timeupdate", function () {
	            if (isFinite(audio.duration)) {
	                let val = (audio.currentTime / audio.duration) * 100;
	                progressBar.val(val);
	                timeDisplay.text(formatTime(audio.currentTime));
	                progressBar.css('background', `linear-gradient(to right, var(--primary-color-base) ${val}%, ${computedColor} ${val}%)`);
	            }
	        });
	
	        progressBar.on("input", function () {
	            if (isFinite(audio.duration)) {
	                audio.currentTime = (progressBar.val() / 100) * audio.duration;
	            }
	        });
	
	        volumeSlider.on("input", function () {
	            audio.volume = volumeSlider.val();
	            let valVol = audio.volume * 100;
	            volumeSlider.css('background', `linear-gradient(to right, var(--primary-color-base) ${valVol}%, ${computedColor} ${valVol}%)`);
	
	            if (audio.volume == 0) {
	                muteButton.addClass('mute');
	            } else {
	                muteButton.removeClass('mute');
	            }
	
	            if (audio.muted) audio.muted = false;
	        });
	
	        downloadButton.on("click", function () {
	            let audioSrc = $(audio).attr("src");
	            let link = document.createElement("a");
	            link.href = audioSrc;
	            link.download = audioSrc.split("/").pop();
	            document.body.appendChild(link);
	            link.click();
	            document.body.removeChild(link);
	        });
	        
	        
	        muteButton.on("click", function () {
	            $(this).toggleClass('mute');
	            audio.muted = !audio.muted;
	
	            if (audio.muted) {
	                volumeSlider.val(0);
	                volumeSlider.css('background', `linear-gradient(to right, var(--primary-color-base) 0%, ${computedColor} 0%)`);
	            } else {
	                let vol = audio.volume || 1;
	                let volVal = vol * 100;
	                volumeSlider.val(vol);
	                volumeSlider.css('background', `linear-gradient(to right, var(--primary-color-base) ${volVal}%, ${computedColor} ${volVal}%)`);
	            }
	        });
	
	        moreBtn.on('click', function () {
	        	$(".audio-more-dropdown").hide().find('.audio-speed-select').removeClass('_open');
	            $(this).siblings('.audio-more-dropdown').show().css({  "transform": "translate(0px, 0px)",  "opacity": "1"});
	        });
	
	        $(document).on("click", ".audio-speed-control", function () {
	            $(this).find(".audio-speed-select").addClass('_open');
	        });
	
	        $(document).on("click", function (e) {
	            if (!$(e.target).closest('.audio-more-dropdown').length && !$(e.target).closest('.audio-more-btn').length) {
	                $(".audio-more-dropdown").hide().find('.audio-speed-select').removeClass('_open');
	            }
	        });
	
	        speedSelect.on('change', function () {
	            let speed = parseFloat($(this).val());
	            if (audio) audio.playbackRate = speed;
	        });
	
	        function formatTime(seconds) {
	            let min = Math.floor(seconds / 60);
	            let sec = Math.floor(seconds % 60).toString().padStart(2, "0");
	            return `${min}:${sec}`;
	        }
	    });
	}
	};
	
	lpc_template.queue.lgNew = function($self) {
	    let $block = $self.find('.js-new-lg-init');

	    if ($block.length) {
	        $block.each(function() {
	            let $block = $(this);
	            let lgCounter = $block.data('lg-counter');
	            let lgThumbnail = $block.data('lg-thumbnail');
	            
				//setTimeout(function() {
					lightGallery($block[0], {
		                plugins: [Zoom, Thumbnail, Video],
		                counter: lgCounter,
		                thumbnail: lgThumbnail,
		                selector: '.lpc-lg-item',
		                download: false,
		                mobileSettings: {
		                    preload: 2,
		                    controls: false,
		                    showCloseIcon: true
		                }
		            });
				//}, 2000);
	            
	            $block.find('.lpc-lg-item').removeClass('lpc_lg_pointer_events');
	        });
	    }
	}; 

	lpc_template.queue.lg = function ($self) {
    var $block = $self.find(".js-lg-init");

    if ($block.length) {
      //setTimeout(function () {
        $block.lightGallery({
          selector: ".lg-item",
          toogleThumb: false,
          getCaptionFromTitleOrAlt: false,
          download: false,
          thumbWidth: 64,
          thumbHeight: "64px",
          addClass: "_lpc-lg",
          nextHtml:
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.98528 4.32805C9.3758 3.93753 10.009 3.93753 10.3995 4.32805L17.0563 10.9849C17.4469 11.3754 17.4469 12.0086 17.0563 12.3991L10.3995 19.056C10.009 19.4465 9.3758 19.4465 8.98528 19.056C8.59475 18.6654 8.59475 18.0323 8.98528 17.6418L14.935 11.692L8.98528 5.74226C8.59475 5.35174 8.59475 4.71857 8.98528 4.32805Z" fill="white"/></svg>',
          prevHtml:
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.8492 5.03516L8.19239 11.692L14.8492 18.3489" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        });
        
        $block.find('.lg-item').removeClass('lpc_lg_pointer_events');
        
      //}, 500);
    }
  };
  
  
  	// ================================= НЕ УДАЛЯТЬ! Тестовый код ================================= //
  	
  	// Заголовки для LPCv4 для медиа-запросов
	lpc_template.queue.adaptiveTitle = function ($self) {
	    let $block = $self.find('.adaptive_text_init');
	
	    if ($block.length) {
	
	        // Объект для хранения состояния фиксации размеров шрифтов для каждого заголовка и разрешения
	        let fixedSizes = {
	            'media-lg': {},
	            'media-md': {},
	            'media-sm': {},
	            'media-xs': {}
	        };
	
	        $block.each(function() {
	            $(this).find('.font-size-input').each(function() {
	                const media = $(this).data('media');
	                const heading = $(this).data('title'); // Заголовки (h1, h2, ..., h6)
	                const fontSize = parseFloat($(this).val());
	                const textElement = $self.find(`.lpc-adaptive-text__box[data-media="${media}"] .lpc-adaptive-text__title[data-title="${heading}"]`);
	
	                // Установка начального размера шрифта
	                textElement.css('fontSize', `${fontSize}px`);
	
	                $(this).on('input', function() {
	                    let newFontSize = parseFloat($(this).val());
	
	                    if (newFontSize < 0 || isNaN(newFontSize)) {
	                        newFontSize = Math.abs(newFontSize) || 0;
	                        $(this).val(newFontSize);
	                    }
	
	                    if (!isNaN(newFontSize)) {
	                        newFontSize = Math.round(newFontSize);
	                    }
	
	                    if (media === 'media-xl') {
	
	                        // Диапазоны для других разрешений
	                        const sizeLimits = {
	                            'h1': {
	                                'media-lg': { min: 34, max: 68 },
	                                'media-md': { min: 32, max: 64 },
	                                'media-sm': { min: 30, max: 60 },
	                                'media-xs': { min: 28, max: 56 }
	                            },
	                            'h2': {
	                                'media-lg': { min: 32, max: 62 },
	                                'media-md': { min: 30, max: 58 },
	                                'media-sm': { min: 28, max: 54 },
	                                'media-xs': { min: 26, max: 50 }
	                            },
	                            'h3': {
	                                'media-lg': { min: 30, max: 56 },
	                                'media-md': { min: 28, max: 52 },
	                                'media-sm': { min: 26, max: 48 },
	                                'media-xs': { min: 24, max: 44 }
	                            },
	                            'h4': {
	                                'media-lg': { min: 28, max: 50 },
	                                'media-md': { min: 26, max: 46 },
	                                'media-sm': { min: 24, max: 42 },
	                                'media-xs': { min: 22, max: 38 }
	                            },
	                            'h5': {
	                                'media-lg': { min: 26, max: 44 },
	                                'media-md': { min: 24, max: 40 },
	                                'media-sm': { min: 22, max: 36 },
	                                'media-xs': { min: 20, max: 32 }
	                            },
	                            'h6': {
	                                'media-lg': { min: 24, max: 40 },
	                                'media-md': { min: 22, max: 36 },
	                                'media-sm': { min: 20, max: 32 },
	                                'media-xs': { min: 18, max: 28 }
	                            }
	                        };
							
	                        // Адаптация размеров для других медиа-устройств
	                        const sizeRatios = {
	                            'media-lg': 0.9,
	                            'media-md': 0.9,
	                            'media-sm': 0.75,
	                            'media-xs': 0.65
	                        };
	
	                        $self.find('.font-size-input').each(function() {
	                            const otherMedia = $(this).data('media');
	                            const otherHeading = $(this).data('title');
	                            const otherTextElement = $self.find(`.lpc-adaptive-text__box[data-media="${otherMedia}"] .lpc-adaptive-text__title[data-title="${otherHeading}"]`);
	
	                            if (otherHeading === heading && (otherMedia === 'media-xl' || !fixedSizes[otherMedia][heading])) {
	                                let adaptedSize = otherMedia === 'media-xl' ? newFontSize : Math.round(newFontSize * sizeRatios[otherMedia]);
	
	                                // Применение ограничений для других медиа-устройств
	                                if (sizeLimits[heading] && sizeLimits[heading][otherMedia]) {
	                                    const { min, max } = sizeLimits[heading][otherMedia];
	                                    adaptedSize = Math.min(Math.max(adaptedSize, min), max);
	                                }
	
	                                $(this).val(adaptedSize);
	                                otherTextElement.css('fontSize', `${adaptedSize}px`);
	                                $(this).css('color', 'green');
	                            }
	                        });
	
	                    } else {
	                        fixedSizes[media][heading] = true;
	                        textElement.css('fontSize', `${newFontSize}px`);
	                        $(this).css('color', 'red');
	                        $(this).val(newFontSize);
	                    }
	                });
	            });
	        });
	    }
	};
	
	// Заголовки для LP для ширины сайта
	lpc_template.queue.adaptiveTitleContent = function ($self) {
	    let $block = $self.find('.adaptive_width_init');
	
	    if ($block.length) {
	        const sizeRatios = {
	            'h1': 1,
	            'h2': 0.9,
	            'h3': 0.8,
	            'h4': 0.7,
	            'h5': 0.6,
	            'h6': 0.5
	        };
	       
	        const sizeLimits = {
	            'h2': {
	                'media-xl': { min: 34, max: 66 },
	                'media-lg': { min: 32, max: 62 },
	                'media-md': { min: 30, max: 58 },
	                'media-sm': { min: 28, max: 54 },
	                'media-xs': { min: 26, max: 50 }
	            },
	            'h3': {
	                'media-xl': { min: 32, max: 60 },
	                'media-lg': { min: 30, max: 56 },
	                'media-md': { min: 28, max: 52 },
	                'media-sm': { min: 26, max: 48 },
	                'media-xs': { min: 24, max: 44 }
	            },
	            'h4': {
	                'media-xl': { min: 30, max: 54 },
	                'media-lg': { min: 28, max: 50 },
	                'media-md': { min: 26, max: 46 },
	                'media-sm': { min: 24, max: 42 },
	                'media-xs': { min: 22, max: 38 }
	            },
	            'h5': {
	                'media-xl': { min: 28, max: 48 },
	                'media-lg': { min: 26, max: 44 },
	                'media-md': { min: 24, max: 40 },
	                'media-sm': { min: 22, max: 36 },
	                'media-xs': { min: 20, max: 32 }
	            },
	            'h6': {
	                'media-xl': { min: 26, max: 44 },
	                'media-lg': { min: 24, max: 40 },
	                'media-md': { min: 22, max: 36 },
	                'media-sm': { min: 20, max: 32 },
	                'media-xs': { min: 18, max: 28 }
	            }
	        };
	
	        $block.each(function() {
	            $(this).find('.font-size-input').each(function() {
	                const media = $(this).data('media');
	                const heading = $(this).data('title'); // Заголовки (h1, h2, ..., h6)
	                const fontSize = parseFloat($(this).val());
	                const textElement = $self.find(`.lpc-adap-title-bl__container[data-media="${media}"] .lpc-title-js[data-title="${heading}"]`);
	
	                // Установка начального размера шрифта
	                textElement.css('fontSize', `${fontSize}px`);
	
	                $(this).on('input', function() {
	                    let newFontSize = parseFloat($(this).val());
	
	                    if (newFontSize < 0 || isNaN(newFontSize)) {
	                        newFontSize = Math.abs(newFontSize) || 0;
	                        $(this).val(newFontSize);
	                    }
	
	                    if (!isNaN(newFontSize)) {
	                        newFontSize = Math.round(newFontSize);
	                    }
	                   
	                    if (heading === 'h1') {
	                        $self.find(`.font-size-input[data-media="${media}"]`).each(function() {
	                            const otherHeading = $(this).data('title');
	                            const otherTextElement = $self.find(`.lpc-adap-title-bl__container[data-media="${media}"] .lpc-title-js[data-title="${otherHeading}"]`);
	
	                            // Рассчитываем размер шрифта на основе соотношения
	                            let adjustedSize = Math.round(newFontSize * sizeRatios[otherHeading]);
	
	                            // Применение ограничений для размера шрифта
	                            if (sizeLimits[otherHeading] && sizeLimits[otherHeading][media]) {
	                                const { min, max } = sizeLimits[otherHeading][media];
	                                adjustedSize = Math.min(Math.max(adjustedSize, min), max);
	                            }
	
	                            $(this).val(adjustedSize);
	                            otherTextElement.css('fontSize', `${adjustedSize}px`);
	                            $(this).css('color', 'green');
	                        });
	                    } else {
	                        textElement.css('fontSize', `${newFontSize}px`);
	                        $(this).css('color', 'red');
	                    }
	                });
	            });
	        });
	    }
	};
	
	lpc_template.queue.adaptiveTexeContent = function ($self) {
	    let $block = $self.find('.adaptive_text_width_init');
	
	    if ($block.length) {
	    	
	        const sizeRatios = {
	            'p1': 1,
	            'p2': 0.95,
	            'p3': 0.9,
	            'p4': 0.85,
	        };
	
	       
	        const sizeLimits = {
	            'p2': {
	                'media-xl': { min: 20, max: 22 },
	                'media-lg': { min: 20, max: 22 },
	                'media-md': { min: 18, max: 20 },
	                'media-sm': { min: 18, max: 20 },
	                'media-xs': { min: 16, max: 18 }
	            },
	            'p3': {
	                'media-xl': { min: 18, max: 20 },
	                'media-lg': { min: 18, max: 20 },
	                'media-md': { min: 16, max: 18 },
	                'media-sm': { min: 16, max: 18 },
	                'media-xs': { min: 15, max: 16 }
	            },
	            'p4': { 
	                'media-xl': { min: 16, max: 18 },
	                'media-lg': { min: 16, max: 18 },
	                'media-md': { min: 16, max: 16 },
	                'media-sm': { min: 14, max: 16 },
	                'media-xs': { min: 14, max: 14 }
	            }
	        };
	
	        $block.each(function() {
	            $(this).find('.font-size-input').each(function() {
	                const media = $(this).data('media');
	                const heading = $(this).data('text'); // Заголовки (p1, p2, ..., h4)
	                const fontSize = parseFloat($(this).val());
	                const textElement = $self.find(`.lpc-adap-text-bl__container[data-media="${media}"] .lpc-text-js[data-text="${heading}"]`);
	
	                
	                textElement.css('fontSize', `${fontSize}px`);
	
	                $(this).on('input', function() {
	                    let newFontSize = parseFloat($(this).val());
	
	                    if (newFontSize < 0 || isNaN(newFontSize)) {
	                        newFontSize = Math.abs(newFontSize) || 0;
	                        $(this).val(newFontSize);
	                    }
	
	                    if (!isNaN(newFontSize)) {
	                        newFontSize = Math.round(newFontSize);
	                    }
	
	                    
	                    if (heading === 'p1') {
	                       
	                        $self.find(`.font-size-input[data-media="${media}"]`).each(function() {
	                            const otherHeading = $(this).data('text');
	                            const otherTextElement = $self.find(`.lpc-adap-text-bl__container[data-media="${media}"] .lpc-text-js[data-text="${otherHeading}"]`);
	
	                            
	                            let adjustedSize = Math.round(newFontSize * sizeRatios[otherHeading]);
	
	                            
	                            if (sizeLimits[otherHeading] && sizeLimits[otherHeading][media]) {
	                                const { min, max } = sizeLimits[otherHeading][media];
	                                adjustedSize = Math.min(Math.max(adjustedSize, min), max);
	                            }
	
	                            $(this).val(adjustedSize);
	                            otherTextElement.css('fontSize', `${adjustedSize}px`);
	                            $(this).css('color', 'green');
	                        });
	                    } else {
	                        
	                        textElement.css('fontSize', `${newFontSize}px`);
	                        $(this).css('color', 'red');
	                    }
	                });
	            });
	        });
	    }
	};
	
	lpc_template.queue.tabsInitTest = function ($self) {
	    let $block = $self.find('.adaptive_width_init');
	
	    if ($block.length) {
	        $block.each(function() {
	            let $this = $(this);
	            let $button = $this.find('.lp-button');
	            let $tab = $this.find('.tab');
	            
	            $button.click(function() {
	                $button.removeClass('active');
	                $tab.removeClass('active');
	                
	                $(this).addClass('active'); 
	                $('#' + $(this).data('tab')).addClass('active'); 
	            });
	        });
	    }
	};
	// ================================= НЕ УДАЛЯТЬ! Тестовый код ================================= //
	
	
	lpc_template.queue.lpcContact2 = function ($blocks) {
	    var $block = $blocks.find(".lpc-contact-2");
	    let dataMediaSource = document.querySelector('.decor-wrap').dataset.mediaSource;
	    
	    if ($block.length && (dataMediaSource != 'media-sm' && dataMediaSource != 'media-xs')) {
	    	$block.each(function(){
	    		var $this = $(this),
	    		lpcMapBlockHeight = $this.find('.lpc-contact-2__content').height(),
				lpcMapBlock = $this.find('.lpc-contact-2__map-wrap');
				
		    	setTimeout(function() {
					lpcMapBlock.css('max-height', lpcMapBlockHeight)
		    	}, 1000);
	    	});
	    	
    	}
  	};
  	
  	lpc_template.queue.lpcConstructorFrameSelection = function ($blocks) {
  		if(window.location.pathname == "/my/s3/cms/v1/lp/live.edit.php") {
  			$('.content-lp-wrapper').addClass("lpc-const-frame-selection");
  		}
  		/*if(window.location.host == "mf1.ravshan95.oml.ru") {
  			$('.content-lp-wrapper').addClass("lpc-const-frame-selection-fix");
  		}*/
  	};
  	
  	lpc_template.queue.lpcForm5 = function ($blocks) {
	    var $block = $blocks.find(".lpc-form-5");
	    
	  	if ($block.length) {
	  		if($block.find("textarea").length != 0) {
	  		document.querySelector('.lpc-form-5 textarea').addEventListener('input', function (e) {
	  			
			  e.target.style.height = 50 + "px";
			  e.target.style.height = e.target.scrollHeight + 2 + "px"
			});
	    	
	  		}
	  	}
  	};
  	
  	lpc_template.queue.lpStepForm = function($self) {
	  var $block = $self.find('.js-lp-steps-form');
	
	  if ($block.length) {
	    $block.formsteps();
	  }
	};

  lpc_template.checkAutoplayVideo = function ($blocks) {
    $blocks.each(function () {
      var $this = $(this),
        playStatus = $this.data("playStatus"),
        inViewport = isElementInViewport(this),
        $video = $this.find("video"),
        $thisVideo = $video.length ? $video : $this.find("iframe");

      if (inViewport && playStatus !== "play") {
        $this.trigger("autoplayVideo", [
          "play",
          $thisVideo[0].nodeName.toLowerCase(),
        ]);
        $this.data("playStatus", "play");
      } else if (!inViewport && playStatus === "play") {
        $this.trigger("autoplayVideo", [
          "pause",
          $thisVideo[0].nodeName.toLowerCase(),
        ]);
        $this.data("playStatus", "pause");
      }
    });
  };
  

  window.lp_init = function ($block) {
  	
  	if (typeof ReactLPConstructor == 'object') {
	    s3LP.is_cms = true;
	} // чтобы флаг заработал в новом конструкторе
	
	
	var initializedMaps = [];

	var $maps = $block.find('.js-lpc-simple-map');
	
	if ($maps.length) {
	    $maps.each(function() {
	        var mapElement = this;
	        var id = $(mapElement).attr('id');
	
	        if (initializedMaps.includes(id)) return; 
	
	        var observer = new IntersectionObserver(function(entries, observerInstance) {
	            entries.forEach(function(entry) {
	                if (entry.isIntersecting) {
	                	
	                    lpc_template.initMaps($(mapElement)); 
	                    initializedMaps.push(id); 
	                    observerInstance.unobserve(entry.target);
	                }
	            });
	        }, {
	            root: null,
	            rootMargin: '0px',
	            threshold: 0.1
	        });
	
	        observer.observe(mapElement);
	    });
	}

    /*var $maps = $block.find(".js-lpc-simple-map");

    if ($maps.length) {
      setTimeout(function () {
        lpc_template.checkMapInitialization($maps);
      }, 250);
      $win.on("scroll", function () {
        lpc_template.checkMapInitialization($maps);
      });
      
    }*/

    if (s3LP.is_cms) {
      var contentColor = $("#lpc_contructor_iframe")
        .contents()
        .find(".decor-wrap")
        .css("color");
      $("#landing_page_site").css("color", contentColor);
    }

    $win
      .on("resize", function () {
        var decorWidth = $(".decor-wrap").width();
        $(".lpc-block").css("max-width", decorWidth);
      })
      .trigger("resize");

    Object.keys(lpc_template.queue).forEach(function (func) {
      var thisFunction = lpc_template.queue[func];
      if (typeof thisFunction == "function") {
        thisFunction($block);
      }
    });

    var $autoplayVideo = $doc.find('[data-autoplay-video="1"]');

    if ($autoplayVideo.length && !s3LP.is_cms && window.self == window.top) {
      $win.on("scroll", function () {
        lpc_template.checkAutoplayVideo($autoplayVideo);
      });
    }
    
    

    let timeout;

    $win
      .on("resize", function () {

        clearTimeout(timeout)

        timeout = setTimeout(function(){
          lpc_template.adaptiveBlock();
          lpc_template.popupAdaptiveBlock();
        }, 80);

        $(".js-proportion-height").each(function () {
          var $this = $(this);

          setProportionHeight($this, $this.data("proportion") || 100);
        });
      })
      .trigger("resize");

    if (s3LP.is_cms && typeof LpController !== 'undefined') {
      LpController.convertImages($block);

      setTimeout(function () {
        LpController.convertImages($block);
        LpController.afterSave(function () {
          $(".lpc-features-3-chart-item__number").each(function () {
            var $this = $(this);
            $this
              .closest(".lpc-features-3-chart-item")
              .find(".lpc-features-3-chart-item__bar-inner")
              .css("width", $this.text());
          });
        });
      }, 1000);
    }

    if (document.location.hash.length > 1 && $(document.location.hash).length) {
      setTimeout(function () {
        $("html, body").scrollTop($(document.location.hash).offset().top);
      }, 200);
    }
    
    
    document.dispatchEvent(new Event('lpc_init_after', {bubbles: true}));
  };

  window.onYouTubeIframeAPIReady = function () {
    $(function () {
      var listYoutube = $(".js-lp-video-youtube");

      listYoutube.each(function () {
        var $this = $(this),
          isFullFrame = $this.hasClass("_not-paused");

        var player = new YT.Player(this.id, {
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          mute: isFullFrame ? 1 : 0,
          playsinline: 1,
          showinfo: isFullFrame ? 0 : 1,
          events: {
            onStateChange: function (event) {
              if (
                event.data == YT.PlayerState.ENDED &&
                $(event.target.a).hasClass("_not-paused")
              ) {
                event.target.playVideo();
              }
            },
          },
        });

        $this.data("youtube", player);
      });
    });
  };

  function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return rect.top <= window.innerHeight - 200 && rect.bottom >= 50;
  }

  function setProportionHeight($block, proportion) {
    $block.height(($block.width() * proportion) / 100);
  }
  
	function s3PreloaderMutation(target) {
		const config = {
			attributes: true
		};
	
		const callback = function (mutationsList, observer) {
			for (let mutation of mutationsList) {
				if ($(target).find('.s3-preloader').hasClass('s3-preloader-hide') || $(target).hasClass('s3-preloader-hide')) {
					document.dispatchEvent(new Event('lpcLoadingDone', {bubbles: true}));
				}
			}
		};
	
		const observer = new MutationObserver(callback);
		observer.observe(target, config);
	};

})();


document.addEventListener('lpc_init_after', function () { // вместо  DOMContentLoaded используем lpc_init_after чтобы работало в новом конструкторе, так как там нет события DOMContentLoaded
    if (!s3LP.is_cms) {
        // Храним уникальные ключи отправленных целей, чтобы не отправлять их повторно
        const sentGoals = new Set();

        function sendBlockGoals(block, eventType) {
            // Определяем соответствия: атрибут → система
            const systems = [
                { attr: 'data-goal-metrika', system: 'metrika' },
                { attr: 'data-goal-sber', system: 'sber_ads' },
                { attr: 'data-goal-analytics', system: 'analytics' }
            ];

            systems.forEach(({ attr, system }) => {
                const label = block.getAttribute(attr);
                if (label) {
                    // Формируем уникальный ключ, чтобы предотвратить повторную отправку
                    const key = `${system}_${label}_${eventType}`;
                    if (!sentGoals.has(key)) {
                        // Для sber_ads проверяем наличие счетчика, чтобы избежать ошибки
                        if (system === 'sber_ads') {
                            if (!s3.Goal.sberADSCounters || !s3.Goal.sberADSCounters[0]) {
                                console.warn("SberAds counter not available. Skipping sber_ads goal.");
                                return;
                            }
                        }
                        sentGoals.add(key);
                        s3.Goal.send({
                            system: system,
                            object: 'block',    // можно изменить тип объекта при необходимости
                            event: eventType,   // 'view' или 'anchor'
                            label: label
                        });
                    }
                }
            });
        }

        /**
         * Наблюдение за блоками, имеющими хотя бы один из data-атрибутов цели.
         * При появлении блока в зоне видимости (50%) вызывается отправка события 'view',
         * если для блока ранее не было отправлено событие 'anchor'.
         */
        function observeBlocks() {
            const blocks = document.querySelectorAll('[data-goal-metrika], [data-goal-sber], [data-goal-analytics]');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Если для блока уже отправлено событие 'anchor', не отправляем 'view'
                        if (entry.target.dataset.goalAnchorSent !== "true") {
                            sendBlockGoals(entry.target, 'view');
                        }
                        observer.unobserve(entry.target); // прекращаем наблюдение после отправки
                    }
                });
            }, { threshold: 0.5 });

            blocks.forEach((block) => observer.observe(block));
        }

        /**
         * Обработка кликов по якорным ссылкам.
         * Если целевой блок имеет цели, отправляем их с типом 'anchor'.
         */
        function trackAnchorClicks() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function () {
                    const targetId = this.getAttribute('href').substring(1);
                    const targetBlock = document.getElementById(targetId);
                    if (targetBlock) {
                        sendBlockGoals(targetBlock, 'anchor');
                        // Отмечаем, что для этого блока уже отправлено событие 'anchor'
                        targetBlock.dataset.goalAnchorSent = "true";
                    }
                });
            });
        }

        // Если страница открыта с якорем, сразу отправляем событие 'anchor' для соответствующего блока
        if (window.location.hash) {
            const targetId = window.location.hash.substring(1);
            const targetBlock = document.getElementById(targetId);
            if (targetBlock) {
                sendBlockGoals(targetBlock, 'anchor');
                targetBlock.dataset.goalAnchorSent = "true";
            }
        }

        // Инициализируем наблюдение за блоками и обработку якорных ссылок
        observeBlocks();
        trackAnchorClicks();
    };
});


document.addEventListener("lpc_init_after", function () { // вместо  DOMContentLoaded используем lpc_init_after чтобы работало в новом конструкторе, так как там нет события DOMContentLoaded
    let lpContent = document.getElementById("lp_constructor");
    let timeout = 20;
    if (lpContent) {
        timeout = 1500;
    }
    
    setTimeout(function () {
    	
	    const toRGBAArray = (rgbStr) => {
	        const values = rgbStr.match(/[\d.]+/g).map(Number);
	        
	        if (values.length === 3) values.push(1);
	        return values;
	    };
	
	    const baseTextColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color-base-header').trim();
	
	    document.querySelectorAll('.has_custom_bg').forEach(function (element) {
	        const computedStyle = window.getComputedStyle(element);
	        const bgColor = computedStyle.backgroundColor;
	        const rgba = toRGBAArray(bgColor);
	        const alpha = rgba[3];
	       
	        if (bgColor === "transparent" || alpha === 0) {
	            element.style.color = baseTextColor;
	            element.querySelectorAll('[data-elem-type="text"], [data-elem-type="header"], [data-elem-type="generate"], .has-custom-bg-item').forEach(function (innerElem) {
	                innerElem.style.color = baseTextColor;
	            });
	            return;
	        }
	
	        const brightness = Math.round((rgba[0] * 299 + rgba[1] * 587 + rgba[2] * 114) / 1000);
	        const textColor = brightness > 150 ? baseTextColor : '#fff';
	
	        element.style.color = textColor;
	        element.querySelectorAll('[data-elem-type="text"], [data-elem-type="header"], [data-elem-type="generate"], .has-custom-bg-item').forEach(function (innerElem) {
	            innerElem.style.color = textColor;
	        });
	    });
	
	    document.querySelectorAll('.ya-share2').forEach(function (element) {
	        const computedStyle = window.getComputedStyle(element);
	        const rgba = toRGBAArray(computedStyle.backgroundColor);
	        const alpha = rgba[3];
	
	        const brightness = Math.round((rgba[0] * 299 + rgba[1] * 587 + rgba[2] * 114) / 1000);
	
	        if (alpha === 0 || computedStyle.backgroundColor === "transparent" || brightness > 150) {
	            element.classList.add("lpc-share-light-mode");
	        } else {
	            element.classList.add("lpc-share-dark-mode");
	        }
	    });
	}, timeout);
    
    
    /*setTimeout(function () {

        const toRGBArray = rgbStr => rgbStr.match(/\d+/g).map(Number);

        document.querySelectorAll('.has_custom_bg').forEach(function (element) {
            let customBg = toRGBArray(window.getComputedStyle(element).backgroundColor);
            let textColor = Math.round((parseInt(customBg[0]) * 299 + parseInt(customBg[1]) * 587 + parseInt(customBg[2]) * 114) / 1000);

            if (textColor > 150) {
                element.style.color = '#000';
                element.querySelectorAll('[data-elem-type="text"]').forEach(function (textElement) {
                    textElement.style.color = '#000';
                });
                element.querySelectorAll('[data-elem-type="header"]').forEach(function (headerElement) {
                    headerElement.style.color = '#000';
                });
                element.querySelectorAll('[data-elem-type="generate"]').forEach(function (generateElement) {
                    generateElement.style.color = '#000';
                });
            } else {
                element.style.color = '#fff';
                element.querySelectorAll('[data-elem-type="text"]').forEach(function (textElement) {
                    textElement.style.color = '#fff';
                });
                element.querySelectorAll('[data-elem-type="header"]').forEach(function (headerElement) {
                    headerElement.style.color = '#fff';
                });
                element.querySelectorAll('[data-elem-type="generate"]').forEach(function (generateElement) {
                    generateElement.style.color = '#fff';
                });
            }
        });
        
        document.querySelectorAll('.ya-share2').forEach(function (element) {
            let customBgShare = toRGBArray(window.getComputedStyle(element).backgroundColor);
            let textColorShare = Math.round((parseInt(customBgShare[0]) * 299 + parseInt(customBgShare[1]) * 587 + parseInt(customBgShare[2]) * 114) / 1000);

            if (textColorShare > 150) {
                $('.ya-share2').addClass("lpc-share-light-mode");
            } else {
                $('.ya-share2').addClass("lpc-share-dark-mode");
            }
        });
    }, timeout);*/

    setTimeout(() => {
        const calculators = document.querySelectorAll('.lpc-calculator');

        if (calculators.length) {
            calculators.forEach(calculator => {
                const calc = new Calculator(calculator);
                calc.init();
            });
        }
    }, 500);
});

class Calculator {
	constructor(calculator) {
		this.calculator = calculator;
		this.calculateButton = this.calculator.querySelector('.calculate_button');
		this.calculateFormula = this.calculateButton.getAttribute('data-calculator-formula');
		this.calculateResult = this.calculator.querySelector('.js_calculate_result');
		this.calculateInputs = Array.from(this.calculator.querySelectorAll('input'));
		this.calculateErrorBlock = this.calculator.querySelector('.calculate-error-block');
	}

	parseCalculatorFormula(formula) {
		let variableRegex = '([a-zA-Z0-9]?[a-zA-Z]+)';
		let formulaVariables = Array.from(formula.matchAll(variableRegex));
		let parsedFormula = formula;
		for (const formulaVariable of formulaVariables) {
			let inputValue = this.calculator.querySelector(`input[data-calculator-alias=${formulaVariable[0]}]`).value;
			parsedFormula = parsedFormula.replace(formulaVariable[0], inputValue ? inputValue : NULL);
		}

		return eval(parsedFormula);
	}

	initializeRangeFields(fields) {
		fields.forEach((field) => {
			let input = field;
			let parent = input.parentNode;
			let min = parseFloat(input.min);
			let max = parseFloat(input.max);
			let current = parent.querySelector(".lpc-calculator-range--current");
			let currentLine = parent.querySelector(".lpc-calculator-range--current-line");

			const updateCurrentPosition = () => {
				let value = parseFloat(input.value);
				current.textContent = value;

				let currentWidth = current.getBoundingClientRect().width;
				let currentPos = (100 * (value - min) / (max - min));

				if (currentPos < 0) {
					currentPos = 0;
				} else if (currentPos > 100) {
					currentPos = 100;
				}

				current.style.left = `${(currentPos / 100) * (input.getBoundingClientRect().width - currentWidth)}px`;
				currentLine.style.width = `${currentPos}%`;
			};

			field.addEventListener("input", updateCurrentPosition);
			updateCurrentPosition();
		});
	}

	initializeNumberFields(fields) {
		fields.forEach((field) => {
			let input = field;
			let parent = input.parentNode;
			let min = input.min;
			let step = input.step;
			let max = input.max;
			let decrementButton = parent.querySelector(".lpc-calculator-number--dec");
			let incrementButton = parent.querySelector(".lpc-calculator-number--inc");
	
			input.addEventListener("change", () => {
				const value = Number(input.value);
				if (value >= max) {
					incrementButton.setAttribute("disabled", true);
					decrementButton.removeAttribute("disabled");
					input.value = max;
				} else if (value <= min) {
					input.value = min;
					incrementButton.removeAttribute("disabled");
					decrementButton.setAttribute("disabled", true);
				} else {
					incrementButton.removeAttribute("disabled");
					decrementButton.removeAttribute("disabled");
				}
			});
	
			decrementButton.addEventListener("click", () => {
				incrementButton.disabled = false
				let current = input.value
				let currentVal = current - step
	
				if (currentVal <= min) {
					input.textContent = min
					decrementButton.disabled = true
					return input.value = min
				}
	
				input.textContent = currentVal
				return input.value = currentVal
			});
	
			incrementButton.addEventListener("click", () => {
				decrementButton.disabled = false
				let current = input.value
				let currentVal = Number(current) + Number(step)
	
				if (Number(currentVal) >= Number(max)) {
					incrementButton.disabled = true
					input.textContent = max
					return input.value = max
				}
	
				input.textContent = currentVal
				return input.value = currentVal
			});
		})
	}


	initializeFieldTypes() {
		let rangeFields = this.calculateInputs.filter((item) => item.classList.contains('lpc-calculator-input--range'));
		let numberFields = this.calculateInputs.filter((item) => item.classList.contains('lpc-calculator-input--number'));

		this.initializeRangeFields(rangeFields);
		this.initializeNumberFields(numberFields);
	}
	
	init() {
	    this.initializeFieldTypes();
	    this.calculateButton.addEventListener('click', () => {
	        this.calculateErrorBlock.innerHTML = '';
	        try {
	            const result = this.parseCalculatorFormula(this.calculateFormula);
	            if (!isNaN(result) && isFinite(result)) {
	                this.calculateResult.querySelector('span').textContent = result.toFixed(2);
	                console.log(result);
	            } else {
	                this.calculateErrorBlock.innerHTML += '<p>Проверьте корректность введенных данных</p>';
	                this.calculateResult.querySelector('span').textContent = 0;
	            }
	        } catch (e) {
	            this.calculateErrorBlock.innerHTML += '<p>Проверьте корректность введенных данных</p>';
	            this.calculateResult.querySelector('span').textContent = 0;
	        }
	    });
	}
}





/*const lpcQueryString = window.location.search; // НЕ УДАЛЯТЬ - НГ оформление

if (lpcQueryString.includes('lpc_disable_snow')) {
	
	createCookie('lpc_disable_snow', 1, 30);
}

function letItSnow() { 
	  var COUNT = 30;
	  var masthead = document.querySelector('.sky');
	  var canvas = document.createElement('canvas');
	  var ctx = canvas.getContext('2d');
	  var width = masthead.clientWidth;
	  var height = masthead.clientHeight;
	  var i = 0;
	  var active = false;
	
	  function onResize() {
	    width = masthead.clientWidth;
	    height = masthead.clientHeight;
	    canvas.width = width;
	    canvas.height = height;
	    ctx.fillStyle = '#FFF';
	
	    var wasActive = active;
	    active = width > 600;
	
	    if (!wasActive && active)
	      requestAnimFrame(update);
	  }
	
	  var Snowflake = function () {
	    this.x = 0;
	    this.y = 0;
	    this.vy = 0;
	    this.vx = 0;
	    this.r = 0;
	
	    this.reset();
	  }
	
	  Snowflake.prototype.reset = function() {
	    this.x = Math.random() * width;
	    this.y = Math.random() * -height;
	    this.vy = 1 + Math.random() * 3;
	    this.vx = 0.5 - Math.random();
	    this.r = 1 + Math.random() * 2;
	    this.o = 0.5 + Math.random() * 0.5;
	  }
	
	  canvas.style.position = 'absolute';
	  canvas.style.left = canvas.style.top = '0';
	
	  var snowflakes = [], snowflake;
	  for (i = 0; i < COUNT; i++) {
	    snowflake = new Snowflake();
	    snowflake.reset();
	    snowflakes.push(snowflake);
	  }
	
	  function update() {
	
	    ctx.clearRect(0, 0, width, height);
	
	    if (!active)
	      return;
	
	    for (i = 0; i < COUNT; i++) {
	      snowflake = snowflakes[i];
	      snowflake.y += snowflake.vy;
	      snowflake.x += snowflake.vx;
	
	      ctx.globalAlpha = snowflake.o;
	      ctx.beginPath();
	      ctx.arc(snowflake.x, snowflake.y, snowflake.r, 0, Math.PI * 2, false);
	      ctx.closePath();
	      ctx.fill();
	
	      if (snowflake.y > height) {
	        snowflake.reset();
	      }
	    }
	
	    requestAnimFrame(update);
	  }
	
	  // shim layer with setTimeout fallback
	  window.requestAnimFrame = (function(){
	    return  window.requestAnimationFrame       ||
	            window.webkitRequestAnimationFrame ||
	            window.mozRequestAnimationFrame    ||
	            function( callback ){
	              window.setTimeout(callback, 1000 / 60);
	            };
	  })();
	
	  onResize();
	  window.addEventListener('resize', onResize, false);
	
	  masthead.appendChild(canvas);
};*/
