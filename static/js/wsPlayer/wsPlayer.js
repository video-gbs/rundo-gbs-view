"use strict";

function wsPlayer(videoId, wsUrl, count = 0) {
    this.videoId = videoId;
    this.wsUrl = wsUrl;
    this.ws = null;
    this.frameQueue = [];
    this.recordArr = []; // 录像ArrarBuffer
    this.isRecord = false; // 是否正在录像中
    this.fristBuffer = null;
    this.timeout = null; // 获取最近一条视频流数据的时间戳
    this.interval = null; // 定时器
    this.openInterval = null; // open定时器
    this.reconnectNum = count; // 重连次数
    console.log("wsPlayer v1.0.1 20220423");
}

function getNowDate() {
    const toDay = new Date()
    const year = toDay.getFullYear() //年
    const month = toDay.getMonth() + 1 < 10 ? '0' + (toDay.getMonth() + 1) : toDay.getMonth() + 1 //月
    const data = toDay.getDate() < 10 ? '0' + toDay.getDate() : toDay.getDate() //日
    const hour = toDay.getHours() < 10 ? '0' + toDay.getHours() : toDay.getHours() //时
    const minute = toDay.getMinutes() < 10 ? '0' + toDay.getMinutes() : toDay.getMinutes() //分
    const second = toDay.getSeconds() < 10 ? '0' + toDay.getSeconds() : toDay.getSeconds() //秒
    // const today = year + '年' + month + '月' + data + '日' + hour + '时' + minute + '分' + second + '秒';
    const today = year + '-' + month + '-' + data + '_' + hour + ':' + minute + ':' + second;
    console.info("today", today);
    return today;
}

// 开始录像
wsPlayer.prototype.startRecord = function () {
    console.info("开始录像");

    this.isRecord = true;
    this.recordArr.push(this.fristBuffer);
    
    // const blobUrl = window.URL.createObjectURL(new Blob(new Uint8Array(this.recordArr)), {'type': 'application/octet-stream'});
}

// 结束录像
wsPlayer.prototype.endRecord = function (name = "") {
    console.info("结束录像");
    this.isRecord = false;

    if (!this.recordArr.length) {
        console.info("录像出错")
        return;
    }
    // this.recordArr.shift();
    const blobUrl = window.URL.createObjectURL(new Blob(this.recordArr));
    console.info("blobUrl", blobUrl);
    console.info("this.recordArr", this.recordArr);
    // 实现下载功能
    const link = document.createElement("a");
    document.body.appendChild(link);
    link.style.display = "none";
    link.href = blobUrl;
    link.setAttribute("download", `${name}_rec_${getNowDate()}.mp4`);

    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    this.recordArr = [];
}

wsPlayer.prototype.open = function () {
    console.info("open了");
    let sourcebuffer = null;
    this.ws = new WebSocket(this.wsUrl);
    this.ws.binaryType = 'arraybuffer';
    let firstMessage = true;

    this.openInterval && clearInterval(this.openInterval);
    this.openInterval = setInterval(() => {
        const currentTime = new Date().getTime();

        if (this.reconnectNum >= 10) {
            console.info("重连次数大于10，不再重连")
            this.ws && this.ws.close();
            this.openInterval && clearInterval(this.openInterval);
            return;
        }
        // console.info("currentTime - this.timeout", currentTime - this.timeout);
        if (currentTime - this.timeout > 10000) {
            this.reconnectNum++;
            console.info("open.超时重连", this.reconnectNum);
            // this.close();
            this.ws && this.ws.close();
            this.openInterval && clearInterval(this.openInterval);
            this.reLock = true;
            const player = new wsPlayer(this.videoId, this.wsUrl, this.reconnectNum);
            player.open();
        }
    }, 5000);
    
    let demux_moov = function (info) {
        let codecs = [];
        for (let i = 0; i < info.tracks.length; i++) {
            codecs.push(info.tracks[i].codec);
        }
        console.log(codecs);
        let video = document.getElementById(this.videoId);
        let mediasource = new MediaSource();
        video.src = URL.createObjectURL(mediasource);
        let pre_pos = 0;
        mediasource.onsourceopen = function() {
            sourcebuffer = mediasource.addSourceBuffer('video/mp4; codecs="' + codecs.join(', ') + '"');
            sourcebuffer.onupdateend = function() {
                let pos = video.currentTime;
                if(video.buffered.length > 0) {
                    let start = video.buffered.start(video.buffered.length - 1);
                    let end = video.buffered.end(video.buffered.length - 1);
                    //console.log("pos=" + pos + ",start=" + start + ",end=" + end);

                    if (pos < start) {
                        //console.log("set video.currentTime pos=" + pos + ",start=" + start + ",end=" + end);
                        video.currentTime = start;
                    }

                    if(pos > end) {
                        //console.warn("chase frame pos=" + pos + ",start=" + start + ",end=" + end);
                        video.currentTime = start;
                    }

                    if (pos - pre_pos != 0 && end - pos > 3) {
                        console.info(`延迟${end - pos}秒，将进行追帧`);
                        //console.log("set end video.currentTime pos=" + pos + ",start=" + start + ",end=" + end);
                        video.currentTime = end;
                    }

                    for (let i = 0; i < video.buffered.length - 1; i++) {
                        let prestart = video.buffered.start(i);
                        let preend = video.buffered.end(i);
                        if(!sourcebuffer.updating) {
                            sourcebuffer.remove(prestart, preend);
                        }
                    }

                    if(pos - start > 10 && !sourcebuffer.updating) {
                        //console.warn("remove start pos=" + pos + ",start=" + start + ",end=" + end);
                        sourcebuffer.remove(0, pos - 3);
                    }

                    if(end - pos > 10 && !sourcebuffer.updating) {
                        //console.warn("remove end pos=" + pos + ",start=" + start + ",end=" + end);
                        sourcebuffer.remove(0, end - 3);
                    }
                }
                pre_pos = pos;
            }
        }
    }.bind(this);

    this.ws.onmessage = function(e) {
        this.timeout = new Date().getTime();

        this.reconnectNum = 0; //当重连成功后，重连次数重置为0

        if(firstMessage) {
            // this.reLock = false;
            firstMessage = false;
            let moov = e.data;
            let mp4Box = new MP4Box;
            mp4Box.onReady = demux_moov;
            moov.fileStart = 0;
            mp4Box.appendBuffer(moov);
            this.fristBuffer = moov;
            this.recordArr.push(this.fristBuffer);
            
            this.openInterval && clearInterval(this.openInterval);
            this.interval && clearInterval(this.interval);
            this.interval = setInterval(() => {

                if (this.reconnectNum >= 10) {
                    console.info("重连次数大于10，不再重连")
                    this.ws && this.ws.close();
                    this.openInterval && clearInterval(this.openInterval);
                    return;
                }
                
                const currentTime = new Date().getTime();
                if (currentTime - this.timeout > 5000) {
                    this.reconnectNum++;
                    console.info("onmessage.超时重连", this.reconnectNum);
                    this.ws && this.ws.close();
                    this.interval && clearInterval(this.interval);
                    const player = new wsPlayer(this.videoId, this.wsUrl, );
                    player.open();
                }
            }, 5000);
        }

        if (this.isRecord) {
            this.recordArr.push(e.data);
        }

        this.frameQueue.push(e.data);
        if (!sourcebuffer || sourcebuffer.updating) {
            return;
        }

        if(this.frameQueue.length === 1) {
            sourcebuffer.appendBuffer(this.frameQueue.shift());
        } else {
            let byte_length = 0;
            for (const qnode of this.frameQueue) {
                byte_length += qnode.byteLength;
            }
            let mp4buf = new Uint8Array(byte_length);
            let offset = 0;
            for (const qnode of this.frameQueue) {
                let frame = new Uint8Array(qnode);
                mp4buf.set(frame, offset);
                offset += qnode.byteLength;
            }

            sourcebuffer.appendBuffer(mp4buf);
            this.frameQueue.splice(0, this.frameQueue.length);
        }
    }.bind(this);

    this.ws.onclose = function(params) {
        console.info("onclose");
    }.bind(this);

    this.ws.onerror = function(params) {
        console.info("ws.onerror", params);
    }.bind(this);
}

wsPlayer.prototype.close = function () {
    this.ws && this.ws.close();
    this.interval && clearInterval(this.interval);
}