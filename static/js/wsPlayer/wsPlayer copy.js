"use strict";

function wsPlayer(videoId, wsUrl) {
    this.videoId = videoId;
    this.wsUrl = wsUrl;
    this.ws = null;
    this.videoSrc = "";
    this.frameQueue = [];
    this.recordArr = []; // 录像ArrarBuffer
    this.isRecord = false; // 是否正在录像中
    this.fristBuffer = null;
}

// 开始录像
wsPlayer.prototype.startRecord = function () {
    console.info("开始录像");

    this.isRecord = true;
    this.recordArr.push(this.fristBuffer);

    // const blobUrl = window.URL.createObjectURL(new Blob(new Uint8Array(this.recordArr)), {'type': 'application/octet-stream'});
}

// 结束录像
wsPlayer.prototype.endRecord = function () {
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
    link.setAttribute("download", "test.mp4");

    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);

    this.recordArr = [];
}

wsPlayer.prototype.open = function () {
  debugger
    let sourcebuffer = null;

    this.isRecord = false;
    this.recordArr = [];

    // this.startRecord();

    this.ws = new WebSocket(this.wsUrl);
    this.ws.binaryType = 'arraybuffer';
    let firstMessage = true;

    let messageIndex = 0;

    let demux_moov = function (info) {
        let codecs = [];
        for (let i = 0; i < info.tracks.length; i++) {
            codecs.push(info.tracks[i].codec);
        }
        console.log(codecs);
        let video = document.getElementById(this.videoId);
        console.info("video", video)
        let mediasource = new MediaSource();
        video.src = URL.createObjectURL(mediasource);
        this.videoSrc = video.src;

        let pre_pos = 0;
        mediasource.onsourceopen = function() {
            sourcebuffer = mediasource.addSourceBuffer('video/mp4; codecs="' + codecs.join(', ') + '"');
            sourcebuffer.onupdateend = function() {
                let pos = video.currentTime;
                //console.log("video.buffered.length=" + video.buffered.length);
                if(video.buffered.length > 0) {
                    let start = video.buffered.start(video.buffered.length - 1);
                    let end = video.buffered.end(video.buffered.length - 1);
                    //console.log("pos=" + pos + ",start=" + start + ",end=" + end);

                    //当前播放时刻小于于buffered的开始时间
                    if (pos < start) {
                        //console.log("set video.currentTime pos=" + pos + ",start=" + start + ",end=" + end);
                        video.currentTime = start;
                    }

                    //当前播放时刻大于buffered的结束时间
                    if(pos > end) {
                        //console.warn("chase frame pos=" + pos + ",start=" + start + ",end=" + end);
                        video.currentTime = start;
                    }

                    //浏览器重新聚集时，追帧
                    if (pos - pre_pos != 0 && end - pos > 3) {
                        //console.log("set end video.currentTime pos=" + pos + ",start=" + start + ",end=" + end);
                        video.currentTime = end;
                    }

                    //删除前面的片段，永远只保留最后一个片段
                    for (let i = 0; i < video.buffered.length - 1; i++) {
                        let prestart = video.buffered.start(i);
                        let preend = video.buffered.end(i);
                        if(!sourcebuffer.updating) {
                            sourcebuffer.remove(prestart, preend);
                        }
                    }

                    //清理已经播放的视频片段
                    if(pos - start > 10 && !sourcebuffer.updating) {
                        //console.warn("remove start pos=" + pos + ",start=" + start + ",end=" + end);
                        sourcebuffer.remove(0, pos - 3);
                    }

                    //浏览器页面未聚焦时，清理收到的视频
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

        messageIndex++;

        // if (messageIndex > 1 && messageIndex < 3) {
        //     this.fristBuffer = e.data;
        //     this.recordArr.push(this.fristBuffer);
        // }

        if(firstMessage) {
            firstMessage = false;
            let moov = e.data;
            let mp4Box = new MP4Box;
            mp4Box.onReady = demux_moov;
            moov.fileStart = 0;
            console.info("moov", moov)
            mp4Box.appendBuffer(moov);
            this.fristBuffer = moov;
            this.recordArr.push(this.fristBuffer);
        }

        if (this.isRecord) {
            this.recordArr.push(e.data);
        }

        this.frameQueue.push(e.data);
        if (!sourcebuffer || sourcebuffer.updating) {
            console.info("return 了");
            return;
        }
        sourcebuffer.appendBuffer(this.frameQueue.shift());

    }.bind(this);
}

wsPlayer.prototype.close = function () {
    this.ws && this.ws.close();
}
