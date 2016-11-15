Assignment 4 - Persistence by Gavin Hayes
===


Technical Achievement
---

The movie insert textbox is setup with javascript that clears the "Enter movie" text when focused or clicked, but does not clear it when you have started entering a movie name encase a user needs to reference another source before typing the movie name.

The popcorn sidebars are now implemented by having repeating the popcorn backgroud image across the whole page, having fixed position and having the content div have a higher zindex.

Two versions of removeMovie were implemented, one that uses all "sync" functions and another that uses the asychronized versions except for writing. The "sync" version is used due to less potential for corrupting the movies file or loosing information.

