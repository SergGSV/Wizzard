#!/bin/bash

# Кольори для виводу
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Масив серверів: "назва|користувач|хост|порт"
declare -a SERVERS=(
    "Production Server|root|prod.example.com|22"
    "Development Server|developer|dev.example.com|22"
    "Testing Server|ubuntu|test.example.com|2222"
    "Database Server|admin|db.example.com|22"
)

echo -e "${BLUE}=== SSH Connection Manager ===${NC}\n"

# Виводимо список серверів
echo -e "${GREEN}Доступні сервери:${NC}"
for i in "${!SERVERS[@]}"; do
    IFS='|' read -r name user host port <<< "${SERVERS[$i]}"
    echo -e "${YELLOW}$((i+1)).${NC} $name (${user}@${host}:${port})"
done

echo ""

# Запитуємо вибір користувача
while true; do
    read -p "Оберіть сервер (1-${#SERVERS[@]}) або 'q' для виходу: " choice

    if [[ "$choice" == "q" ]] || [[ "$choice" == "Q" ]]; then
        echo -e "${YELLOW}Вихід...${NC}"
        exit 0
    fi

    if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le "${#SERVERS[@]}" ]; then
        break
    else
        echo -e "${RED}Невірний вибір. Спробуйте ще раз.${NC}"
    fi
done

# Отримуємо дані обраного сервера
index=$((choice-1))
IFS='|' read -r name user host port <<< "${SERVERS[$index]}"

echo -e "\n${GREEN}Підключення до: ${BLUE}$name${NC}"
echo -e "${GREEN}Користувач: ${BLUE}$user${NC}"
echo -e "${GREEN}Хост: ${BLUE}$host${NC}"
echo -e "${GREEN}Порт: ${BLUE}$port${NC}\n"

# Виконуємо SSH підключення
if [ "$port" == "22" ]; then
    ssh "$user@$host"
else
    ssh -p "$port" "$user@$host"
fi

# Перевірка статусу виходу
if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}З'єднання завершено успішно.${NC}"
else
    echo -e "\n${RED}Помилка підключення!${NC}"
    exit 1
fi
