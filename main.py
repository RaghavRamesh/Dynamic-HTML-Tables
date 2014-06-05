from flask import Flask
from newTable import NewTable

app = Flask(__name__)

app.add_url_rule('/',
	view_func=NewTable.as_view('newtable'),
	methods=['GET'])

if __name__ == '__main__':
	app.run(debug = 'TRUE')