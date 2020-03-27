package com.mgenio.aws.mongooseos.neopixels.async;

import android.os.AsyncTask;

import com.amazonaws.services.iotdata.AWSIotDataClient;
import com.amazonaws.services.iotdata.model.UpdateThingShadowRequest;
import com.amazonaws.services.iotdata.model.UpdateThingShadowResult;
import com.mgenio.aws.mongooseos.neopixels.interfaces.OnUpdateThingShadow;

import java.nio.ByteBuffer;

/**
 * Created by Austin Nelson on 5/25/2017.
 */
public class UpdateDeviceShadow extends AsyncTask<String, Void, String> {
    private AWSIotDataClient awsIotDataClient;
    private OnUpdateThingShadow updateThingShadow;

    public UpdateDeviceShadow(AWSIotDataClient awsIotDataClient, OnUpdateThingShadow updateThingShadow) {
        this.awsIotDataClient = awsIotDataClient;
        this.updateThingShadow = updateThingShadow;
    }

    public UpdateDeviceShadow(AWSIotDataClient awsIotDataClient) {
        this.awsIotDataClient = awsIotDataClient;
    }

    @Override
    protected String doInBackground(String... params) {
        final ByteBuffer payload = ByteBuffer.wrap(params[1].getBytes());

        final UpdateThingShadowRequest updateThingShadowRequest = new UpdateThingShadowRequest().withThingName(params[0]);
        updateThingShadowRequest.setPayload(payload);
        final UpdateThingShadowResult response = awsIotDataClient.updateThingShadow(updateThingShadowRequest);

        final byte[] bytes = new byte[response.getPayload().remaining()];
        response.getPayload().get(bytes);
        return new String(bytes);
    }

    @Override
    protected void onPostExecute(String result) {
        if (null != updateThingShadow) {
            updateThingShadow.onUpdateResult(result);
        }
    }
}
