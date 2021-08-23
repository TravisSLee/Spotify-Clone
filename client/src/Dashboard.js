import { useState,useEffect } from 'react'
import { Container, Form } from 'react-bootstrap'
import useAuth from './useAuth'
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResult from './TrackSearchResult'

const spotifyApi = new SpotifyWebApi({
    clientId: "1c4cb0c2c13744d68e94385ebff0a485",


})

export default function Dahboard({ code }) {
    const accessToken = useAuth(code)
    const [search, setSearch] = useState("")
    const [search, setSearchResults] = useState([])

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])

    useEffect(() => {
        if (!search) return setSearchResults([])
        if (!accessToken) return
    
        let cancel = false
        spotifyApi.searchTracks(search).then(res => {
          if (cancel) return
          setSearchResults(
            res.body.tracks.items.map(track => {
              const smallestAlbumImage = track.album.images.reduce(
                (smallest, image) => {
                  if (image.height < smallest.height) return image
                  return smallest
                },
                track.album.images[0]
              )
    
              return {
                artist: track.artists[0].name,
                title: track.name,
                uri: track.uri,
                albumUrl: smallestAlbumImage.url,
              }
            })
          )
        })
    
        return () => (cancel = true)
      }, [search, accessToken])

    return (
        <div>
            <Container className="d-flex dlex-column py-2" style={{height: "100vh"}}>
                { code }
                <Form.Control type="search" placeholder="Search Songs/ Artists" value={search} onChange={e => e.target.value} />
                <div className="flex-grow-1 my-2" style={{ overFlow: "auto" }}>
                {searchResults.map(track => (
                    <TrackSearchResult
                        track={track}
                        key={track.uri}
                        chooseTrack={chooseTrack}
                    />
                    ))}
                </div>

                <div>
                    <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
                </div>
            </Container>
        </div>
    )
}

