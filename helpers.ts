import { IMessageBuilder, IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';

import { IUser } from '@rocket.chat/apps-engine/definition/users';

import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';

export async function startNewMessageWithDefaultSenderConfig(modify: IModify, read: IRead, sender: IUser, room?: IRoom): Promise<IMessageBuilder> {
    const settingsReader = read.getEnvironmentReader().getSettings();
    const userAliasSetting = await settingsReader.getValueById('user_alias');
    const userAvatarSetting = await settingsReader.getValueById('user_avatar');

    const msg = modify.getCreator().startMessage()
        .setGroupable(false)
        .setSender(sender)
        .setUsernameAlias(userAliasSetting)
        .setAvatarUrl(userAvatarSetting);

    if (room) {
        msg.setRoom(room);
    }

    return msg;
}
