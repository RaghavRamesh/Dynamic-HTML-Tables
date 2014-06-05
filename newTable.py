import flask, flask.views
import HTML

class NewTable(flask.views.MethodView):
	def get(self):
		return flask.render_template("newtable.html")

	def createTable(self):
		f = open('templates/new1.html', 'w')
		table_data = [
	        ['Last name',   'First name',   'Age'],
	        ['Smith',       'John',         30],
	        ['Carpenter',   'Jack',         47],
	        ['Johnson',     'Paul',         62],
	    ]

		htmlcode = HTML.table(table_data)
		print htmlcode
		f.write(htmlcode)
