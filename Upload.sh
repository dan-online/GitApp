cd Desktop;
npm version $1 --allow-same-version;
sudo npm run release;
cd ..;
cd Android;
npm version $1 --allow-same-version;
git add .;
git commit -m "Bump: $1";
sudo npm run package;
echo 'Uploading apk...';
sudo github-release upload --token `git config github.token` --owner 'dan-online' --repo 'GitApp' --tag "v$1" --file 'dist/app.apk' --name "GitApp-android-$1.apk";
cd ..;
echo "{
    \"version\": \"$1\",
    \"state\": \"stable\",
    \"scope\": \"minor bugfix\",
    \"changes\": \"Features and bug fixes\",
    \"download\": \"https://github.com/dan-online/GitApp/releases/tag/v$1\"
}" > releases.json;
git add .;
git commit -m "Bump: $1";
curl https://api.github.com/repos/dan-online/GitApp/releases -H "Authorization: token "`git config github.token` > file.json;
ID=`node -e "console.log(require('./file.json')[0].id)"`;
curl -H "Content-Type:application/json" --data "{\"name\":\"GitApp v$1\", \"body\": \"$2\", \"prerelease\": \"false\"}" "https://api.github.com/repos/dan-online/GitApp/releases/$ID" -H "Authorization: token "`git config github.token` -X PATCH;
rm file.json;

