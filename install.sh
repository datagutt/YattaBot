#/bin/bash
cp config.example.json config.json
npm install
mkdir db
echo "{}" >> db/users.json
echo "Enter your hostname";
read hostname;
echo '{"$file":{"level":"3","autoOP":true}}' >> users.json
