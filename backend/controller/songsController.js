// get all songs, a specific song, my songs, upload, update, delete
// ページネーション（曲数が多くなったときの負荷対策）：.skip() + .limit() を使えば、無限スクロールやページ切り替え対応も簡単にできる
//  無限スクロールにしたい場合は？
//ページ番号を state に持たせて、IntersectionObserver で一番下まで来たときに page++ していけばOK。

const Song = require('../model/Song')
const asyncHandler = require('express-async-handler')
const deleteUploadedFiles = require('../utils/deleteUploadedFiles')
const fs = require('fs')
const User = require('../model/User')

// create new song
const uploadSong = asyncHandler(async (req, res) => {
    const { title, genre, lyrics, highlightStart, highlightEnd, hidden, original } = req.body
    const user = req._id // JWTでログイン済みのuser id
    if (
        !title || 
        !genre || 
        !req?.files || 
        hidden === undefined ||
        original === undefined ||
        !req?.files?.audioFile || 
        !req?.files?.imageFile
    ) {
        deleteUploadedFiles(req.files)
        return res.status(400).json({ message: 'All fields are required!'})
    }

    let highlight = undefined
    if (highlightStart && highlightEnd) {
        const start = Number(highlightStart)
        const end = Number(highlightEnd)

        if (isNaN(start) || isNaN(end) || start < 0 || end <= start) {
            return res.status(400).json({ message: 'Invalid highlight time range'})
        }

        highlight = { start, end }
    }

    const audioFile = req.files.audioFile[0].path
    const imageFile = req.files.imageFile[0].path

    const uploadedSong = await Song.create({
        'title': title,
        'genre': genre,
        'lyrics': lyrics,
        'user': user,
        'audioFile': audioFile,
        'imageFile': imageFile,
        'hidden': hidden,
        'original': original,
        'highlight': highlight // highlightは任意なのでundefinedでもOK
    })

    res.status(201).json(uploadedSong.title)
})

// get all songs
const getAllSongs = asyncHandler(async (req, res) => {
    console.log('Get songs Start')
    const currentUser = req._id
    const songs = await Song.find()
                        .populate('user', 'username icon')
                        .lean()
    if (!songs) return res.status(400).json({ message: 'No songs found'})

    const filteredSongs = songs.filter(song => {
        // song.user は populate されてるので、_id を取得する
        const isOwnSong = song.user._id.toString() === currentUser
        return isOwnSong || !song.hidden
    })

    res.json(filteredSongs)
})

// get one specific song
const getOneSong = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) return res.status(400).json({ message: 'Song ID is required!'})

    const song = await Song.findById(id)
        .populate('user', 'username icon')
        .lean()
    if (!song) return res.status(404).json({ message: `No song found with ID: ${id}`})

    res.json(song)
})

// get my songs
const getMySongs = asyncHandler(async (req, res) => {
    const userId = req._id
    if (!userId) return res.status(400).json({ message: 'UserID not found in token'})

    const songs = await Song.find({ user: userId}).lean().exec()
    res.json(songs)
})

// update song
const updateSong = asyncHandler(async (req, res) => {
    console.log('updateSong Start')
    const { id } = req.params
    const { title, genre, lyrics, highlightStart, highlightEnd } = req.body
    if (!id) return res.status(404).json({ message: 'Song ID is required!'})

    const song = await Song.findById(id).exec()
    if (!song) return res.status(404).json({ message: `No song found by ID: ${id}`})

    const loggedInUserId = req._id
    if (song.user.toString() !== loggedInUserId) {
        return res.status(403).json({ message: 'Not authorized to update this song'})
    }

    if (title) song.title = title
    if (genre) song.genre = genre
    if (lyrics !== undefined) song.lyrics = lyrics
    // 新しいファイルがある場合 → 古いファイル削除
    if (req.files?.audioFile && song.audioFile) {
        fs.unlink(song.audioFile, (err) => {
            if (err) console.warn('Failed to delete the old audio:', err.message)
        })
        song.audioFile = req.files.audioFile[0].path
    }

    if (req.files?.imageFile && song.imageFile) {
        fs.unlink(song.imageFile, (err) => {
            if (err) console.warn('Failed to delete the old image:', err.message)
        })
        song.imageFile = req.files.imageFile[0].path
    }

    if (req.body?.hidden !== undefined) {
        song.hidden = req.body.hidden
    }

    if (req.body?.original !== undefined) {
        song.original = req.body.original
    }      

    if (highlightStart) {
        song.highlight.start = highlightStart
    }

    if (highlightEnd) {
        song.highlight.end = highlightEnd
    }

    const updatedSong = await song.save()
    res.json({ message: 'Song updated', song: updatedSong });
})

// delete song
const deleteSong = asyncHandler(async (req, res) => {
    console.log('DeleteDong start')
    const { id } = req.params
    if (!id) return res.status(400).json({ message: 'Song ID is required!' })

    const song = await Song.findById(id).exec()
    if (!song) return res.status(404).json({ message: `NO song found by ID: ${id}`})

    const loggedInUserId = req._id
    if (song.user.toString() !== loggedInUserId || req.isAdmin) {
        return res.status(403).json({ message: 'Not authorized to update this song'})
    }

    await song.deleteOne()

    const filesToDelete = {
        audioFile: song.audioFile ? [{ path: song.audioFile }] : [],
        imageFile: song.imageFile ? [{ path: song.imageFile }] : []
    }
    deleteUploadedFiles(filesToDelete)

    res.json({ message: `Song '${song.title}' (ID: ${id}) has been deleted.` })
})

// Like songs
const toogleLike = asyncHandler(async (req, res) => {
    console.log('toggleLike Start')
    const song = await Song.findById(req.params.id)
    if (!song) return res.status(404).json({ message: 'The song is not found'})

    const userId = req._id
    if (!userId) return res.status(404).json({ message: 'userId is not found'})

    const index = song.likes.indexOf(userId)
    if (index > -1) {
        // already liked -> unlike
        song.likes.splice(index, 1)
    } else {
        // not liked yet -> like
        song.likes.push(userId)
    }

    await song.save()

    res.json({ message: 'Like toggled', likes: song.likes.length})
})

const getLikedSongs = asyncHandler(async (req, res) => {
    const userId = req._id
    if (!userId) return res.status(404).json({ message: 'userId is not found'})

    const likedSongs = await Song.find({ likes: userId, hidden: false })
                                 .populate('user', 'username') // including user
                                 .lean()

    res.json(likedSongs)
})

// search songs 現状はartistとsong titleのみ柔軟検索
const searchSongs = asyncHandler(async (req, res) => {
    console.log('Search songs process START')
    console.log('req.query: ', req.query)
    const { title, genre, artist} = req.query

    let query = {}

    if (title) {
        query.title = { $regex: title, $options: 'i'}
    }

    if (genre) {
        query.genre = { $regex: genre, $options: 'i'}
    }

    if (artist) {
        const artistUsers = await User.find({ username: { $regex: artist, $options: 'i'}, hidden: false }).lean()
        if (artistUsers.length > 0) {
            const artistIds = artistUsers.map(user => user._id)
            query.user = { $in: artistIds }
        } else {
            return res.status(404).json({ message: 'Artist not found' })
        }
    }

    const songs = await Song.find(query).populate('user', 'username').lean()
    res.json(songs)
})

// playSong
const playSong = asyncHandler(async (req, res) => {
    console.log('Play Song process Start')
    const { id } = req.params // songId
    const userId = req._id
    if (!id) return res.status(404).json({ message: 'No song ID found from params'})
    if (!userId) return res.status(404).json({ message: 'No userId found from cookie'})
    console.log('songId: ', id)
    console.log('userId: ', userId)

    const ONE_HOUR = 60 * 60 * 1000 // 1 hour
    const now = Date.now()

    const song = await Song.findById(id)
    if (!song) return res.status(404).json({ message: 'No song found'})
    console.log('song: ', song)

    const recentPlay = song.plays.find(p => {
        console.log(now, p.timestamp, now - new Date(p.timestamp).getTime())
        console.log('song.plays:', song.plays.map(p => p))
        return (
            String(p.user) === String(userId) && now - new Date(p.timestamp).getTime() < ONE_HOUR
        )
    })
    console.log('recentPlay: ',recentPlay)

    if (!recentPlay) {
            song.plays.push({ user: userId }) //timestampは自動で入る
            await song.save()
            return res.status(200).json({ message: 'Play recorded'})
        
    } else {
        return res.json({ message: 'playSong already counted'})
    }

})


// あなたへのおすすめ
const getRecommendations = asyncHandler(async (req, res) => {
    const { id } = req.params
    if (!id) return res.status(404).json({ message: 'UserId is required'})

    const userHistorySongs = await Song.find({ 'plays.user': id, hidden: false }).lean()
    if (!userHistorySongs) return res.status(200).json([]) // empty array
    console.log(userHistorySongs)

    const genreCount = {}
    const artistCount = {}

    userHistorySongs.forEach(song => {
        genreCount[song.genre] = (genreCount[song.genre] || 0) + 1
        artistCount[song.user.toString()] = (artistCount[song.user.toString() || 0]) + 1
    })

    const [topGenre] = Object.entries(genreCount).sort((a, b) => b[-1] - a[-1])
    const [topArtist] = Object.entries(artistCount).sort((a, b) => b[-1] - a[-1])

    const recommendations = await Song.find({
        $and: [
            { user: { $ne: id}}, // 自分の曲は省く
            {
                $or: [
                    { genre: topGenre?.[0] },
                    { user: topArtist?.[0]}
                ]
            }
        ],
        hidden: false
    })
    .populate('user', 'username')
    .limit(10)
    .lean()

    res.json(recommendations)
})

// mining songs
const getHighlightedSongs = asyncHandler(async (req, res) => {
    console.log('Mining Start')
    const songs = await Song.find({
        highlight: { $exists: true},
        'highlight.start': { $ne: null},
        'highlight.end': { $ne: null },
        hidden: false
    })
        .select('-lyrics')
        .populate('user', 'username')
        .lean()

    res.json(songs)
})

const toggleAdminRecommendation = asyncHandler(async (req, res) => {
    console.log('toggleAdminRec Start')
    const { songId } = req.params // songRouteのルート内にあるidの書き方に合わせる。
    if (!songId) return res.status(404).json({ message: 'songId required'})

    const song = await Song.findById(songId)
    if (!song) return res.status(404).json({ message: 'No song found'})
    console.log(song.isRecommended)

    song.isRecommended = !song.isRecommended
    await song.save()

    res.json({ message: 'Updated recommendation status', isRecommended: song.isRecommended })
})

const getAdminRec = asyncHandler(async (req, res) => {
    console.log('getAdminRec Start')
    const songs = await Song.find({ isRecommended: true })
        .populate('user', 'username icon')

    res.json(songs)
})

module.exports = { 
    uploadSong,
    getAllSongs,
    getOneSong,
    getMySongs,
    updateSong,
    deleteSong,
    toogleLike,
    getLikedSongs,
    searchSongs,
    playSong,
    getRecommendations,
    getHighlightedSongs,
    toggleAdminRecommendation,
    getAdminRec
}