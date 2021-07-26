install:
ifeq (, $(wildcard ./.env))
	@echo Setting up the environment file
	@cp ./templates/template_env .env
	@read -p "Enter bot token: " token; \
	sed -i 's|<TOKEN>|'$$token'|g' .env
	@echo Done.
else
	@echo Found existing .env file, skipping this step.
endif

	@echo Installing packages...
	@npm i
	@echo Done.
	@echo Setting up the systemd service...
	@sed -i 's|WORKINGDIRECTORY|'$(PWD)'|g' AutoUpdateBot.service
	@sed -i 's|USER|'$(USER)'|g' AutoUpdateBot.service
	@sudo cp ./AutoUpdateBot.service /etc/systemd/system
	@sudo systemctl daemon-reload
	@echo Done.
	@echo Starting bot...
	@sudo service AutoUpdateBot start
	@echo Done.

uninstall:
	@echo Stopping bot...
	@sudo service AutoUpdateBot stop
	@echo Done.
	@echo Removing systemd service...
	@sed -i 's|'$(PWD)'|WORKINGDIRECTORY|g' AutoUpdateBot.service
	@sed -i 's|'$(USER)'|USER|g' AutoUpdateBot.service
	@sudo rm /etc/systemd/system/AutoUpdateBot.service
	@sudo systemctl daemon-reload
	@echo Done.
	@echo Deleting node_modules/
	@sudo rm node_modules -r
	@echo Done
