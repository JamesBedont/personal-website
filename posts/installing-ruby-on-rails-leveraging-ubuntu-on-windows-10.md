---
title: Installing Ruby on Rails Leveraging Ubuntu on Windows 10
date: 07/23/2017
description: Installing Ruby on Rails Leveraging Ubuntu on Windows 10
---

### Background

Its been my experience that getting Ruby and by extension Rails setup on a Windows machine can be difficult and headache inducing. It is also my experience that upon getting it all setup it runs just a bit slower than on Linux or OSX.

Because of the challenges surrounding Ruby on Windows the best solution often involves either [Docker](https://docs.docker.com/compose/rails/) or Virtual Machines. Although there is nothing wrong with those solutions another one has arrived; [Ubuntu on Windows 10](https://blogs.windows.com/buildingapps/2016/03/30/run-bash-on-ubuntu-on-windows/#psSTUpZWO53T1Ly4.97).

Put simply Microsoft has developed "Windows Subsystem for Linux (WSL)" which Ubuntu is run on. It allows for files on a Windows machine to be interacted with using Linux command-line tools as well as providing a genuine Ubuntu Linux environment within Windows.

Ruby on Rails can now be installed and ran within a Ubuntu environment while accessing application code located on the Windows File System. This means we can use windows applications like Visual Studio Code to modify the application code but have it be served through the Ubuntu environment.

### Enabling Ubuntu on Windows 10

You must be running 64bit Windows 10 with the Anniversary Update or later. And follow the [MSDN installation instructions](https://msdn.microsoft.com/en-us/commandline/wsl/install_guide)

### Installing Ruby on Rails

After the restart you should be able to press the start menu type in "ubuntu" and see the following new program. Clicking on it opens up a bash shell.

![Ubuntu on Windows](/windowsrails/ubuntuapp.webp)

It is within Bash where we will be installing Ruby on Rails. Because this isn't a post about how to install Ruby on Rails on Ubuntu I will link to a [great guide on how to do just that](https://gorails.com/setup/ubuntu/14.04). Since we are now in a Ubuntu Bash Shell we can treat it as such and follow any Ubuntu resources.

### Conceptual Overview

Now that we have enabled Ubuntu on Windows and installing Ruby on Rails in that environment we are ready to generate a new project.

It's now when I would like to point out that [using Windows apps and tools to change Linux files is a bad idea and can lead to data loss](https://blogs.msdn.microsoft.com/commandline/2016/11/17/do-not-change-linux-files-using-windows-apps-and-tools). Instead we will be using Linux to modify Windows files which is completely fine and [within the intended use of WSL](https://blogs.msdn.microsoft.com/commandline/2016/11/17/do-not-change-linux-files-using-windows-apps-and-tools/#comment-25677).

Within our Bash shell the Windows File System can be found at `/mnt/`. Below is a comparison of `/mnt/c` and the C drive contents navigated to from the file explorer. Notice that they are identical; we are now navigating into the Windows File System from Linux.

![mnt/c and C drive compare](/windowsrails/mntcompare.webp)

So long as we generate the Rails project within the Windows File System (`/mnt`) we are inline with intended use and at no risk of data loss. Not to mention we can then modify those files as we would for any other Windows files.

### Generating a New Rails App

I have found that the best thing to do first is create a [symlink](https://en.wikipedia.org/wiki/Symbolic_link) to our Windows development folder. For this post I have created the following directory within windows `E:\documents\ruby_projects` which from within the Bash shell is `/mnt/e/documents/ruby_projects`.

![creating a symlink](/windowsrails/symlink.webp)

`$ ln -s TARGET LINK_NAME`

1. change directories into `~/ruby_projects` and see files that are actually located at `/mnt/e/documents/ruby_projects`
2. `$ rails new blog` to generate a new Rails app named "blog"
3. CD into the new blog directory and do `$ rails server` which will start a server listening on port 3000
4. Navigate to `localhost:3000` within a Windows web browser.

![rails setup success image](/windowsrails/rails_setup_success.webp)

Success! Note how that message is saying Ruby is running within Linux.

Now you can open up your favorite text editor/IDE in Windows and edit the files at `E:\documents\ruby_projects` just like normal. The changes will be seen by the Rails server running on Ubuntu and reflected on localhost.
