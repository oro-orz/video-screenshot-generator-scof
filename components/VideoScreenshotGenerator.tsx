import { useState } from 'react'
import { Upload, Play, Download, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function VideoScreenshotGenerator() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [screenshots, setScreenshots] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    extension: string;
    size: string;
    duration: string;
    aspectRatio: string;
  } | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile)
      setError(null)

      // Set file info
      const extension = selectedFile.name.split('.').pop() || '';
      const size = (selectedFile.size / (1024 * 1024)).toFixed(2) + ' メガバイト';

      // Note: Getting duration and aspect ratio requires loading the video
      // This is a placeholder. In a real implementation, you'd need to load the video
      setFileInfo({
        name: selectedFile.name,
        extension: extension,
        size: size,
        duration: '読み込み中...',
        aspectRatio: '読み込み中...'
      });

      // Load video to get duration and aspect ratio
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        const duration = video.duration.toFixed(2) + ' 秒';
        const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
        const divisor = gcd(video.videoWidth, video.videoHeight);
        const aspectRatio = `${video.videoWidth / divisor}:${video.videoHeight / divisor}`;
        setFileInfo(prevInfo => ({
          ...prevInfo!,
          duration: duration,
          aspectRatio: aspectRatio
        }));
      };
      video.src = URL.createObjectURL(selectedFile);
    } else {
      setError('有効な動画ファイルを選択してください。')
      setFile(null)
      setFileInfo(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError(null)

    // Simulating file upload and processing
    try {
      await simulateFileUpload()
      setIsUploading(false)
      setIsProcessing(true)
      await simulateProcessing()
      setIsProcessing(false)
      // Simulating screenshot generation
      const generatedScreenshots = [
        '/placeholder.svg?height=180&width=320',
        '/placeholder.svg?height=180&width=320',
        '/placeholder.svg?height=180&width=320',
        '/placeholder.svg?height=180&width=320',
      ]
      setScreenshots(generatedScreenshots)
    } catch (err) {
      setError('アップロードまたは処理中にエラーが発生しました。')
      setIsUploading(false)
      setIsProcessing(false)
    }
  }

  const simulateFileUpload = () => {
    return new Promise<void>((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          resolve()
        }
      }, 500)
    })
  }

  const simulateProcessing = () => {
    return new Promise<void>((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += 20
        setProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          resolve()
        }
      }, 1000)
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">動画スクリーンショット生成ツール</h1>

      <div className="mb-6">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="hidden"
          id="video-upload"
        />
        <label
          htmlFor="video-upload"
          className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Upload className="mr-2" />
          動画を選択
        </label>
        {file && <span className="ml-4">{file.name}</span>}
        {fileInfo && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h3 className="text-lg font-semibold mb-2">ファイル情報</h3>
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="font-medium pr-4">ファイル名:</td>
                  <td>{fileInfo.name}</td>
                </tr>
                <tr>
                  <td className="font-medium pr-4">拡張子:</td>
                  <td>{fileInfo.extension}</td>
                </tr>
                <tr>
                  <td className="font-medium pr-4">サイズ:</td>
                  <td>{fileInfo.size}</td>
                </tr>
                <tr>
                  <td className="font-medium pr-4">長さ:</td>
                  <td>{fileInfo.duration}</td>
                </tr>
                <tr>
                  <td className="font-medium pr-4">アスペクト比:</td>
                  <td>{fileInfo.aspectRatio}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>エラー</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button onClick={handleUpload} disabled={!file || isUploading || isProcessing}>
        <Play className="mr-2" />
        {isUploading ? 'アップロード中...' : isProcessing ? '処理中...' : 'スクリーンショットを生成'}
      </Button>

      {(isUploading || isProcessing) && (
        <div className="mt-4">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">
            {isUploading ? '動画をアップロード中...' : '動画を処理中...'}
          </p>
        </div>
      )}

      {screenshots.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">生成されたスクリーンショット</h2>
          <div className="overflow-x-auto">
            <div className="flex space-x-4 pb-4" style={{ minWidth: 'max-content' }}>
              {screenshots.map((screenshot, index) => (
                <div key={index} className="relative group flex-shrink-0">
                  <img src={screenshot} alt={`Screenshot ${index + 1}`} className="h-40 w-auto rounded-lg" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-lg">
                    <Button variant="secondary" size="sm">
                      <Download className="mr-2" />
                      ダウンロード
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        .overflow-x-auto {
          scrollbar-width: thin;
          scrollbar-color: rgba(155, 155, 155, 0.5) transparent;
        }
        .overflow-x-auto::-webkit-scrollbar {
          height: 6px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background-color: rgba(155, 155, 155, 0.5);
          border-radius: 3px;
        }
      `}</style>
    </div>
  )
}