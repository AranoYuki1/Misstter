import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { Container, Typography, AppBar, Toolbar, TextField, Link } from "@mui/material"

const Popup = () => {
  const [token, setToken] = useState<string | null>(null)
  const [server, setServer] = useState<string | null>("https://misskey.io")

  useEffect(() => {
    chrome.storage.sync.get(['misskey_token', 'misskey_server'], (result) => {
      const token = result.misskey_token;
      const server = result.misskey_server;
      if (token) { setToken(token) }
      if (server) { setServer(server) }
    })
  }, [])
  
  const updateToken = (token: string) => {
    chrome.storage.sync.set({ misskey_token: token }, () => {
      console.log('Token saved');
    });
    setToken(token)
  }

  const updateServer = (server: string) => {
    chrome.storage.sync.set({ misskey_server: server }, () => {
      console.log('Server saved');
    }
    );
    setServer(server)
  }

  return (
    <>
      <AppBar position="static" sx={{ minWidth: 400 }}>
        <Toolbar variant="dense">
          <Typography variant="h6" sx={{ flexGrow: 1 }}>X to Misskey</Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 2, mb: 2 }}>
        <TextField  
          label="token"
          variant="outlined"
          placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          value={token}
          onChange={(e) => {
            updateToken(e.target.value)
          }}
        />

        <TextField  
          label="Server URL"
          placeholder="https://misskey.io"
          value={server}
          variant="outlined"
          fullWidth
          size="small"
          sx={{ mb: 2 }}
          onChange={(e) => {
            updateServer(e.target.value)
          }}
        />

        {/* <FormControlLabel control={<Checkbox />} label="MisskeyボタンでTwitterにも投稿する。" /> */}
        {/* <FormControlLabel control={<Checkbox />} label="画像を投稿する。" /> */}

        <Typography variant="body2" sx={{ mt: 2, mb: 2 }}>
          内容を更新したらページをリロードしてください。
        </Typography>

        <Link
          href=""
          target="_blank"
          rel="noopener"
          underline="hover"
          sx={{ display: "block", mt: 2 }}
        > 開発のサポートをお願いします！ / Donation </Link>

      </Container>

    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
