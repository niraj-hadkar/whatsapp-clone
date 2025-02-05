package fr.codecake.whatsappclone.messaging.domain.user.vo;

import fr.codecake.whatsappclone.shared.error.domain.Assert;

public record UserFirstName(String value) {

    public UserFirstName {
        Assert.field(value, value).maxLength(255);
    }

}
