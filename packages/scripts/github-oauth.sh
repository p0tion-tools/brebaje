
CLIENT_ID=Ov23liT3u8hVgC7BIwd9
CLIENT_SECRET=bb6282cd411f08f54360d3406b3de4d5a59f3aad


#curl -s -X POST "https://github.com/login/oauth/access_token" \
#  -H "Accept: application/json" \
#  -d "client_id=$CLIENT_ID" \
#  -d "client_secret=$CLIENT_SECRET" \
#  -d "code=$CODE"



curl -s -X POST "https://github.com/login/oauth/authorize" \
  -H "Accept: application/json" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=$CLIENT_ID&scope=user:email"