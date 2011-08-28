# Unicorn Easy Restart Daemon
This node.js daemon is designed to make your life really easy while deploying
new versions of applications that are running under a Unicorn Server, while not
sacrificing security.

Those of us who have some experience in working with the Passenger module for
Apache know that if you run `touch tmp/restart.txt` then Passenger will reload
your code on the next request. Unicorn includes similar functionality through the
use of the USR2 OS Signal.

However, what if you're running a Unicorn server in a typical production
configuration where the master is running as root and the workers are running as
a less privilidged user (i.e. "www-data" on Debian/Ubuntu systems). Your job is
now a little bit more complex, because you have to make sure you send the USR2
signal as root. Not really that bad.

However, let's add a third dimension: you're doing all your deployments via git
by doing something along the lines of `git push production master` every time
you're ready to deploy the new code. If you're clever you will have set up your
post-recieve hook to automaticly reset the production copy of your code, but what
about restarting Unicorn? Well, unless you're pushing stuff up to your server as
root (which you really shouldn't do) - your post_recieve script can't help you.
You will be required to go into the server manually and send Unicorn that fateful
USR2 to load up your shiny new code.

## Enter the Unicorn Easy Restart Daemon (UERD)!
UERD is designed to make your life easier by allowing you to touch a restart.txt
file and have your entire application reloaded.

The entire daemon simply sits and listens to one or many restart.txt files in
one or many Rails projects. When a restart.txt file is updated for a particular
project, it will send the USR2 signal to Unicorn and trigger the reboot.

If you run the daemon as root, your issues of having to go into your terminal
to load new code are solved. Your post-recieve script for git can now refresh
the working copy on the server AND reload your unicorn instance.

# Getting Started

## Requirements
URED requires:
* node.js - built against v0.4.11, but may work with older/newer
* [optimist module](https://github.com/substack/node-optimist) for node.js
* forever module if you want it to detach from the shell

## Assumptions
URED makes the following assumptions about your environment. These are a little
bit different than the standard environment simply because mine was a little bit
different:
* The unicorn.pid file will be located at RAILS_ROOT/tmp/unicorn.pid
* The restart.txt file will be located at RAILS_ROOT/tmp/restart.txt
* You're running URED as a user privilidged enough to send USR2 to Unicorn

## Usage
To start URED, use the following format from the root directory of the git repo:

`sudo node unicorneasyrestart.js -p [RAILS_ROOT]`

You may repeat `p` as many times as you need to watch multiple projects at once.

# TODO
* Allow for configuration of location of unicorn.pid
* Allow for configuration of location of restart.txt
