#! /bin/sh
yarn dev --host 0.0.0.0 --env.network $NETWORK
exec "$@"
