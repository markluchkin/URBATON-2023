import asyncio
import pymongo
from aiogram import Bot, Dispatcher
from aiogram.dispatcher.filters import Command, CommandStart
from config import TOKEN, DB_URL, TIME_SLEEP


stop_news = {}
organizations = {}
bot = Bot(token=TOKEN)
dp = Dispatcher(bot)
CLUSTER = pymongo.MongoClient(DB_URL)
DB = CLUSTER["test"]


@dp.message_handler(CommandStart())
async def start(message):
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


def check_news(db, chat_id):
    news = []
    count = 0
    for item in db['news'].find({'organization': organizations.get(chat_id, '')}):
        if chat_id not in item['sentTo']:
            news.append(item)
            count += 1
    if count:
        db['news'].update_many({'organization': organizations.get(chat_id, '')}, {"$push": {"sentTo": chat_id}})
    return news


@dp.message_handler(Command('auth'))
async def authorize(message):
    global organizations
    chat_id = message.chat.id
    text = message.text.split()
    try:
        login, password = text[1], text[2]
        check = check_user(DB, login, password)
        if check:
            await message.answer(text="*Авторизация прошла успешно*. \n"
                                      "Чтобы получать новости вашего заведения, введите /go", parse_mode="Markdown")
            organizations[chat_id] = check[0]['organization']

        else:
            await message.answer(text="Не удалось авторизоваться.")
    except IndexError:
        pass


@dp.message_handler(Command("go"))
async def check_send_news(message):
    global stop_news
    chat_id = message.chat.id
    stop_news[chat_id] = False
    await bot.send_message(chat_id, text=f"Вы успешно подписались на новости *{organizations.get(chat_id, '')}*. \n"
                                         f"Чтобы отписаться, введите /stop", parse_mode="Markdown")
    while not(stop_news[chat_id]):
        db = pymongo.MongoClient(DB_URL)["test"]
        news = check_news(db, chat_id)
        for i in news:
            await bot.send_message(chat_id, text=f"*{i['title']}*\n {i['text']}", parse_mode="Markdown")
        await asyncio.sleep(TIME_SLEEP)


@dp.message_handler(Command("stop"))
async def check_stop_news(message):
    chat_id = message.chat.id
    global stop_news
    stop_news[chat_id] = True
    await bot.send_message(chat_id, text=f"Вы отписались от новостей *{organizations.get(chat_id, '')}*", parse_mode="Markdown")


@dp.message_handler()
async def answer(message):
    chat_id = message.chat.id
    if not (stop_news[chat_id]):
        await bot.send_message(chat_id, text=f"К сожалению, такой команды нет. \n"
                                             f"Если вы хотите отписаться от новостей *{organizations.get(chat_id, '')}*, введите /stop", parse_mode="Markdown")
    else:
        await bot.send_message(chat_id, text="К сожалению, такой команды нет.")


async def main():
    await dp.start_polling()


if __name__ == '__main__':
    asyncio.run(main())
