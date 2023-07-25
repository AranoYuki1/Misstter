import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { Container, Typography, AppBar, Toolbar, TextField, Link, FormControlLabel, Checkbox } from "@mui/material"

const Popup = () => {
  const [token, setToken] = useState<string | null>(null)
  const [server, setServer] = useState<string | null>("https://misskey.io")
  const [cw, setCw] = useState<boolean>(false)

  useEffect(() => {
    chrome.storage.sync.get(['misskey_token', 'misskey_server', 'misskey_cw'], (result) => {
      const token = result.misskey_token;
      const server = result.misskey_server;
      const cw = result.misskey_cw;

      if (token) { setToken(token) }
      if (server) { setServer(server) }
      if (cw) { setCw(cw) }
    })
  }, [])
  
  const updateToken = (token: string) => {
    chrome.storage.sync.set({ misskey_token: token }, () => {
      console.log('Token saved');
    });
    setToken(token)
  }
  const updateServer = (server: string) => {
    setServer(server)
    if (!server.startsWith('https://')) {
      server = 'https://' + server
    }
    chrome.storage.sync.set({ misskey_server: server }, () => {
      console.log('Server saved');
    });
  }
  const updateCw = (cw: boolean) => {
    setCw(cw)
    chrome.storage.sync.set({ misskey_cw: cw }, () => {
      console.log('CW saved');
    })
  }

  const donationPageUrl = "https://pielotopica.booth.pm/items/4955538";
  return (
    <>
      <AppBar position="static" sx={{ minWidth: 400 }}>
        <Toolbar variant="dense">
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Misstter</Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 2, mb: 2 }}>

        <Typography variant="body2" sx={{ mt: 2, mb: 2, fontSize: 10 }}>
          サーバーのURLを入力してください。デフォルトではmisskey.ioが設定されています。
        </Typography>

        <TextField  
          label="Server URL"
          placeholder="https://misskey.io"
          value={server}
          variant="outlined"
          fullWidth
          InputLabelProps={{ shrink: true }}
          size="small"
          sx={{ mb: 2 }}
          onChange={(e) => {
            updateServer(e.target.value)
          }}
        />

        <Typography variant="body2" sx={{ mt: 2, mb: 2, fontSize: 10 }}>
          Tokenはお使いのMisskeyサーバーの 「設定 &#62; API」の画面から取得できます。
          投稿権限とファイルアップロード権限が必要です。(全てを許可すると自動で設定されます)
        </Typography>

        <TextField  
          label="token"
          variant="outlined"
          placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
          fullWidth
          size="small"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 2 }}
          value={token}
          onChange={(e) => {
            updateToken(e.target.value)
          }}
        />

        <FormControlLabel 
          control={<Checkbox 
            checked={cw}
            onChange={(e) => {
              updateCw(e.target.checked)
            }}
          />}
          label={<Typography style={{ fontSize: 15 }}>Misskeyへの投稿にCWを設定する。</Typography>}          
        />

        <Link
          href={donationPageUrl}
          target="_blank"
          rel="noopener"
          underline="hover"
          sx={{ display: "block", mt: 2 }}
        > 開発の支援をお願いします！ / Donation </Link>

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
