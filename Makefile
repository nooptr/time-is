# Makefile — đóng gói extension vào thư mục dist/.
# Đây là extension JS thuần, không cần transpile; "build" = gom file cần thiết vào dist/.

DIST    := dist
NAME    := time-is
VERSION := $(shell python3 -c "import json;print(json.load(open('manifest.json'))['version'])")
ZIP     := $(DIST)/$(NAME)-$(VERSION).zip

# Các file/thư mục được đưa vào extension.
SOURCES := manifest.json background.js src icons

.PHONY: all build zip clean

all: build

# Gom các file extension vào dist/.
build: clean
	@mkdir -p $(DIST)
	@cp -R $(SOURCES) $(DIST)/
	@echo "Built $(NAME) v$(VERSION) -> $(DIST)/"

# Tạo file .zip để upload lên Chrome Web Store (zip nội dung, không kèm thư mục dist).
zip: build
	@cd $(DIST) && zip -rq $(NAME)-$(VERSION).zip $(SOURCES)
	@echo "Packaged -> $(ZIP)"

# Xoá thư mục dist.
clean:
	@rm -rf $(DIST)
