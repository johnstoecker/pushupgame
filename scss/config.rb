# $ext_path: This should be the path of where the sencha touch SDK is installed
# Generally this will be in a lib/touch folder in your applications root
# <root>/lib/touch-222
$ext_path = "../../lib/touch-2.3.0"

# sass_path: the directory the Sass files are in. 
sass_path = File.dirname("..")

# css_path: the directory you want your CSS files to be.
css_path = File.join(sass_path, "..", "css")

# Delinate the images directory
images_dir = File.join(sass_path, "../resources", "images")

# output_style: The output style for your compiled CSS
# nested, expanded, compact, compressed
output_style = :expanded
environment = :development

# We need to load in the Ext4 themes folder, which includes all it's default styling, images, variables and mixins
load File.join(File.dirname(__FILE__), $ext_path, 'resources', 'themes')