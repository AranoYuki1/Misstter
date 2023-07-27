import React, { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import { Container, Typography, AppBar, Toolbar, TextField, FormControlLabel, Checkbox } from "@mui/material"
import { DEFAULT_INSTANCE_URL } from "../common/Constants";

const Popup = () => {
  const [token, setToken] = useState<string | null>(null)
  const [server, setServer] = useState<string | null>(DEFAULT_INSTANCE_URL);
  const [cw, setCw] = useState<boolean | null>(null)
  const [sensitive, setSensitive] = useState<boolean | null>(null)
  const [showAccess, setShowAccess] = useState<boolean|null>(null)

  useEffect(() => {
    chrome.storage.sync.get(['misskey_token', 'misskey_server', 'misskey_cw', 'misskey_sensitive', 'misskey_access'], (result) => {
      const token = result.misskey_token; if (token) { setToken(token) }
      const server = result.misskey_server; if (server) { setServer(server) }
      setCw(result.misskey_cw)
      setSensitive(result.misskey_sensitive)
      setShowAccess(result.misskey_access)
    })
  }, [])
  
  const updateToken = (token: string) => {
    setToken(token)
    chrome.storage.sync.set({ misskey_token: token });
  }
  const updateServer = (server: string) => {
    setServer(server)
    if (!server.startsWith('https://')) { server = 'https://' + server }
    if (server.endsWith('/')) { server = server.slice(0, -1) }
    chrome.storage.sync.set({ misskey_server: server });
  }
  const updateCw = (cw: boolean) => {
    setCw(cw)
    chrome.storage.sync.set({ misskey_cw: cw })
  }
  const updateSensitive = (sensitive: boolean) => {
    setSensitive(sensitive)
    chrome.storage.sync.set({ misskey_sensitive: sensitive })
  }
  const updateAccess = (access: boolean) => {
    setShowAccess(access)
    chrome.storage.sync.set({ misskey_access: access })
  }

  const openDonationPage = () => {
    window.open(
      "https://pielotopica.booth.pm/items/4955538",
      "_blank",
      "noreferrer"
    );
  };
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
          placeholder={DEFAULT_INSTANCE_URL}
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
            checked={cw ?? false}
            onChange={(e) => {
              updateCw(e.target.checked)
            }}
          />}
          label={<Typography style={{ fontSize: 15 }}>Misskeyへの投稿にCWを設定する。</Typography>}          
        />

        <FormControlLabel
          control={<Checkbox
            checked={sensitive ?? false}
            onChange={(e) => {
              updateSensitive(e.target.checked)
            }
            }
          />}
          label={<Typography style={{ fontSize: 15 }}>投稿する全ての画像にNSFWを設定する。</Typography>}
        />

        <FormControlLabel
          control={<Checkbox
            checked={showAccess ?? true}
            onChange={(e) => {
              updateAccess(e.target.checked)
            }}
          />}
          label={<Typography style={{ fontSize: 15 }}>投稿の公開範囲設定ボタンを表示する。</Typography>}
        />

        <Typography
          sx={{
            display: "block",
            color: "#1976d2",
            mt: 2,
            textDecoration: "none",
            "&:hover": { textDecoration: "underline" },
          }}
          onClick={openDonationPage}
        >
          開発の支援をお願いします！ / Donation
        </Typography>
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
