$urls = @(
    '/unity-game/Build/lastzoneweb.loader.js',
    '/unity-game/Build/lastzoneweb.framework.js',
    '/unity-game/Build/lastzoneweb.wasm',
    '/unity-game/Build/lastzoneweb.data'
)

$results = foreach ($u in $urls) {
    $res = Invoke-WebRequest -Uri ("http://localhost" + $u) -Method Head
    [PSCustomObject]@{
        Asset = ($u -split '/')[-1]
        StatusCode = $res.StatusCode
        ContentType = $res.Headers['Content-Type']
        Bytes = $res.Headers['Content-Length']
        CacheControl = $res.Headers['Cache-Control']
    }
}

$results | Format-Table -AutoSize
