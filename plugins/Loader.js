//�ο���������Ƶ�˼·����л
(function () {
        var decimal,
                duration,
                lastValue = 0,
                onComplete,
                loadings = [],
                barID,valueID;
        var Loader = function (options) {
            this.playing = false;
          return new Loader.prototype.init(options)
        };
        Loader.prototype = {
            constructor : Loader,
            init : function (options) {
                var _options = {
                    'decimal' : 2,
                    'duration' : 1500
                };
                for(var key in options){
                    _options[key] = options[key];
                }
                //��֤����
                if(!_options.bar || !_options.value ){
                    return ;
                }
                //С�������ı�����λС��
                decimal = _options.decimal;
                //�����������������
                duration = _options.duration;
                onComplete = _options.onComplete;
                barID = _options.bar;
                valueID = _options.value;
            },
            setValue : function (val) {
                val = parseFloat(val,10);
                if(isNaN(val)){
                    return;
                }
                val = val * 100;
                function _setState(val) {
                    var percent = val.toFixed(decimal) + '%';
                    barID.style.width = percent;
                    valueID.innerHTML = percent;
                }
                this.queuePush(
                        this.Loading((val - lastValue) * duration / 100 , _setState, [lastValue, val])
                );
                lastValue = val;
                if(!this.playing){
                    this.queueFlush();
                }
                if(val >= 100){
                    onComplete();
                }

            },
            queuePush : function (loading) {
                loadings.push(loading);
            },
            Loading : function (duration, progress, interval) {
                return {
                    start: function (finished) {
                        //finished�ǵ�ǰ����ִ�����ʱ�Ļص�
                        var startTime = Date.now();
                        function step() {
                            var endTime = Date.now();
                            var p = (endTime - startTime) / duration;

                            if (p > 1) {
                                p = 1;
                            }
                            //���㵱ǰ�ļ��ؽ��ȣ���֪ͨ�ⲿ���н������ٷֱȵĸ���
                            progress(interval[0] + (interval[1] - interval[0]) * p);
                            p < 1 ? requestAnimationFrame(step) : finished();
                        }
                        requestAnimationFrame(step);
                    }
                }
            },
            queueFlush : function () {
                if (this.isEmpty()) return;
                var self = this;
                function play() {
                    //�����Ƿ���ִ��״̬
                    self.playing = true;
                    //�Ӷ���ȡ��һ������ʼִ��
                    loadings.shift().start(function () {
                        if (self.isEmpty()) {
                            //����ִ�����
                            self.playing = false;
                            //�����ⲿ���������еĻص�
                            self.onComplete && self.onComplete();
                            return;
                        }
                        //ִ�ж����е���һ������
                        play();
                    });
                }
                //ִ�ж��е�ǰ�ĵ�һ������
                play();
            },
            isEmpty: function () {
                return !loadings.length;
            }
            
        
        };
        Loader.prototype.init.prototype = Loader.prototype;
        window.Loader = Loader;
    })(window, undefined)
