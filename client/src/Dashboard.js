import { useState,useEffect } from 'react'
import { Container, Form } from 'react-bootstrap'
import useAuth from './useAuth'
import SpotifyWebApi from 'spotify-web-api-node'

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

        spotifyApi.searchTracks(search).then(res => {
            res.body.tracks.items.map(track => {
                return {
                    artist: track.artists[0].name,
                    title: track.name, 
                    uri: track.uri,
                    albumUrl: track.albumUrl.images,

                }
            })
        })
    }, [search, accessToken])
    return (
        <div>
            <Container className="d-flex dlex-column py-2" style={{height: "100vh"}}>
                { code }
                <Form.Control type="search" placeholder="Search Songs/ Artists" value={search} onChange={e => e.target.value} />
                <div className="flex-grow-1 my-2" style={{ overFlow: "auto" }}></div>
            </Container>
        </div>
    )
}

