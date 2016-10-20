(function (window) {
        var op;
        var UploadImg = function (options) {
            var _options = {
                fileInput: null,				//html file�ؼ�
                dragDrop: null,					//��ק��������
                upButton: null,					//�ύ��ť
                url: "",						//ajax��ַ
                fileFilter: [],					//���˺���ļ�����
                filter: function(files) {		//ѡ���ļ���Ĺ��˷���
                    return files;
                },
                onSelect: function() {},		//�ļ�ѡ���
                onDelete: function() {},		//�ļ�ɾ����
                onDragOver: function() {},		//�ļ���ק����������ʱ
                onDragLeave: function() {},	//�ļ��뿪����������ʱ
                onProgress: function() {},		//�ļ��ϴ�����
                onSuccess: function() {},		//�ļ��ϴ��ɹ�ʱ
                onFailure: function() {},		//�ļ��ϴ�ʧ��ʱ,
                onComplete: function() {},		//�ļ�ȫ���ϴ����ʱ
            };
            for ( var key in _options){
                if(!options[key]){
                    options[key] = _options[key];
                }
            }
            op = options;
            return new UploadImg.prototype.init(options);
        };
        UploadImg.prototype.init = function (options) {
            var _self = this;
            //��ק��ʵ��
            if(options.dragDrop){
                options.dragDrop.addEventListener("dragover",function (e) {
                    _self.funDragHover(e);
                },false);
                options.dragDrop.addEventListener("dragleave",function (e) {
                    _self.funDragHover(e);
                },false);
                options.dragDrop.addEventListener("drop",function (e) {
                    _self.funGetFiles(e);
                },false)
            };
            //�����ļ�input�ϴ�
            if(options.fileInput){
                options.fileInput.addEventListener("change",function (e) {_self.funGetFiles(e);},false);
            }
            //�ϴ��ύ
            if(options.upButton) {
                options.upButton.addEventListener("click", function (e) {_self.funUploadFile(e);},false)
            }


        };
        //�ļ��Ϸ�
        UploadImg.prototype.funDragHover = function(e) {
            e.stopPropagation();
            e.preventDefault();
            op[e.type === "dragover"? "onDragOver": "onDragLeave"].call(e.target);
            return this;
        };
        //��ȡѡ���ļ���file�ؼ����Ϸ�
        UploadImg.prototype.funGetFiles = function(e) {
            // ȡ����꾭����ʽ
            this.funDragHover(e);

            // ��ȡ�ļ��б����
            var files = e.target.files || e.dataTransfer.files;
            //��������ļ�
            op.fileFilter = op.fileFilter.concat(op.filter(files));
            this.funDealFiles();;
            return this;
        };

        //ѡ���ļ��Ĵ�����ص�
        UploadImg.prototype.funDealFiles = function() {
            for (var i = 0, file; file = op.fileFilter[i]; i++) {
                //����Ψһ����ֵ
                file.index = i;
            }
            //ִ��ѡ��ص�
            op.onSelect(op.fileFilter);
            return this;
        };

        //ɾ����Ӧ���ļ�
        UploadImg.prototype.funDeleteFile = function(fileDelete) {
            var arrFile = [];
            for (var i = 0, file; file = op.fileFilter[i]; i++) {
                if (file != fileDelete) {
                    arrFile.push(file);
                } else {
                    op.onDelete(fileDelete);
                }
            }
            op.fileFilter = arrFile;
            return this;
        };

        //�ļ��ϴ�
        UploadImg.prototype.funUploadFile =  function() {
            var self = this;
            if (location.host.indexOf("sitepointstatic") >= 0) {
                //��վ�������������
                return;
            }
            for (var i = 0, file; file = this.fileFilter[i]; i++) {
                (function(file) {
                    var xhr = new XMLHttpRequest();
                    if (xhr.upload) {
                        // �ϴ���
                        xhr.upload.addEventListener("progress", function(e) {
                            self.onProgress(file, e.loaded, e.total);
                        }, false);

                        // �ļ��ϴ��ɹ�����ʧ��
                        xhr.onreadystatechange = function(e) {
                            if (xhr.readyState == 4) {
                                if (xhr.status == 200) {
                                    self.onSuccess(file, xhr.responseText);
                                    self.funDeleteFile(file);
                                    if (!self.fileFilter.length) {
                                        //ȫ�����
                                        self.onComplete();
                                    }
                                } else {
                                    self.onFailure(file, xhr.responseText);
                                }
                            }
                        };

                        // ��ʼ�ϴ�
                        xhr.open("POST", self.url, true);
                        xhr.setRequestHeader("X_FILENAME", encodeURIComponent(file.name));
                        xhr.send(file);
                    }
                })(file);
            }

        };
        UploadImg.prototype.init.prototype = UploadImg.prototype;
        window.UploadImg = UploadImg;

    })(window, undefined)