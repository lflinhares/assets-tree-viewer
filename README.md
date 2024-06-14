Presentation video:

https://www.youtube.com/watch?v=7hmbpMN8las

Notes:

- There is one asset with the "status" property, it appears on 1:07 of the presentation video, not sure if it should be hidden since its not a component, but I chose to keep it in the tree. In a real scenario I would contact the api team to clarify this.

- Not sure if the location/asset input filter should return only absolute matchs, I chose to use .includes() instead of a directly comparison between filter and value (value === filter) to have a more dynamic search, so the user does not have to type all the text to find a result.
