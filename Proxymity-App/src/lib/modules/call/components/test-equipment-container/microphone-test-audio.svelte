<script lang="ts">
   import WaveSurfer from 'wavesurfer.js';
   import RecordPlugin from 'wavesurfer.js/dist/plugins/record.esm.js';

   let waveSurfer: WaveSurfer;
   let record: RecordPlugin;
   let container: HTMLDivElement;

   let canvasElement: HTMLCanvasElement;

   let microphones = $state<MediaDeviceInfo[]>([]);
   let selectedMicrophone = $state<MediaDeviceInfo | null>(null);

   let progress = $state('00:00');

   function createWaveSurfer() {
      // Create an instance of WaveSurfer
      if (waveSurfer) {
         waveSurfer.destroy();
      }

      const ctx = canvasElement.getContext('2d');

      if (!ctx) return;

      const gradient = ctx.createLinearGradient(0, 0, 0, canvasElement.height * 1.35);
      gradient.addColorStop(0, '#656666'); // Top color
      gradient.addColorStop((canvasElement.height * 0.7) / canvasElement.height, '#656666'); // Top color
      gradient.addColorStop((canvasElement.height * 0.7 + 1) / canvasElement.height, '#ffffff'); // White line
      gradient.addColorStop((canvasElement.height * 0.7 + 2) / canvasElement.height, '#ffffff'); // White line
      gradient.addColorStop((canvasElement.height * 0.7 + 3) / canvasElement.height, '#B1B1B1'); // Bottom color
      gradient.addColorStop(1, '#B1B1B1'); // Bottom color

      // Define the progress gradient
      const progressGradient = ctx.createLinearGradient(0, 0, 0, canvasElement.height * 1.35);
      progressGradient.addColorStop(0, '#EE772F'); // Top color
      progressGradient.addColorStop((canvasElement.height * 0.7) / canvasElement.height, '#EB4926'); // Top color
      progressGradient.addColorStop((canvasElement.height * 0.7 + 1) / canvasElement.height, '#ffffff'); // White line
      progressGradient.addColorStop((canvasElement.height * 0.7 + 2) / canvasElement.height, '#ffffff'); // White line
      progressGradient.addColorStop((canvasElement.height * 0.7 + 3) / canvasElement.height, '#F6B094'); // Bottom color
      progressGradient.addColorStop(1, '#F6B094'); // Bottom color

      waveSurfer = WaveSurfer.create({
         container: '#mic',
         waveColor: gradient,
         progressColor: progressGradient,
         barWidth: 2,
         autoplay: true,
         autoScroll: true,
      });

      waveSurfer.play();

      record = waveSurfer.registerPlugin(RecordPlugin.create({ scrollingWaveform: true, renderRecordedAudio: true }));

      record.on('record-end', blob => {
         const recordedUrl = URL.createObjectURL(blob);

         // Create wavesurfer from the recorded audio
         const wavesurfer = WaveSurfer.create({
            container,
            waveColor: 'rgb(200, 100, 0)',
            progressColor: 'rgb(100, 50, 0)',
            url: recordedUrl,
            autoplay: true,
         });

         // Play button
         const button = container.appendChild(document.createElement('button'));
         button.textContent = 'Play';
         button.onclick = () => wavesurfer.playPause();
         wavesurfer.on('pause', () => (button.textContent = 'Play'));
         wavesurfer.on('play', () => (button.textContent = 'Pause'));

         // Download link
         const link = container.appendChild(document.createElement('a'));
         Object.assign(link, {
            href: recordedUrl,
            download: 'recording.' + blob.type.split(';')[0].split('/')[1] || 'webm',
            textContent: 'Download recording',
         });
      });

      record.on('record-progress', updateProgress);
   }

   function updateProgress(time: number) {
      const formattedTime = [
         Math.floor((time % 3600000) / 60000), // minutes
         Math.floor((time % 60000) / 1000), // seconds
      ]
         .map(v => (v < 10 ? '0' + v : v))
         .join(':');

      progress = formattedTime;
   }

   function handlePause() {
      if (record.isPaused()) {
         record.resumeRecording();
      } else {
         record.pauseRecording();
      }
   }

   function handleRecord() {
      if (record.isRecording() || record.isPaused()) {
         record.stopRecording();
         return;
      }

      // get selected device
      const deviceId = selectedMicrophone?.deviceId;
      record.startRecording({ deviceId }).then(() => {
         console.log('Começou a gravar', deviceId);
      });
   }

   $effect(() => {
      RecordPlugin.getAvailableAudioDevices().then(devices => {
         microphones = devices;
         selectedMicrophone = devices[0] || null;
      });
   });

   $effect(createWaveSurfer);
</script>

<button id="record" type="button" onclick={handleRecord}>Record</button>
<button id="pause" type="button" onclick={handlePause}>Pause</button>

<select id="mic-select">
   {#each microphones as microphone}
      <option value={microphone}>{microphone.label}</option>
   {/each}
</select>

<p id="progress">00:00</p>

<div id="mic" style="border: 1px solid #ddd; border-radius: 4px; margin-top: 1rem"></div>
<div id="recordings" style="margin: 1rem 0" bind:this={container}></div>

<canvas bind:this={canvasElement}></canvas>

<style>
   button {
      min-width: 5rem;
      margin: 1rem 1rem 1rem 0;
   }
</style>
