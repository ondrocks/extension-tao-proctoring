/**
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; under version 2
 * of the License (non-upgradable).
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 *
 * Copyright (c) 2015 (original work) Open Assessment Technologies SA ;
 */
/**
 * @author Sam <sam@taotesting.com>
 */
define([
    'lodash',
    'jquery',
    'i18n',
    'helpers',
    'users',
    'layout/loading-bar',
    'ui/listbox',
    'util/encode',
    'ui/feedback',
    'ui/bulkActionPopup',
    'taoProctoring/component/breadcrumbs',
    'tpl!taoProctoring/component/proctorForm/form'
], function(_, $, __, helpers, users, loadingBar, listBox, encode, feedback, bulkActionPopup, breadcrumbsFactory, formTpl){
    'use strict';

    //service urls:
    var proctorFormUrl = helpers._url('createProctorForm', 'ProctorManager', 'taoProctoring');
    var proctorLoginCheckUrl = helpers._url('checkLogin', 'ProctorManager', 'taoProctoring');

    function renderFormFromData($container, formData){
        $container.html(formTpl({
            form : formData.form
        }));
        users.checkLogin(formData.loginId, proctorLoginCheckUrl);
    }

    function init($container){

        $.get(proctorFormUrl, function(formData){

            renderFormFromData($container, formData);

            $container.on('submit', 'form', function(e){

                var $form = $(this);
                var fields = $form.serializeArray();
                var data = {
                    testCenters : [] //get the testCenter from the test center datalist component
                };
                _.each(fields, function(field){
                    data[field.name] = field.value;
                });

                $.post(proctorFormUrl, data, function(res){
                    if(res.created){
                        feedback().success(__('Proctor created'));
                        $container.empty();
                    }else{
                        renderFormFromData($container, res);
                    }
                });

                e.preventDefault();
            });
        });
    }

    return {
        init : init
    };
});
