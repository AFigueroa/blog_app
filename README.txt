ADB - Crud App with APIs
Antonio Figueroa
September 19, 2014

** To run this app in a browser... 
	1. Open the terminal..
	2. cd into the ADB-Crud dir
	3. if npm is installed...
		a. run "npm start"
	4. if node-dev is installed
		a. run "node-dev app.js"

Functionality:

1.  Description: Add a new post

	Inputs: author, title, content, category

	URL: "/posts/createaction?author=John&title=Hello%20World&content=My%20first%20post&category=General"

2.  Description: Update post

	Inputs: author, title, content, category AND postId

	URL: "/posts/setaction?postId=f5b0a3b0-406b-11e4-b024-f3380db2cfda&author=John&title=Hello%20World&content=Update%20is%20working&category=General"

3.  Description: Add a new Comment

	Inputs: author, content AND _id

	URL: "/comments/createaction?_id=f5b0a3b0-406b-11e4-b024-f3380db2cfda&author=Nancy&content=I%20like%20this%20app"


API's:

1. All Categories:
		Description: Shows all distinct categories as JSON
		URL	: "/categories/api"

		Example:

		[
			"General",
			"Gaming"
		]

1. All Posts:
		Description: Shows all posts and associated comments as JSON
		URL	: "/posts/api"

		Example:

		[
			{
				_id: "9c39eb30-406a-11e4-b024-f3380db2cfda",
				author: "Antonio",
				time: "September 19th 2014, 10:05:35 pm",
				category: "General",
				title: "Welcome to my site!",
				content: "Please feel free to create or update posts. You can also comment on each post. Thank you. Have fun!",
				comments: [ ]
			},
			{
				_id: "f5b0a3b0-406b-11e4-b024-f3380db2cfda",
				author: "John",
				time: "September 19th 2014, 10:15:15 pm",
				category: "General",
				title: "Hello World",
				content: "Update is working",
				comments: [
					{
						author: "Nancy",
						postId: "f5b0a3b0-406b-11e4-b024-f3380db2cfda",
						time: "September 19th 2014, 10:21:24 pm",
						content: "I like this app"
					}
				]
			}
		]