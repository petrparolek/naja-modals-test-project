#!/bin/bash

apt update && apt install -y mc

cat /tmp/.bashrc > /root/.bashrc

bash
