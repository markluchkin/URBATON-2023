import asyncio
import pymongo
import time
from aiogram import Bot, Dispatcher, types
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton
from aiogram.dispatcher.filters import Command, CommandStart
from config import TOKEN, DB_URL


bot = Bot(token=TOKEN)
dp = Dispatcher(bot)
CLUSTER = pymongo.MongoClient(DB_URL)
DB = CLUSTER["test"]
organization = ""
chat_id = 0


@dp.message_handler(CommandStart())
async def start(message: types.Message):
    user_full_name = message.from_user.full_name
    await message.answer(f"Здравствуйте, {user_full_name}. \n"
                         f"Чтобы продолжить, введите: /auth <ваш логин> <ваш пароль>. \n"
                         f"Пример: /auth qwerty@gmail.com qwerty123",)


def check_user(db, login, password):
    for coll in db.list_collection_names():
        collection = db[coll]
        check = list(collection.find({'email': login, 'password': password}))
        if check:
            return check
    return


def check_news(db):
    news = []
    count = 0
    for i in db['news'].find({'organization': organization}):
        if chat_id not in i['sentTo']:
            news.append(i)
            count += 1
    if count:
        db['news'].update_many({'organization': organization}, {"$push": {"sentTo": chat_id}})
    return news


@dp.message_handler(Command('auth'))
async def authorize(message: types.Message):

    global chat_id
    global organization
    chat_id = message.chat.id
    text = message.text.split()
    login, password = text[1], text[2]
    check = check_user(DB, login, password)
    if check:
        await message.answer(text="Авторизация прошла успешно")
        organization = check[0]['organization']

    else:
        await message.answer(text="Не удалось авторизоваться")


@dp.message_handler(Command("go"))
async def check_send_news(message):
    while True:
        DB = pymongo.MongoClient(DB_URL)["test"]
        news = check_news(DB)
        for i in news:
            await bot.send_message(chat_id, text=f"*{i['title']}*\n {i['text']}", parse_mode="Markdown")
        await asyncio.sleep(30)


async def main():
    await dp.start_polling()


if __name__ == '__main__':
    asyncio.run(main())
