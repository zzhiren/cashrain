# /bin/bash
mongo
if [$mongo -eq 0]; then
    ./mongo use admin
else
    echo 'use admin'
fi

if [$? -eq 0]; then
    echo "db.shutdownServer()"
else
    echo `failed`

#echo '/usr/local/mongodb/bin/mongo'
#if [$? -ne 0]; then
#    echo "failed"
#else
#    echo `use admin`
#
#if [$? -ne 0]; then
#    echo "failed"
#else
#    echo `db.shutdownServer()`