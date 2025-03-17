FFMPEG The Basics:

-i ${newCacheFilePath}  # Input file  
-vn                     # Remove video (only keep audio)  
-c:a libmp3lame         # Set audio codec to MP3 (LAME encoder)  
-qscale:a 2             # Set audio quality (lower is better, 2 ≈ ~190kbps)  
${downloadDir} # Output file path

### 🎵 Audio Processing Commands

# 1️⃣ Extract audio from video (MP3)

-i input.mp4 -vn -acodec libmp3lame -q:a 2 output.mp3

# 2️⃣ Convert audio to AAC (Better for mobile)

-i input.mp3 -vn -c:a aac -b:a 128k output.aac

# 3️⃣ Trim audio (first 30s only)

-i input.mp3 -ss 00:00:00 -t 30 -c copy output.mp3

# 4️⃣ Change audio speed (faster/slower)

-i input.mp3 -filter:a "atempo=1.5" -vn output.mp3

# 5️⃣ Increase audio volume (boost 2x)

-i input.mp3 -filter:a "volume=2.0" -c:a libmp3lame output.mp3

# 6️⃣ Convert audio to WAV (lossless)

-i input.mp3 -vn -c:a pcm_s16le output.wav

# 7️⃣ Merge multiple audio files into one

-i "concat:file1.mp3|file2.mp3" -c copy output.mp3

# 8️⃣ Remove background noise (low-pass filter)

-i input.mp3 -af "lowpass=3000" output.mp3

# 9️⃣ Convert stereo to mono

-i input.mp3 -ac 1 output.mp3

# 🔟 Normalize audio volume (fix loudness issues)

-i input.mp3 -af "loudnorm" output.mp3

### 🎥 Video Processing Commands

# 1️⃣ Compress video (reduce file size)

-i input.mp4 -vcodec libx264 -crf 28 -preset fast -c:a aac -b:a 128k output.mp4

# 2️⃣ Convert video format (MP4 to WebM)

-i input.mp4 -c:v libvpx -b:v 1M -c:a libvorbis output.webm

# 3️⃣ Extract audio from video (MP3 output)

-i input.mp4 -vn -acodec libmp3lame -q:a 2 output.mp3

# 4️⃣ Trim video (first 30 seconds only)

-i input.mp4 -ss 00:00:00 -t 30 -c copy output.mp4

# 5️⃣ Change video resolution (resize to 720p)

-i input.mp4 -vf scale=1280:720 -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 128k output.mp4

# 6️⃣ Speed up or slow down video

-i input.mp4 -filter:v "setpts=0.5\*PTS" -filter:a "atempo=2.0" output.mp4

# 7️⃣ Extract a frame from video (screenshot at 10s)

-i input.mp4 -ss 00:00:10 -vframes 1 -q:v 2 output.jpg

# 8️⃣ Add a watermark to video

-i input.mp4 -i watermark.png -filter_complex "overlay=10:10" output.mp4

# 9️⃣ Rotate video (90° clockwise)

-i input.mp4 -vf "transpose=1" output.mp4

# 🔟 Merge two videos together

-i video1.mp4 -i video2.mp4 -filter_complex "[0:v:0][1:v:0]concat=n=2:v=1[outv]" -map "[outv]" output.mp4
